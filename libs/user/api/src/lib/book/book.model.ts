import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IBookDto {
  id: string;
  title: string;
  author: string;
  description: string;
  creator: string;
}

export interface IBook extends Omit<IBookDto, 'id'> {}

@Schema()
export class Book implements IBook {
  @Prop({ required: true, minlength: 3 }) title!: string;

  @Prop({ required: true, minlength: 3 }) author!: string;

  @Prop({ required: true, minlength: 10 }) description!: string;

  @Prop({ required: true }) creator!: string;
}

export type BookDocument = Book & Document;

export const BookSchema = SchemaFactory.createForClass(Book);