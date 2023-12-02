import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop({ required: true, minlength: 10, select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);