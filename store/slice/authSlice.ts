/**
 * 权限管理相关
 */
import { createSlice } from '@reduxjs/toolkit';
import { setLoginToken } from '@/utils/auth';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: {
      name: '',
      avatar: '',
      role: '',
    },
    token: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      const payload = action.payload;
      state.token = payload.token;
      state.userInfo.name = payload.name;
      state.userInfo.avatar = payload.avatar;
      state.userInfo.role = payload.role;
      setLoginToken(payload.token);
    },
  },
});

export const { setUserInfo } = authSlice.actions;

export default authSlice.reducer;
