import { IPagination, RequestStatusses, StateWithStatus } from '@gym-app/shared/web';
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
  emailHistory?: IEmailHistoryItem[];
  passwordHistory?: IPasswordHistoryItem[];
}

export const userFeatureKey = 'user';
export interface ActionStatus {
  loading: boolean;
  error: string | null;
}
export type UserActionTypes = 'login' | 'logout' | 'loadUser' |
'removeFromEmailHistory' | 'saveProfileInfo' | 'changeEmail' |
'changePassword' | 'cancelChangePassword' | 'loadUserSession' |
'loadUserAccesses' | 'logoutDevice';

export type UserRequestStatusses = RequestStatusses<UserActionTypes>;

export interface UserState extends StateWithStatus<UserActionTypes> {
  user?: IUser;
  sessions?: Omit<ISession, 'access' | 'deviceInfo'>[];
  accesses?: IPagination<IAccessLog>;
  devices?: IDeviceInfo[];
}
