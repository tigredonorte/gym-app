import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccessLogType, ILocation } from '../interfaces';

@Schema({ timestamps: true })
class AccessLog implements AccessLogType {

  @Prop()
    ip!: string;

  @Prop({ type: Object })
    location!: ILocation;

  @Prop()
    logoutDate?: Date;
}

export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);
export type AccessLogDocument = AccessLog & Document;