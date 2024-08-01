// store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import accountReducer from '@/store/slices/account';

const rootReducer = combineReducers({
    account: accountReducer,
});

export default rootReducer;
