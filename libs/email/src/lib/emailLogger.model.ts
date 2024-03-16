import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
export class EmailLogger {
  @Prop({ required: true })
  template!: string;

  @Prop({ required: true, minlength: 3 })
  date!: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  details!: Record<string, unknown> | string;
}

export type EmailLoggerDocument = EmailLogger & Document;

export const EmailLoggerSchema = SchemaFactory.createForClass(EmailLogger);
