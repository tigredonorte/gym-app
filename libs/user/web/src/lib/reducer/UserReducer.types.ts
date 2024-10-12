import {
  IPagination,
  RequestStatusses,
  StateWithStatus,
} from '@gym-app/shared/web';
import { IDeviceInfo, IUser } from '@gym-app/user/types';
import { IAccessLog, ISession } from './session.types';

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
