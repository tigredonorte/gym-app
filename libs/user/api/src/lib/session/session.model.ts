import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IAccessLog, IDeviceInfoDto, ISession, SessionStatus } from '@gym-app/user/types';
import { AccessLogSchema } from './accessLog.model';

@Schema({ timestamps: true })
export class Session implements ISession {
  @Prop({ required: true })
    userId!: string;

  @Prop({ type: Object })
    deviceInfo!: IDeviceInfoDto;

  @Prop({ required: true })
    sessionId!: string;

  @Prop({ type: String, enum: SessionStatus, default: SessionStatus.ACTIVE })
    status!: SessionStatus;

  @Prop({ required: true })
    currentAccessId!: string;

  @Prop({ type: [AccessLogSchema], default: [] })
    access!: IAccessLog[];

  @Prop({ required: true })
    token!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
