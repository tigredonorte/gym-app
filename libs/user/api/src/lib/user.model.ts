import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude, Type } from 'class-transformer';

class RecoverCode {
  @Prop()
  code?: string;

  @Prop()
  expiresAt!: Date;

  @Prop()
  createdAt!: Date;

  @Prop()
  changePasswordCode?: string;
}

@Schema()
export class User {
  @Prop({ required: false, minlength: 3 })
  name!: string;

  @Prop({ required: false, unique: true })
  email!: string;

  @Exclude()
  @Prop({ required: false, minlength: 10, select: false })
  password!: string;

  @Exclude()
  @Type(() => RecoverCode)
  @Prop({ type: RecoverCode, required: false, select: false })
  recoverCode?: RecoverCode;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);