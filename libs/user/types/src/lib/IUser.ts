export interface IRecoveredCode {
  code?: string;
  expiresAt: Date;
  createdAt: Date;
  changePasswordCode?: string;
}

export interface IUserEmailHistory {
  email: string;
  createdAt: Date;
  confirmed: boolean;
  changeEmailCode?: string;
  revertChangeEmailCode?: string;
  oldEmail: string;
}

export interface IUserPasswordHistory {
  password?: string;
  code?: string;
  createdAt: Date;
  expiresAt: Date;
  confirmed: boolean;
  ip: string;
}

export interface IUserDto {
  id: string;
  name: string;
  email: string;
  userAvatar?: string;
  password?: string;
  recoverCode?: IRecoveredCode;
  confirmed: boolean;
  blocked: boolean;
  emailHistory?: IUserEmailHistory[];
  passwordHistory?: IUserPasswordHistory[];
}

export interface IPasswordHistoryItem extends Omit<IUserPasswordHistory, 'password' | 'code' | 'createdAt' | 'expiresAt'> {
  createdAt: string;
  expiresAt: string;
}

export interface IUser extends Omit<IUserDto, 'password' | 'passwordHistory'> {
  emailHistory?: IUserEmailHistory[];
  passwordHistory?: IPasswordHistoryItem[];
}

export interface IUserDataInfo {
  browser: string;
  location: string;
  os: string;
  device: string;
}

export type UserReturnType = Omit<IUserDto, 'password'> & { id?: string };