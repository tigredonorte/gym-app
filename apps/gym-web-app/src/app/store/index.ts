import { userFeatureKey, UserReducer } from '@gym-app/user/web';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [userFeatureKey]: UserReducer,
  },
});
