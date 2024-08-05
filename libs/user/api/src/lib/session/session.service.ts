import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { IAccessLog, IRequestInfo, ISession } from '../interfaces';
import { SessionNotFoundError } from './SessionNotFoundError';
import { Session, SessionDocument } from './session.model';

/**
 * Session id doesn't need to be secure, it's just a hash of the user data
 */
const salt = '$2b$10$endMLAWCpi9NHHC0mr5Mge';
export interface PaginationResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
@Injectable()
export class SessionService {

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async createSession(userId: string, userData: IRequestInfo['userData'], token: string): Promise<{ sessionId: string, accessId: string }> {
    const accessData: IAccessLog = {  _id: new Types.ObjectId().toString(), ip: userData.ip || '' , location: userData.location } as IAccessLog;
    const sessionId = await this.getSessionHash(userData);
    const deviceInfo = userData.deviceInfo || ({} as IRequestInfo['userData']['deviceInfo']);

    const session = await this.sessionModel.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          userId,
          sessionId,
          token,
          deviceInfo,
          status: 'active',
          currentAccessId: accessData._id,
        },
        $push: { access: accessData },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    if (!session) {
      throw new Error('Session creation failed');
    }
    const isNew = session.createdAt.getTime() === session.updatedAt.getTime();
    const id: string = session._id.toString();
    const accessId: string = session.access[session.access.length - 1]._id.toString();
    console.info(`Session with id ${id} and access id ${accessId} was ${isNew ? 'created' : 'updated'} for user ${userId}`);
    return {
      sessionId: id,
      accessId,
    };
  }

  async getSessionByToken(token: string): Promise<ISession & { _id: string } | null> {
    return await this.sessionModel.findOne({ token }).select('-access').exec();
  }

  async updateSessionToken(id: string, token: string): Promise<void> {
    await this.sessionModel.updateOne({ _id: id }, { $set: { token } }).exec();
  }

  async getSessionHash(
    userData: IRequestInfo['userData']
  ): Promise<string> {
    return await bcrypt.hash(JSON.stringify(userData), salt);
  }

  async removeSession(id: string, accessId: string): Promise<string> {
    const session = await this.sessionModel.findOneAndUpdate(
      {
        _id: id,
        access: {
          $elemMatch: {
            _id: accessId,
            logoutDate: { $exists: false }
          }
        }
      },
      {
        $set: {
          'access.$.logoutDate': new Date(),
          status: 'inactive',
        },
      },
      { new: true, fields: { userId: 1 } }
    ).exec();

    if (!session) {
      throw new SessionNotFoundError(`Access with id ${accessId} not found, or the session has already been logged out.`);
    }

    return session.userId;
  }

  async isFirstTimeOnDevice(userDataOrSessionId: IRequestInfo['userData'] | string): Promise<boolean> {
    const sessionId = (typeof userDataOrSessionId === 'string') ? userDataOrSessionId : await this.getSessionHash(userDataOrSessionId);
    const session = await this.sessionModel.findOne({ sessionId }).select('_id').exec();
    return !session;
  }

  async getSession(id: string): Promise<ISession | null> {
    return await this.sessionModel.findById(id).exec();
  }

  async getUserSession(userId: string): Promise<ISession[]> {
    const data = await this.sessionModel
      .find({ userId }, { access: 0 })
      .exec();

    return data.map((session) => session.toJSON());
  }

  async getAccessInfo(userId: string, offset: number, limit: number): Promise<PaginationResult<IAccessLog[]>> {
    const [totalCountData] = await this.sessionModel.aggregate([
      { $match: { userId } },
      { $unwind: '$access' },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0, count: 1 } }
    ]).exec();

    const totalItems = totalCountData?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const data = await this.sessionModel.aggregate([
      { $match: { userId } },
      { $unwind: '$access' },
      { $sort: { 'access.createdAt': -1 } },
      { $skip: offset },
      { $limit: limit },
      {
        $group: {
          _id: '$_id',
          access: { $push: '$access' },
        },
      },
      { $project: { access: 1, _id: 0 } }
    ]).exec();

    const items = data.flatMap((session) => session.access);

    return { items, currentPage, totalPages, totalItems };
  }

}
