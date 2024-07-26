import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { IAccessLog, IRequestInfo, ISession } from '../interfaces';
import { SessionAlreadyLoggedOut } from './SessionAlreadyLoggedOut';
import { SessionNotFoundError } from './SessionNotFoundError';
import { Session, SessionDocument } from './session.model';

/**
 * Session id doesn't need to be secure, it's just a hash of the user data
 */
const salt = '$2b$10$endMLAWCpi9NHHC0mr5Mge';

@Injectable()
export class SessionService {

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async createSession(userId: string, userData: IRequestInfo['userData'], token: string): Promise<string> {
    const accessData: IAccessLog = { ip: userData.ip || '' , location: userData.location } as IAccessLog;
    const sessionId = await this.getSessionHash(userData);
    let session = await this.findSessionById(sessionId);
    if (session) {
      session.status = 'active';
      session.access.push(accessData);
      await session.save();
      const id = session._id.toString();
      console.info(`Session with id ${id} already exists for user ${userId}. Updated with new access log.`);
      return id;
    }

    session = new this.sessionModel({
      userId,
      sessionId,
      token,
      deviceInfo: userData.deviceInfo || ({} as IRequestInfo['userData']['deviceInfo']),
      access: [accessData],
    });
    const data = await session.save();

    const id = data._id.toString();
    console.info(`Session with id ${id} created for user ${userId}`);
    return id;
  }

  async getSessionHash(userData: IRequestInfo['userData']): Promise<string> {
    return await bcrypt.hash(JSON.stringify(userData), salt);
  }

  async findSessionById(sessionId: string): Promise<SessionDocument | null> {
    return await this.sessionModel.findOne({ sessionId }).exec();
  }

  async removeSession(id: string): Promise<string> {
    const session = await this.sessionModel.findById(id).exec();
    if (!session) {
      throw new SessionNotFoundError(`Session with id ${id} not found`);
    }

    const lastAccess = session.access[session.access.length - 1];
    if (!lastAccess) {
      throw new SessionNotFoundError(`Session with id ${id} not found - no access logs found`);
    }

    if (lastAccess.logoutDate) {
      throw new SessionAlreadyLoggedOut(`Session with id ${id} is already logged out`);
    }

    session.access[session.access.length - 1].logoutDate = new Date();
    session.status = 'inactive';
    await session.save();
    return session.userId;
  }

  async isFirstTimeOnDevice(userDataOrSessionId: IRequestInfo['userData'] | string): Promise<boolean> {
    const sessionId = (typeof userDataOrSessionId === 'string') ? userDataOrSessionId : await this.getSessionHash(userDataOrSessionId);
    console.log({ userDataOrSessionId, sessionId }, JSON.stringify(userDataOrSessionId, null, 2));
    const session = await this.sessionModel.findOne({ sessionId }).select('_id').exec();
    return !session;
  }

  async getSession(id: string): Promise<ISession | null> {
    return await this.sessionModel.findById(id).exec();
  }

  async getUserSession(userId: string): Promise<ISession[]> {
    console.log(userId);
    const data = await this.sessionModel.find({ userId }).exec();
    console.info(`Found ${data.length} sessions for user ${userId}`);
    return data.map((session) => session.toJSON());
  }
}
