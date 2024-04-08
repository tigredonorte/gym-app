import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './session.schema';
import { ISession } from './session.interfaces';

@Injectable()
export class SessionService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

  async createSession(sessionDto: Omit<ISession, 'accessDate'>): Promise<ISession & { id: string }> {
    const newSession = new this.sessionModel({
      ...sessionDto,
      accessDate: new Date(),
    });
    const savedSession = await newSession.save();
    const sessionObject = savedSession.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = sessionObject;
    return { id: _id.toString(), ...rest };
  }

  async findSessionById(id: string): Promise<ISession | null> {
    return this.sessionModel.findById(id);
  }

  async deleteSessionById(id: string): Promise<void> {
    await this.sessionModel.findByIdAndDelete(id);
  }
}
