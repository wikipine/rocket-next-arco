/**
 * 权限管理相关
 */
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: {
      name: '',
      avatar: '',
      role: '',
    },
    loading: true,
    token: null,
  },
  reducers: {
    updateLoading: (state, action) => {
      console.log(action);
      state.loading = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { updateLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
