import { UserActionTypes, userFeatureKey, UserState } from './UserReducer.types';

export const getUserState = (store: { [userFeatureKey]: UserState }) => store[userFeatureKey];
export const getUser = (store: { [userFeatureKey]: UserState }) => getUserState(store).user;
export const getAccesses = (store: { [userFeatureKey]: UserState }) => getUserState(store).accesses;
export const getSessions = (store: { [userFeatureKey]: UserState }) => getUserState(store).sessions;
export const getDevices = (store: { [userFeatureKey]: UserState }) => getUserState(store).devices;
export const getUserStatus = (store: { [userFeatureKey]: UserState }, actionName: UserActionTypes) =>
  getUserState(store).statuses?.[actionName];
