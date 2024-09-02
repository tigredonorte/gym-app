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
  createdAt: Date;
  expiresAt: Date;
  code?: string;
  confirmed: boolean;
  ip: string;
}

export interface IUser {
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

export type UserReturnType = Omit<IUser, 'password'> & { id?: string };