import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  ICognitoUserSessionData,
} from 'amazon-cognito-identity-js';

import { userPool } from './userPool';
import { RootState } from '../../store';
import { CognitoError } from '../../../models/error.model';

// Then, use this type in your AsyncThunkConfig
interface SignAsyncThunkConfig {
  state: RootState;
  rejectValue: CognitoError;
}

export const signIn = createAsyncThunk<
  ICognitoUserSessionData,
  IUserSignIn,
  SignAsyncThunkConfig
>('auth/signIn', async ({ email, password }, thunkAPI) => {
  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  return await new Promise<ICognitoUserSessionData>((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: cognitoUserSession =>
        resolve(JSON.parse(JSON.stringify(cognitoUserSession)) as ICognitoUserSessionData),
      onFailure: err => {
        reject(err);
      },
    });
  });
});

interface IAuthState extends ILoadingState {
  session: ICognitoUserSessionData | null;
  error: CognitoError | null;
  loading: LoadingStatus;
}

const initialState: IAuthState = {
  session: null,
  error: null,
  loading: 'idle',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signIn.pending, state => {
        state.session = null;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(
        signIn.fulfilled,
        (state, action: PayloadAction<ICognitoUserSessionData>) => {
          state.session = action.payload;
          state.loading = 'succeeded';
          state.error = null;
        },
      )
      .addCase(signIn.rejected, (state, action) => {
        state.session = null;
        state.loading = 'failed';
        state.error = action.error as CognitoError;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
