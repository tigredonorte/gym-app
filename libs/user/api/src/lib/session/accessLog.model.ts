import { AccessLogType, ILocationDto } from '@gym-app/user/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AccessLog implements AccessLogType {
  @Prop({ required: true })
    ip!: string;

  @Prop({ type: Object, required: true })
    location!: ILocationDto;

  @Prop()
    logoutDate?: Date;
}

export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);
export type AccessLogDocument = AccessLog & Document;