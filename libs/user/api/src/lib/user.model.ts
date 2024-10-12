import { IRecoveredCode, IUserDto, IUserEmailHistory, IUserPasswordHistory } from '@gym-app/user/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import { Document } from 'mongoose';

class RecoverCode implements IRecoveredCode {
  @Prop() code?: string;
  @Prop() expiresAt!: Date;
  @Prop() createdAt!: Date;
  @Prop() changePasswordCode?: string;
}

class UserEmailHistory implements IUserEmailHistory {
  @Prop() email!: string;
  @Prop() createdAt!: Date;
  @Prop() confirmed!: boolean;
  @Prop() changeEmailCode?: string;
  @Prop() revertChangeEmailCode?: string;
  @Prop() oldEmail!: string;
}

class UserPasswordHistory implements IUserPasswordHistory {
  @Prop() password!: string;
  @Prop() createdAt!: Date;
  @Prop() expiresAt!: Date;
  @Prop() code?: string;
  @Prop() confirmed!: boolean;
  @Prop() ip!: string;
}

@Schema()
export class User implements Omit<IUserDto, 'id'> {
  @Prop({ required: false, minlength: 3 }) name!: string;

  @Prop({ required: false, unique: true }) email!: string;

  @Exclude()
  @Prop({ required: false, minlength: 10, select: false }) password!: string;

  @Exclude()
  @Type(() => RecoverCode)
  @Prop({ type: RecoverCode, required: false, select: false }) recoverCode?: IRecoveredCode;

  @Prop({ required: false, default: false }) confirmed!: boolean;
  @Prop({ required: false, default: false }) blocked!: boolean;

  @Type(() => UserEmailHistory)
  @Prop({ type: UserEmailHistory, required: false, select: false, default: [] }) emailHistory?: IUserEmailHistory[];

  @Type(() => UserPasswordHistory)
  @Prop({ type: UserPasswordHistory, required: false, select: false, default: [] }) passwordHistory?: IUserPasswordHistory[];

  @Type(() => String)
  @Prop({ required: false }) userAvatar?: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);