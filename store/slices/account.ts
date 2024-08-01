import { createSlice } from '@reduxjs/toolkit';
import cache from "@/utils/cache";
const CACHE_TOKEN = 'token';

const initialState = {
    token: null,
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            cache.set(CACHE_TOKEN, action.payload);
        },
        clearToken: (state) => {
            state.token = null;
            cache.remove(CACHE_TOKEN);
        },
    },
});

export const {
    setToken,
    clearToken
} = accountSlice.actions;

export default accountSlice.reducer;
