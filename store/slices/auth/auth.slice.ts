import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession,
  ICognitoUserSessionData,
  ISignUpResult,
  UserData,
} from 'amazon-cognito-identity-js';

import { getUserDataByUsername, userPool } from './userPool';
import { CognitoError } from '../../../models/error.model';
import { AppDispatch, RootState } from '../../store';
import { setUser } from '../user/user.slice';
import { userNameSelector } from '../../selectors/user.selectors';

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

  const cognitoUser = new CognitoUser(getUserDataByUsername(email));

  const cognitoUserSession = await new Promise<CognitoUserSession>(
    (resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: userSession => resolve(userSession),
        onFailure: err => {
          reject(err);
        },
      });
    },
  );

  /*
   * User assignment placed here instead of separate middleware cause CognitoUserSession is not PLain Object
   * Thus, it's hard to recreate it from serialized session
   */
  const userData = await new Promise((resolve, reject) => {
    cognitoUser.getUserData((err, userData) => {
      if (err) {
        reject(err);
      }
      resolve(userData);
    });
  });

  thunkAPI.dispatch(setUser(userData as UserData));

  return JSON.parse(
    JSON.stringify(cognitoUserSession),
  ) as ICognitoUserSessionData;
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

type SignOutReturnType = void | string;
export const signOut = createAsyncThunk<
  SignOutReturnType,
  void,
  { dispatch: AppDispatch; state: RootState }
>('auth/signOut', async (_, thunkAPI) => {
  return new Promise<SignOutReturnType>((resolve, reject) => {
    const userName = userNameSelector(thunkAPI.getState()) as string;
    const cognitoUser = new CognitoUser(getUserDataByUsername(userName));

    if (cognitoUser instanceof CognitoUser) {
      cognitoUser.signOut();

      // You can resolve with a success message or simply resolve
      resolve('Successfully signed out');
    } else {
      // Reject in case there's no user session
      reject('No active user session found');
    }
  }).catch(error => {
    // Handle or log the error as needed
    // Optionally, use thunkAPI to dispatch any error handling actions
    console.error('Sign out error:', error);
    return thunkAPI.rejectWithValue(error);
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
      })
      .addCase(signOut.fulfilled, state => {
        state.session = null;
        state.loading = 'idle';
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
