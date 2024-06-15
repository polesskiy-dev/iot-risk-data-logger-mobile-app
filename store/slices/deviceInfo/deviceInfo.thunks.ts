import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackNavigationProp } from '@react-navigation/stack';

import nfcService from '../../../services/nfc/nfc.service';
import {
  RootStackParamList,
  ScreensNames,
} from '../../../navigation/navigation.constants';

export const nfcReadDeviceInfo = createAsyncThunk(
  'nfc/deviceInfo/read',
  async (
    navigation: StackNavigationProp<
      RootStackParamList,
      ScreensNames.DEVICE_COMMANDS_SCREEN
    >,
    thunkAPI,
  ) => {
    // TODO catch errors to notify the user
    const chipsInfo = await nfcService.readDeviceChipsInfo();

    // TODO extract to a separated thunk triggered by nfcReadDeviceInfo.fulfilled
    navigation.navigate(ScreensNames.DEVICE_INFO_SCREEN);

    return chipsInfo;
  },
);
