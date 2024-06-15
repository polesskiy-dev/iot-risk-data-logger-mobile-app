import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/auth/auth.slice';
import userReducer from './slices/user/user.slice';
import deviceInfoReducer from './slices/deviceInfo/deviceInfo.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  deviceInfo: deviceInfoReducer,
});
