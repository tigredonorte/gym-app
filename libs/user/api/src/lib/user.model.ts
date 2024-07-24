import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import { Document } from 'mongoose';
import { IRecoveredCode, IUser, IUserEmailHistory, IUserPasswordHistory } from './interfaces/IUser';

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
export class User implements Omit<IUser, 'id'> {
  @Prop({ required: false, minlength: 3 }) name!: string;

  @Prop({ required: false, unique: true }) email!: string;

  @Exclude()
  @Prop({ required: false, minlength: 10, select: false }) password!: string;

  @Exclude()
  @Type(() => RecoverCode)
  @Prop({ type: RecoverCode, required: false, select: false }) recoverCode?: IRecoveredCode;

  @Prop({ required: false, default: false }) confirmed!: boolean;

  @Type(() => UserEmailHistory)
  @Prop({ type: UserEmailHistory, required: false, select: false, default: [] }) emailHistory?: IUserEmailHistory[];

  @Type(() => UserPasswordHistory)
  @Prop({ type: UserPasswordHistory, required: false, select: false, default: [] }) passwordHistory?: IUserPasswordHistory[];

}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);