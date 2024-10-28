import { IsString } from 'class-validator';
import { IBook } from './book.model';

export class BookDto implements IBook {
  @IsString()
    title!: string;

  @IsString()
    author!: string;

  @IsString()
    description!: string;

  @IsString()
    creator!: string;
}
