import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

import { userPool } from './userPool';
import { RootState } from '../../store';
import { CognitoError } from '../../../models/error.model';
import { RejectedAction } from '@reduxjs/toolkit/dist/query/core/buildThunks';

// Then, use this type in your AsyncThunkConfig
interface SignAsyncThunkConfig {
  state: RootState;
  rejectValue: CognitoError;
}

export const signIn = createAsyncThunk<
  CognitoUserSession,
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

  try {
    return await new Promise<CognitoUserSession>((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: resolve,
        onFailure: err => {
          reject(err);
        },
      });
    });
  } catch (err) {
    return thunkAPI.rejectWithValue(err as CognitoError);
  }
});

interface IAuthState extends ILoadingState {
  session: CognitoUserSession | null;
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
        (state, action: PayloadAction<CognitoUserSession>) => {
          state.session = action.payload;
          state.loading = 'succeeded';
          state.error = null;
        },
      )
      .addCase(signIn.rejected, (state, action) => {
        state.session = null;
        state.loading = 'failed';
        state.error = action.payload as CognitoError;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
