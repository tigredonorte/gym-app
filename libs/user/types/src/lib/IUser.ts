export interface IRecoveredCode {
  code?: string;
  expiresAt: Date;
  createdAt: Date;
  changePasswordCode?: string;
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
}


export interface IUser extends Omit<IUserDto, 'password'> {
}

export interface IUserDataInfo {
  browser: string;
  location: string;
  os: string;
  device: string;
}

export type UserReturnType = Omit<IUserDto, 'password'> & { id?: string };