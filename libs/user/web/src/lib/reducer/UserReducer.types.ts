import {
  IPagination,
  RequestStatusses,
  StateWithStatus,
} from '@gym-app/shared/web';
import { IAccessLog, IDeviceInfo, ISession } from './session.types';

export interface IPasswordHistoryItem {
  confirmed: boolean;
  createdAt: string;
  expiresAt: string;
  ip: string;
}

export interface IEmailHistoryItem {
  confirmed: boolean;
  createdAt: string;
  email: string;
  oldEmail: string;
  changeEmailCode?: string;
  revertChangeEmailCode?: string;
}

export interface IUser {
  id: string;
  name: string;
  confirmed: boolean;
  email: string;
  avatar?: string;
  blocked?: boolean;
  emailHistory?: IEmailHistoryItem[];
  passwordHistory?: IPasswordHistoryItem[];
}

export const userFeatureKey = 'user';
export enum UserActionTypes {
  Login = 'login',
  Logout = 'logout',
  LoadUser = 'loadUser',
  RemoveFromEmailHistory = 'removeFromEmailHistory',
  SaveProfileInfo = 'saveProfileInfo',
  ChangeEmail = 'changeEmail',
  ChangePassword = 'changePassword',
  CancelChangePassword = 'cancelChangePassword',
  LoadUserSession = 'loadUserSession',
  LoadUserAccesses = 'loadUserAccesses',
  LogoutDevice = 'logoutDevice',
  UploadUserImage = 'uploadUserImage'
}

export type UserRequestStatusses = RequestStatusses<UserActionTypes>;

export interface UserState extends StateWithStatus<UserActionTypes> {
  user?: IUser;
  sessions?: Omit<ISession, 'access' | 'deviceInfo'>[];
  accesses?: IPagination<IAccessLog>;
  devices?: IDeviceInfo[];
}
