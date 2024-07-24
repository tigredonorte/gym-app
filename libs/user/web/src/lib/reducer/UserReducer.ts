import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionStatus, IUser, UserActionTypes, userFeatureKey, UserState } from './UserReducer.types';

const initialState: UserState = {
  user: undefined,
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
    removeFromEmailHistory: (state: UserState, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.emailHistory = state.user.emailHistory?.filter((email) => email.changeEmailCode !== action.payload);
      }
    }
  },
});

export const { login, logout, setActionType, setUser, updateUser, removeFromEmailHistory } = userSlice.actions;
export const UserReducer = userSlice.reducer;
