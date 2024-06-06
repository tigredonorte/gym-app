import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './session.dto';
import { IRequestInfo } from '../request-info-middleware';
import { SessionNotFoundError } from './SessionNotFoundError';
import { Session, SessionDocument } from './session.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SessionService {

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}
  

  async createSession(id: string, userData: IRequestInfo['userData']): Promise<string> {
    const sessionData: CreateSessionDto = {
      userId: id,
      ip: userData.ip || '',
      location: userData.location || null,
      deviceInfo: userData.deviceInfo || ({} as IRequestInfo['userData']['deviceInfo']),
    };

    const session = new this.sessionModel(sessionData);
    const data = await session.save();

    return data._id.toString();
  }

  async removeSession(id: string): Promise<void> {
    const session = await this.sessionModel.findById(id).exec();
    if (!session) {
      throw new SessionNotFoundError('Session not found');
    }
    await this.sessionModel.deleteOne({ _id: id }).exec();
  }

  async getSession(id: string): Promise<SessionDocument | null> {
    return await this.sessionModel.findById(id).exec();
  }
}
