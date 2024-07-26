import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionStatus, IUser, UserActionTypes, userFeatureKey, UserState } from './UserReducer.types';
import { IFetchedSession } from './session.types';

const initialState: UserState = {
  user: undefined,
  sessions: undefined,
  statuses: {}
};

export const userSlice = createSlice({
  name: userFeatureKey,
  initialState,
  reducers: {
    login: (state, action: { payload: IUser }) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = undefined;
    },
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
      state.devices = sessions.map(session => ({ ...session.deviceInfo, updatedAt: session.updatedAt }));
      state.accesses = sessions.flatMap(session => session.access.map(access => {
        const { browser, device } = session.deviceInfo;
        const browserName = [browser?.name, browser?.version].filter(Boolean).join(' ').trim() || 'Unknown Browser';
        const deviceName = [device?.vendor, device?.model].filter(Boolean).join(' ').trim() || 'Desktop';
        return {
          ...access,
          sessionId: session.sessionId,
          client: `${browserName} on ${deviceName}`
        };
      })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      state.sessions = sessions.map(({ access, ...session }) => session);
    },
    removeFromEmailHistory: (state: UserState, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.emailHistory = state.user.emailHistory?.filter((email) => email.changeEmailCode !== action.payload);
      }
    },
    removePasswordChangeRequest: (state: UserState) => {
      if (state.user) {
        state.user.passwordHistory = state.user.passwordHistory?.filter((request) => request.confirmed !== false);
      }
    }
  },
});

export const {
  login, logout, setActionType, setUser, updateUser,
  setSession, removeFromEmailHistory, removePasswordChangeRequest
} = userSlice.actions;
export const UserReducer = userSlice.reducer;
