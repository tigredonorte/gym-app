import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { EmailLogger, EmailLoggerDocument } from './emailLogger.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EmailLoggerService {
  constructor(
    @InjectModel('EmailLogger') private emailLoggerModel: Model<EmailLoggerDocument>,
  ) {}

  public async saveEmailLog(data: EmailLogger): Promise<EmailLogger> {
    const emailLog = new this.emailLoggerModel(data);
    await emailLog.save();
    return emailLog;
  }
}
