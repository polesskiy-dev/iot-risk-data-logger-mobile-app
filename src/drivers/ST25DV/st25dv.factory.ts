import { Platform } from 'react-native';

import { ST25DViOS } from './st25dv.ios';
import { ST25DVAndroid } from './st25dv.android';
import { LoggerFunction, ST25DV } from './st25dv';

export class ST25DVFactory {
  static createPlatformDriver(
    debugLogger: LoggerFunction,
    errorLogger: LoggerFunction,
  ): ST25DV {
    if (Platform.OS === 'ios') return new ST25DViOS(debugLogger, errorLogger);

    if (Platform.OS === 'android')
      return new ST25DVAndroid(debugLogger, errorLogger);

    throw new Error('Unsupported platform');
  }
}
