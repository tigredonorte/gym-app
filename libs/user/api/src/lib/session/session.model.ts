import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IAccessLog, IDeviceInfo, ISession } from '../interfaces';
import { AccessLogSchema } from './accessLog.model';

@Schema({ timestamps: true })
export class Session implements ISession {
  @Prop({ required: true })
    userId!: string;

  @Prop({ type: Object })
    deviceInfo!: IDeviceInfo;

  @Prop({ required: true })
    sessionId!: string;

  @Prop({ default: 'active' })
    status: 'active' | 'inactive' = 'active';

  @Prop({ type: [AccessLogSchema], default: [] })
    access!: IAccessLog[];

  @Prop({ required: true })
    token!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
