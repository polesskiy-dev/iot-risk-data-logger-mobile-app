import { ThunkMiddleware } from '@reduxjs/toolkit';

import { signIn, signUp } from './auth.slice';
import { RootState } from '../../store';

export const authMiddleware: ThunkMiddleware<RootState> =
  store => next => action => {
    if (action.type === signUp.fulfilled.type && action.meta.arg) {
      const { email, password }: IUserSignIn = action.meta.arg;
      store.dispatch(signIn({ email, password }));
    }
    return next(action);
  };
