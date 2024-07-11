import { IsEmail, IsString } from 'class-validator';

interface UpdateUser {
  name?: string;
}
export class UpdateUserDto implements UpdateUser {
  @IsString() name?: string;
}


export interface IUpdateEmail {
  newEmail: string;
  oldEmail: string;
}
export class UpdateEmailDto implements IUpdateEmail {
  @IsEmail() newEmail!: string;
  @IsEmail() oldEmail!: string;
}
