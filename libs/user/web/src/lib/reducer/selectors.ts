import { UserActionTypes, userFeatureKey, UserState } from './UserReducer.types';

export const getUserState = (store: { [userFeatureKey]: UserState }) => store[userFeatureKey];
export const getUser = (store: { [userFeatureKey]: UserState }) => getUserState(store).user;
export const getUserStatus = (store: { [userFeatureKey]: UserState }, actionName: UserActionTypes) =>
  getUserState(store).statuses?.[actionName];
