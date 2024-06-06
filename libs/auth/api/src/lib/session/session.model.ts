// session.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IRequestInfo } from '../request-info-middleware';

@Schema()
export class Session {
  @Prop({ required: true })
  sessionId!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  ip!: string;

  @Prop({ type: Object })
  deviceInfo!: IRequestInfo['userData']['deviceInfo'];

  @Prop({ type: Object, default: null })
  location!: IRequestInfo['userData']['location'];
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
