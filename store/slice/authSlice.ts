/**
 * 权限管理相关
 */
import { createSlice } from '@reduxjs/toolkit';
import { setLoginToken, setLoginUserInfo } from '@/utils/auth';

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
    setToken: (state, action) => {
      state.token = `${action.payload}`;
      setLoginToken(action.payload);
    },
    setUserInfo: (state, action) => {
      const payload = action.payload;
      state.userInfo.name = payload.name;
      state.userInfo.avatar = payload.avatar;
      state.userInfo.role = payload.role;
      setLoginUserInfo(state.userInfo);
    },
  },
});

export const { setToken, setUserInfo } = authSlice.actions;

export default authSlice.reducer;
