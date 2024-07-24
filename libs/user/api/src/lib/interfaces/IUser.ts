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
  password?: string;
  recoverCode?: IRecoveredCode;
  confirmed: boolean;
  emailHistory?: IUserEmailHistory[];
  passwordHistory?: IUserPasswordHistory[];
}