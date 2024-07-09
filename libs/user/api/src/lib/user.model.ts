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

export interface IUser {
  id: string;
  name: string;
  email: string;
  confirmed: boolean;
  password?: string;
  recoverCode?: RecoverCode;
}

@Schema()
export class User implements Omit<IUser, 'id'> {
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

  @Prop({ required: false, default: false })
    confirmed!: boolean;

  @Prop({ required: false, default: [], select: false })
    emailHistory!: {
    email: string,
    createdAt: Date,
    confirmed: boolean,
    changeEmailCode?: string,
    revertChangeEmailCode?: string,
    oldEmail: string
  }[];

}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);