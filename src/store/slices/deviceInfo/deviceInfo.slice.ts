import { createSlice } from '@reduxjs/toolkit';
import { TagEvent } from 'react-native-nfc-manager';

import { nfcReadDeviceInfo } from './deviceInfo.thunks';

interface IDeviceInfo {
  tag: TagEvent | null | undefined;
}

const initialState: IDeviceInfo = {
  tag: null,
};

export const deviceInfoSlice = createSlice({
  name: 'deviceInfo',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(nfcReadDeviceInfo.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default deviceInfoSlice.reducer;
