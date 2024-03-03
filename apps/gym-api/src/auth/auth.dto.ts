import { IsEmail, IsString, MinLength } from 'class-validator';

interface Signup {
  email: string;
  password: string;
  name: string;
}

export class SignupDto implements Signup {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;
}

interface Login {
  email: string;
  password: string;
}

export class LoginDto implements Login {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

interface CheckEmail {
  email: string;
}

export class CheckEmailDto implements CheckEmail {
  @IsEmail()
  email: string;
}

interface ForgotPassword {
  email: string;
}

export class ForgotPasswordDto implements ForgotPassword {
  @IsEmail()
  email: string;
}

interface confirmRecoverPassword {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

export class ConfirmRecoverPasswordDto implements confirmRecoverPassword {
  @IsEmail()
  email: string;

  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
