import { deleteRequest, getRequest, IPaginationRequest, postRequest, requestData } from '@gym-app/shared/web';
import { Dispatch } from '@reduxjs/toolkit';
import { IAccessLog, IFetchedSession } from './session.types';
import { removeFromEmailHistory, removePasswordChangeRequest, setAccess, setActionType, setSession, setUser, updateUser } from './UserReducer';
import { IUser, UserState } from './UserReducer.types';

const getUserId = (id?: string) => {
  if (id) {
    return id;
  }

  const data = JSON.parse(localStorage.getItem('userData') || '{}');
  if (!data.id) throw new Error('No user ID found in local storage');
  return data.id;
};

type getUserStateType = () => { user: UserState };

export const logoutUser = (sessionId: string, accessId: string) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: 'logout',
    defaultErrorMessage: 'logging out user',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      await postRequest('/auth/logout', { sessionId, accessId });
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
    }
  });

export const loadUser = (id = undefined) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: 'loadUser',
    defaultErrorMessage: 'loading user data',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      id = getUserId(id);
      const user = await getRequest<IUser>(`/user/${id}`);
      dispatch(setUser(user));
    }
  });

export const loadUserSession = (id = getUserId()) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: 'loadUserSession',
    defaultErrorMessage: 'loading user session',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const sessions = await getRequest<IFetchedSession[]>(`/user/${id}/session`);
      dispatch(setSession({ id, sessions }));
    }
  });

export const loadUserAccesses = (page: number, id = getUserId()) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: 'loadUserAccesses',
    defaultErrorMessage: 'loading user accesses',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async (state: UserState) => {
      const { accesses } = state;
      const items = accesses?.pages?.[`${page}`];
      if (items) {
        dispatch(setAccess({
          items,
          currentPage: page,
          totalPages: accesses.totalPages,
          totalItems: accesses.totalItems,
          id,
        }));
        return;
      }

      const data = await getRequest<IPaginationRequest<IAccessLog>>(`/user/${id}/access?page=${page}`);
      dispatch(setAccess({ ...data, id }));
    }
  });

export const saveProfileInfo = (userData: Partial<IUser>) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: 'saveProfileInfo',
    defaultErrorMessage: 'saving profile info',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const id = getUserId();
      await postRequest(`user/edit/${id}`, userData);
      dispatch(updateUser(userData));
    }
  });

export interface ChangeEmailSettingFormType {
  newEmail: string;
  oldEmail: string;
}
export const changeEmail = (userData: ChangeEmailSettingFormType) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: 'changeEmail',
    defaultErrorMessage: 'changing email',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const id = getUserId();
      const emailHistory = await postRequest<IUser['emailHistory']>(`user/update-email/${id}`, userData);
      dispatch(updateUser({ emailHistory }));
    }
  });

export const cancelChangeEmail = (changeEmailCode: string) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: 'removeFromEmailHistory',
    defaultErrorMessage: 'removing email from history',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const id = getUserId();
      await deleteRequest(`user/change-email/${id}/${changeEmailCode}`);
      dispatch(removeFromEmailHistory(changeEmailCode));
    },
  });

export interface ChangePasswordFormType  {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export const changePassword = (changePasswordData: ChangePasswordFormType) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: 'changePassword',
    defaultErrorMessage: 'changing password',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async () => {
      const id = getUserId();
      const { passwordHistory } = await postRequest<Pick<IUser, 'passwordHistory'>>(`user/change-password/${id}`, changePasswordData);
      dispatch(updateUser({ passwordHistory }));
    },
  });

export const cancelChangePassword = () => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: 'cancelChangePassword',
    defaultErrorMessage: 'cancel change password',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const id = getUserId();
      await deleteRequest(`user/change-password/${id}`);
      dispatch(removePasswordChangeRequest());
    },
  });