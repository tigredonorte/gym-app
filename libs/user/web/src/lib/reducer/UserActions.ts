import { deleteRequest, getRequest, postRequest } from '@gym-app/shared/web';
import { removeFromEmailHistory, removePasswordChangeRequest, setActionType, setUser, updateUser } from './UserReducer';
import { IUser, UserActionTypes } from './UserReducer.types';
import { Dispatch } from '@reduxjs/toolkit';

const getUserId = (id?: string) => {
  if (id) {
    return id;
  }

  const data = JSON.parse(localStorage.getItem('userData') || '{}');
  if (!data.id) throw new Error('No user ID found in local storage');
  return data.id;
};

const requestData = async(
  actionName: UserActionTypes,
  defaultErrorMessage: string,
  dispatch: Dispatch,
  request: () => Promise<unknown>,
) => {
  dispatch(setActionType({ status: { loading: true, error: null }, actionName }));
  try {
    await request();
    dispatch(setActionType({ status: { loading: false, error: null }, actionName }));
  } catch (error) {
    console.error(`Error ${defaultErrorMessage}\n\n`, error);
    const message = error instanceof Error ? error.message : `Error ${defaultErrorMessage}`;
    dispatch(setActionType({ status: { loading: false, error: message }, actionName }));
  }
};

export const loadUser = (id = undefined) => async (dispatch: Dispatch) =>
  requestData('loadUser', 'loading user data', dispatch, async() => {
    id = getUserId(id);
    const user = await getRequest<IUser>(`/user/${id}`);
    dispatch(setUser(user));
  });

export const saveProfileInfo = (userData: Partial<IUser>) => async (dispatch: Dispatch) =>
  requestData('saveProfileInfo', 'saving profile info', dispatch, async() => {
    const id = getUserId();
    await postRequest(`user/edit/${id}`, userData);
    dispatch(updateUser(userData));
  });

export interface ChangeEmailSettingFormType {
  newEmail: string;
  oldEmail: string;
}
export const changeEmail = (userData: ChangeEmailSettingFormType) => async (dispatch: Dispatch) =>
  requestData('changeEmail', 'changing email', dispatch, async() => {
    const id = getUserId();
    const emailHistory = await postRequest<IUser['emailHistory']>(`user/update-email/${id}`, userData);
    dispatch(updateUser({ emailHistory }));
  });

export const cancelChangeEmail = (changeEmailCode: string) => async (dispatch: Dispatch) =>
  requestData('removeFromEmailHistory', 'removing email from history', dispatch, async() => {
    const id = getUserId();
    await deleteRequest(`user/change-email/${id}/${changeEmailCode}`);
    dispatch(removeFromEmailHistory(changeEmailCode));
  });

export interface ChangePasswordFormType  {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export const changePassword = (changePasswordData: ChangePasswordFormType) => async (dispatch: Dispatch) =>
  requestData('changePassword', 'changing password', dispatch, async() => {
    const id = getUserId();
    const { passwordHistory } = await postRequest<Pick<IUser, 'passwordHistory'>>(`user/change-password/${id}`, changePasswordData);
    dispatch(updateUser({ passwordHistory }));
  });

export const cancelChangePassword = () => async (dispatch: Dispatch) =>
  requestData('cancelChangePassword', 'cancel change password', dispatch, async() => {
    const id = getUserId();
    await deleteRequest(`user/change-password/${id}`);
    dispatch(removePasswordChangeRequest());
  });
