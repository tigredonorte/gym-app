export interface IRecoveredCode {
  code?: string;
  expiresAt: Date;
  createdAt: Date;
  changePasswordCode?: string;
}

export interface IUserDto {
  id: string;
  userAvatar?: string;
  recoverCode?: IRecoveredCode;
}

export interface IUser extends IUserDto {
  name: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
}

export interface IUserDataInfo {
  browser: string;
  location: string;
  os: string;
  device: string;
}

export type UserReturnType = IUser & { id?: string };