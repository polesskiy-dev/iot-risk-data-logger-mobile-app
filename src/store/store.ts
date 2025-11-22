import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
// import logger from 'redux-logger';

import { authMiddleware } from './slices/auth/auth.middleware';
import { rootReducer } from './root.reducer';

export const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    // TODO revise authMiddleware demand
    getDefaultMiddleware({ thunk: true })
      .prepend(listenerMiddleware.middleware)
      .concat([authMiddleware/*, logger*/]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
