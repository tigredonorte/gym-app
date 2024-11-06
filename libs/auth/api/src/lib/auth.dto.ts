import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

interface Signup {
  email: string;
  password: string;
  name: string;
}
export class SignupDto implements Signup {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
    email!: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
    password!: string;

  @ApiProperty()
  @IsString()
    name!: string;
}

interface Login {
  email: string;
  password: string;
}
export class LoginDto implements Login {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
    email!: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
    password!: string;
}

interface IRefreshToken {
  userRefreshToken: string;
}
export class RefreshTokenDto implements IRefreshToken {
  @ApiProperty()
  @IsString()
    userRefreshToken!: string;
}

interface Logout {
  accessId: string;
  sessionId: string;
  refreshToken: string;
}
export class LogoutDto implements Logout {
  @ApiProperty()
  @IsString()
    accessId!: string;

  @ApiProperty()
  @IsString()
    sessionId!: string;

  @ApiProperty()
  @IsString()
    refreshToken!: string;
}

interface CheckEmail {
  email: string;
}
export class CheckEmailDto implements CheckEmail {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
    email!: string;
}

interface ForgotPassword {
  email: string;
}
export class ForgotPasswordDto implements ForgotPassword {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
    email!: string;
}

interface confirmRecoverPassword {
  email: string;
  token: string;
}
export class ConfirmRecoverPasswordDto implements confirmRecoverPassword {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
    email!: string;

  @ApiProperty({ minLength: 12 })
  @IsString()
  @MinLength(12)
    token!: string;
}

interface changePassword {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}
export class changePasswordDto implements changePassword {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
    email!: string;

  @ApiProperty({ minLength: 12 })
  @IsString()
  @MinLength(12)
    token!: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
    password!: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
    confirmPassword!: string;
}
