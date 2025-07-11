import { IsEmail, IsString, MinLength } from 'class-validator';

interface UpdateUser {
  name?: string;
}
export class UpdateUserDto implements UpdateUser {
  @IsString() name?: string;
}

interface LogoutDevice {
  sessionId: string;
  accessId: string;
}
export class LogoutDeviceDto implements LogoutDevice {
  @IsString() sessionId!: string;
  @IsString() accessId!: string;
}

export interface IChangeEmail {
  newEmail: string;
  oldEmail: string;
}
export class ChangeEmailDto implements IChangeEmail {
  @IsEmail() newEmail!: string;
  @IsEmail() oldEmail!: string;
}

export interface IChangePassword {
  newPassword: string;
  oldPassword: string;
  confirmPassword: string;
}
export class ChangePasswordDto implements IChangePassword {
  @IsString()
  @MinLength(6)
    newPassword!: string;

  @IsString()
  @MinLength(6)
    oldPassword!: string;

  @IsString()
  @MinLength(6)
    confirmPassword!: string;
}

export interface IUploadAvatar {
  avatar: string;
}
export class UploadAvatarDto implements IUploadAvatar {
  @IsString()
    avatar!: string;
}