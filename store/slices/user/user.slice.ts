import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from 'amazon-cognito-identity-js';

import { CognitoError } from '../../../models/error.model';
import { ILoadingState, LoadingStatus } from '../../../models/loading.model';

interface IUserState extends ILoadingState {
  user: UserData | null;
  error: CognitoError | null;
  loading: LoadingStatus;
}

const initialState: IUserState = {
  user: null,
  error: null,
  loading: LoadingStatus.IDLE,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
