import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IRequestInfo } from '@gym-app/user/api';
import { AccessLogSchema } from './accessLog.model';
import { AccessLog } from './session.dto';

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true })
    userId!: string;

  @Prop({ type: Object })
    deviceInfo!: IRequestInfo['userData']['deviceInfo'];

  @Prop({ required: true })
    sessionId!: string;

  @Prop({ default: 'active' })
    status: 'active' | 'inactive' = 'active';

  @Prop({ type: [AccessLogSchema], default: [] })
    access!: AccessLog[];
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
