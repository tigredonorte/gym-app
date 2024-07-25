import { IRequestInfo } from '@gym-app/user/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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