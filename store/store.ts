import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { authMiddleware } from './slices/auth/auth.middleware';
import { rootReducer } from './root.reducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(logger).concat(authMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
