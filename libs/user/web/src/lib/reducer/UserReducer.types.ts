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
'changePassword' | 'cancelChangePassword'

export type UserStatusses = {
  [key in UserActionTypes]?: ActionStatus;
};
export interface UserState {
  user?: IUser;
  statuses: UserStatusses;
}