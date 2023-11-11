import { ThunkMiddleware } from '@reduxjs/toolkit';

import { signIn, signOut, signUp } from './auth.slice';
import { RootState } from '../../store';
import { setUser } from '../user/user.slice';

export const authMiddleware: ThunkMiddleware<RootState> =
  store => next => action => {
    if (action.type === signUp.fulfilled.type && action.meta.arg) {
      const { email, password }: IUserSignIn = action.meta.arg;
      store.dispatch(signIn({ email, password }));
    }

    if (action.type === signOut.fulfilled.type) {
      setUser(null);
    }
    return next(action);
  };
