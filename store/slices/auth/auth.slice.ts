import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  ICognitoUserSessionData,
  ISignUpResult,
} from 'amazon-cognito-identity-js';

import { userPool } from './userPool';
import { CognitoError } from '../../../models/error.model';
import { RootState } from '../../store';

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
        resolve(
          JSON.parse(
            JSON.stringify(cognitoUserSession),
          ) as ICognitoUserSessionData,
        ),
      onFailure: err => {
        reject(err);
      },
    });
  });
});

export const signUp = createAsyncThunk<
  ISignUpResult,
  IUserSignUp,
  SignAsyncThunkConfig
>('auth/signUp', async ({ email, password }, thunkAPI) => {
  const attributeList: CognitoUserAttribute[] = [
    // TODO add additional e.g.
    // new CognitoUserAttribute({
    //   Name: 'email',
    //   Value: email,
    // }),
  ];

  return await new Promise<ISignUpResult>((resolve, reject) => {
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) reject(err);
      resolve(JSON.parse(JSON.stringify(result)) as ISignUpResult);
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
      .addCase(signUp.pending, state => {
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
      .addCase(signUp.fulfilled, state => {
        state.session = null;
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.session = null;
        state.loading = 'failed';
        state.error = action.error as CognitoError;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.session = null;
        state.loading = 'failed';
        state.error = action.error as CognitoError;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
