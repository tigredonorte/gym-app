import { deleteRequest, getRequest, IPaginationRequest, postRequest, requestData } from '@gym-app/shared/web';
import { IUser } from '@gym-app/user/types';
import { Dispatch } from '@reduxjs/toolkit';
import { IAccessLog, IFetchedSession } from './session.types';
import { UserActions } from './UserReducer';
import { UserActionTypes, UserState } from './UserReducer.types';

export const { setActionType } = UserActions;

const getUserId = (id?: string) => {
  if (id) {
    return id;
  }

  const data = JSON.parse(localStorage.getItem('userData') || '{}');
  if (!data.id) throw new Error('No user ID found in local storage');
  return data.id;
};

type getUserStateType = () => { user: UserState };

export const logoutUser = (sessionId: string, accessId: string, refreshToken: string) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: UserActionTypes.Logout,
    defaultErrorMessage: 'logging out user',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    skipLoadingUpdate: true,
    request: async() => {
      dispatch(UserActions.logout());
      await postRequest('/auth/logout', { sessionId, accessId, refreshToken });
    }
  });

export const loadUser = (id = undefined) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: UserActionTypes.LoadUser,
    defaultErrorMessage: 'loading user data',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      id = getUserId(id);
      const user = await getRequest<IUser>(`/user/${id}`);
      dispatch(UserActions.setUser(user));
    }
  });

export const loadUserSession = (id = getUserId()) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: UserActionTypes.LoadUserSession,
    defaultErrorMessage: 'loading user session',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const sessions = await getRequest<IFetchedSession[]>(`/user/${id}/session`);
      dispatch(UserActions.setSession({ id, sessions }));
    }
  });

export const loadUserAccesses = (page: number, id = getUserId()) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: UserActionTypes.LoadUserAccesses,
    defaultErrorMessage: 'loading user accesses',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async (state: UserState) => {
      const { accesses } = state;
      const items = accesses?.pages?.[`${page}`];
      if (items) {
        dispatch(UserActions.setAccess({
          items,
          currentPage: page,
          totalPages: accesses.totalPages,
          totalItems: accesses.totalItems,
          id,
        }));
        return;
      }

      const data = await getRequest<IPaginationRequest<IAccessLog>>(`/user/${id}/access?page=${page}`);
      dispatch(UserActions.setAccess({ ...data, id }));
    }
  });

export const logoutDevice = (sessionId: string, accessId: string, id = getUserId()) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: UserActionTypes.LogoutDevice,
    defaultErrorMessage: 'logging out device',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      await postRequest(`/user/${id}/logoutDevice`, {
        sessionId,
        accessId,
      });
      dispatch(UserActions.removeDevice(sessionId));
    }
  });

export const saveProfileInfo = (userData: Partial<IUser>) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: UserActionTypes.SaveProfileInfo,
    defaultErrorMessage: 'saving profile info',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const id = getUserId();
      await postRequest(`user/${id}/edit`, userData);
      dispatch(UserActions.updateUser(userData));
    }
  });

export interface ChangeEmailSettingFormType {
  newEmail: string;
  oldEmail: string;
}
export const changeEmail = (userData: ChangeEmailSettingFormType) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: UserActionTypes.ChangeEmail,
    defaultErrorMessage: 'changing email',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const id = getUserId();
      const emailHistory = await postRequest<IUser['emailHistory']>(`user/${id}/update-email`, userData);
      dispatch(UserActions.updateUser({ emailHistory }));
    }
  });

export const cancelChangeEmail = (changeEmailCode: string) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: UserActionTypes.RemoveFromEmailHistory,
    defaultErrorMessage: 'removing email from history',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const id = getUserId();
      await deleteRequest(`user/${id}/change-email/${changeEmailCode}`);
      dispatch(UserActions.removeFromEmailHistory(changeEmailCode));
    },
  });

export interface ChangePasswordFormType  {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export const changePassword = (changePasswordData: ChangePasswordFormType) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: UserActionTypes.ChangePassword,
    defaultErrorMessage: 'changing password',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async () => {
      const id = getUserId();
      const { passwordHistory } = await postRequest<Pick<IUser, 'passwordHistory'>>(`user/${id}/change-password`, changePasswordData);
      dispatch(UserActions.updateUser({ passwordHistory }));
    },
  });

export const cancelChangePassword = () => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName:  UserActionTypes.CancelChangePassword,
    defaultErrorMessage: 'cancel change password',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const id = getUserId();
      await deleteRequest(`user/${id}/change-password`);
      dispatch(UserActions.removePasswordChangeRequest());
    },
  });

export const uploadUserImage = (file: File) => async (dispatch: Dispatch, getState: getUserStateType) =>
  requestData({
    actionName: UserActionTypes.UploadUserImage,
    defaultErrorMessage: 'uploading user image',
    dispatch,
    getState: () => getState()?.user,
    setActionType,
    request: async() => {
      const id = getUserId();
      const formData = new FormData();
      formData.append('file', file);

      const response = await postRequest<{ fileUrl: string }>(`user/${id}/upload-avatar`, formData);

      dispatch(UserActions.updateUser({ userAvatar: response.fileUrl }));
    }
  });
