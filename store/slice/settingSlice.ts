/**
 * 设置全局管理
 */
import { createSlice } from '@reduxjs/toolkit';
import defaultSettings from '@/config/settings.json';

const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    ...defaultSettings,
  },
  reducers: {
    updateSetting: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateSetting } = settingSlice.actions;

export default settingSlice.reducer;
