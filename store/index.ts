import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slice/authSlice';
import settingReducer from './slice/settingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    setting: settingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
