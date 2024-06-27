import { IsEmail, IsString } from 'class-validator';

interface UpdateUser {
  name?: string;
}
export class UpdateUserDto implements UpdateUser {
  @IsString()
    name?: string;
}


interface UpdateEmail {
  email?: string;
}
export class UpdateEmailDto implements UpdateEmail {
  @IsEmail()
    email?: string;
}
