import { ActionStatus, IPaginationRequest } from '@gym-app/shared/web';
import { IUser } from '@gym-app/user/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UAParser } from 'ua-parser-js';
import { IAccessLog, IFetchedSession } from './session.types';
import { UserActionTypes, userFeatureKey, UserState } from './UserReducer.types';

const initialState: UserState = {
  user: undefined,
  sessions: undefined,
  statuses: {},
  devices: [],
  accesses: undefined,
};

export const userSlice = createSlice({
  name: userFeatureKey,
  initialState,
  reducers: {
    login: (state, action: { payload: IUser }) => {
      state.user = action.payload;
    },
    logout: () => initialState,
    setActionType: (state, action: PayloadAction<{ status: ActionStatus, actionName: UserActionTypes}>) => {
      state.statuses[action.payload.actionName] = action.payload.status;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    updateUser: (state: UserState, action: PayloadAction<Partial<IUser>>) => {
      state.user = state.user ? { ...state.user, ...action.payload } : state.user;
    },
    setSession: (state: UserState, action: PayloadAction<{ sessions: IFetchedSession[], id: string }>) => {
      const { sessions } = action.payload;

      const mapDevice = (deviceInfo: IFetchedSession['deviceInfo']) => ({
        browser: `${deviceInfo?.browser?.name} ${deviceInfo?.browser?.major}`,
        os: `${deviceInfo?.os?.name} ${deviceInfo?.os?.version}`,
        device: deviceInfo?.device?.type ? `${deviceInfo?.device.vendor} ${deviceInfo?.device?.model}` : '',
      });
      const parser = new UAParser();
      const result = parser.getResult();
      const currentDevice = mapDevice(result);
      state.devices = sessions.map((session: IFetchedSession) => {
        const mappedDevice = mapDevice(session.deviceInfo);
        return {
          ...session.deviceInfo,
          updatedAt: session.updatedAt,
          sessionId: session.sessionId,
          accessId: session.currentAccessId,
          mappedDevice,
          isCurrentDevice: mappedDevice.device === currentDevice.device &&
            mappedDevice.os === currentDevice.os &&
            mappedDevice.browser === currentDevice.browser
        };
      });

      state.sessions = sessions.map(({ access, ...session }) => session);
    },
    setAccess: (state: UserState, action: PayloadAction<IPaginationRequest<IAccessLog> & { id: string }>) => {
      const items = action.payload.items.map(access => ({ ...access, sessionId: action.payload.id }));
      state.accesses = {
        items,
        pages: {
          ...state.accesses?.pages,
          [`${action.payload.currentPage}`]: items
        },
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalItems: action.payload.totalItems,
      };
    },
    removeDevice: (state: UserState, action: PayloadAction<string>) => {
      state.devices = state.devices?.filter((device) => device.sessionId !== action.payload);
    },
  },
});

export const UserActions = userSlice.actions;
export const UserReducer = userSlice.reducer;
