export enum ScreensNames {
  SIGN_IN_SCREEN = 'Sign In',
  SIGN_UP_SCREEN = 'Sign Up',
  DEVICE_COMMANDS_SCREEN = 'Device Commands',
  ACCOUNT_SCREEN = 'Account',
  DEVICE_SETTINGS_SCREEN = 'Device Settings',
  COMMANDS_HISTORY_SCREEN = 'Commands History',
  VIEW_DEVICE_LOG_SCREEN = 'View Device Log',
  DEVICE_INFO_SCREEN = 'Device Info',
  DEVICE_BASIC_OPERATIONS_NAVIGATOR = 'Device Basic Operations Navigator',
}

export type RootStackParamList = {
  [ScreensNames.SIGN_IN_SCREEN]: undefined;
  [ScreensNames.SIGN_UP_SCREEN]: undefined;
  [ScreensNames.DEVICE_COMMANDS_SCREEN]: undefined;
  [ScreensNames.ACCOUNT_SCREEN]: undefined;
  [ScreensNames.DEVICE_SETTINGS_SCREEN]: undefined;
  [ScreensNames.COMMANDS_HISTORY_SCREEN]: undefined;
  [ScreensNames.VIEW_DEVICE_LOG_SCREEN]: undefined;
  [ScreensNames.DEVICE_INFO_SCREEN]: undefined;
  [ScreensNames.DEVICE_BASIC_OPERATIONS_NAVIGATOR]: undefined;
};
