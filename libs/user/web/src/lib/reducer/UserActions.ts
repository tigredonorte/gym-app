import { deleteRequest, getRequest, IPaginationRequest, postRequest } from '@gym-app/shared/web';
import { Dispatch } from '@reduxjs/toolkit';
import { IAccessLog, IFetchedSession } from './session.types';
import { removeFromEmailHistory, removePasswordChangeRequest, setAccess, setActionType, setSession, setUser, updateUser } from './UserReducer';
import { IUser, UserActionTypes, UserState } from './UserReducer.types';

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
  getState: () => { user: UserState },
  request: (state: UserState) => Promise<unknown>,
) => {
  const state = getState().user;
  const { statuses } = state;

  if (statuses?.[actionName]?.loading) {
    return;
  }

  dispatch(setActionType({ status: { loading: true, error: null }, actionName }));
  try {
    await request(state);
    dispatch(setActionType({ status: { loading: false, error: null }, actionName }));
  } catch (error) {
    console.error(`Error ${defaultErrorMessage}\n\n`, error);
    const message = error instanceof Error ? error.message : `Error ${defaultErrorMessage}`;
    dispatch(setActionType({ status: { loading: false, error: message }, actionName }));
  }
};

export const loadUser = (id = undefined) => async (dispatch: Dispatch, getState: () => { user: UserState }) =>
  requestData('loadUser', 'loading user data', dispatch, getState, async() => {
    id = getUserId(id);
    const user = await getRequest<IUser>(`/user/${id}`);
    dispatch(setUser(user));
  });

export const loadUserSession = (id = getUserId()) => async (dispatch: Dispatch, getState: () => { user: UserState }) =>
  requestData('loadUserSession', 'loading user session', dispatch, getState, async() => {
    const sessions = await getRequest<IFetchedSession[]>(`/user/${id}/session`);
    dispatch(setSession({ id, sessions }));
  });

export const loadUserAccesses = (page: number, id = getUserId()) => async (dispatch: Dispatch, getState: () => { user: UserState }) => {
  requestData('loadUserAccesses', 'loading user accesses', dispatch, getState, async (state: UserState) => {
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
  });
};

export const saveProfileInfo = (userData: Partial<IUser>) => async (dispatch: Dispatch, getState: () => { user: UserState }) =>
  requestData('saveProfileInfo', 'saving profile info', dispatch, getState, async() => {
    const id = getUserId();
    await postRequest(`user/edit/${id}`, userData);
    dispatch(updateUser(userData));
  });

export interface ChangeEmailSettingFormType {
  newEmail: string;
  oldEmail: string;
}
export const changeEmail = (userData: ChangeEmailSettingFormType) => async (dispatch: Dispatch, getState: () => { user: UserState }) =>
  requestData('changeEmail', 'changing email', dispatch, getState, async() => {
    const id = getUserId();
    const emailHistory = await postRequest<IUser['emailHistory']>(`user/update-email/${id}`, userData);
    dispatch(updateUser({ emailHistory }));
  });

export const cancelChangeEmail = (changeEmailCode: string) => async (dispatch: Dispatch, getState: () => { user: UserState }) =>
  requestData('removeFromEmailHistory', 'removing email from history', dispatch, getState, async() => {
    const id = getUserId();
    await deleteRequest(`user/change-email/${id}/${changeEmailCode}`);
    dispatch(removeFromEmailHistory(changeEmailCode));
  });

export interface ChangePasswordFormType  {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export const changePassword = (changePasswordData: ChangePasswordFormType) => async (dispatch: Dispatch, getState: () => { user: UserState }) =>
  requestData('changePassword', 'changing password', dispatch, getState, async() => {
    const id = getUserId();
    const { passwordHistory } = await postRequest<Pick<IUser, 'passwordHistory'>>(`user/change-password/${id}`, changePasswordData);
    dispatch(updateUser({ passwordHistory }));
  });

export const cancelChangePassword = () => async (dispatch: Dispatch, getState: () => { user: UserState }) =>
  requestData('cancelChangePassword', 'cancel change password', dispatch, getState, async() => {
    const id = getUserId();
    await deleteRequest(`user/change-password/${id}`);
    dispatch(removePasswordChangeRequest());
  });
