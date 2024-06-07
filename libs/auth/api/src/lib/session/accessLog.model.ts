import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IRequestInfo } from '../request-info-middleware';

@Schema({ timestamps: true })
class AccessLog {

  @Prop()
  ip!: string;

  @Prop({ type: Object })
  location!: IRequestInfo['userData']['location'];

  @Prop()
  logoutDate?: Date;
}

export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);
export type AccessLogDocument = AccessLog & Document;