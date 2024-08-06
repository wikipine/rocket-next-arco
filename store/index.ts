import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slice/authSlice';
import settingReducer from './slice/settingSlice';
import routePermissionReducer from './slice/routePermissionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    setting: settingReducer,
    routePermission: routePermissionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
