import { createSlice } from '@reduxjs/toolkit';

import { nfcReadDeviceSettings } from './deviceSettings.thunks';

// TODO think through the structure
const initialState = {};

export const deviceSettingsSlice = createSlice({
  name: 'deviceSettings',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(nfcReadDeviceSettings.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default deviceSettingsSlice.reducer;
