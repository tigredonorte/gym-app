import {
  IPagination,
  RequestStatuses,
  StateWithStatus,
} from '@gym-app/shared/web';
import { IDeviceInfo, IUser } from '@gym-app/user/types';
import { IAccessLog, ISession } from './session.types';

export const userFeatureKey = 'user';
export enum UserActionTypes {
  Login = 'login',
  Logout = 'logout',
  LoadUser = 'loadUser',
  SaveProfileInfo = 'saveProfileInfo',
  ChangeEmail = 'changeEmail',
  ChangePassword = 'changePassword',
  LoadUserSession = 'loadUserSession',
  LoadUserAccesses = 'loadUserAccesses',
  LogoutDevice = 'logoutDevice',
  UploadUserImage = 'uploadUserImage'
}

export type UserRequestStatuses = RequestStatuses<UserActionTypes>;

export interface UserState extends StateWithStatus<UserActionTypes> {
  user?: IUser;
  sessions?: Omit<ISession, 'access' | 'deviceInfo'>[];
  accesses?: IPagination<IAccessLog>;
  devices?: IDeviceInfo[];
}
