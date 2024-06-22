import NfcManager, {
  Nfc15693RequestFlagIOS,
  NfcTech,
} from 'react-native-nfc-manager';

import {
  CMD,
  DEFAULT_RF_PASSWORD,
  ST25DV_RF_PWD_0_NUMBER,
} from './st25dv.constants';
import { ST25DVBase } from './st25dv.base';
import { LoggerFunction } from './st25dv';

/**
 * @brief ST25DV iOS driver
 *
 * @note The iOS CoreNFC custom command works only in NON-ADDRESSED mode.
 * @see https://developer.apple.com/documentation/corenfc/nfciso15693tag#3214383
 */
export class ST25DViOS extends ST25DVBase {
  constructor(debugLogger: LoggerFunction, errorLogger: LoggerFunction) {
    super(debugLogger, errorLogger);
  }

  async requestTechnology(): Promise<void> {
    try {
      await NfcManager.requestTechnology(NfcTech.Iso15693IOS);
      this.debugLogger('Iso15693IOS technology requested');
    } catch (ex: unknown) {
      this.debugLogger('Error requesting Iso15693IOS technology', ex);
      return Promise.reject(ex);
    }
  }

  async presentRFPassword() {
    return await NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.PRESENT_PASSWORD,
      customRequestParameters: [
        // PasswordNumber + Password Value.
        ST25DV_RF_PWD_0_NUMBER,
        ...DEFAULT_RF_PASSWORD,
      ],
    });
  }

  async readConfiguration(registerAddress: number) {
    return NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.READ_CONFIGURATION,
      customRequestParameters: [registerAddress],
    });
  }

  async writeConfiguration(registerAddress: number, registerValue: number) {
    return NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.WRITE_CONFIGURATION,
      customRequestParameters: [registerAddress, registerValue],
    });
  }

  async readDynamicConfiguration(registerAddress: number) {
    return NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.READ_DYN_CONFIGURATION,
      customRequestParameters: [registerAddress],
    });
  }

  async writeDynamicConfiguration(
    registerAddress: number,
    registerValue: number,
  ) {
    return NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.WRITE_DYN_CONFIGURATION,
      customRequestParameters: [registerAddress, registerValue],
    });
  }

  async fastReadMailboxMessage() {
    return NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.FAST_READ_MAILBOX_MESSAGE,
      customRequestParameters: [],
    });
  }

  async fastWriteMailboxMessage(message: number[]) {
    const messageLength = message.length;
    if (messageLength > 256)
      return Promise.reject(
        new Error('Message length is greater than 256 bytes'),
      );

    return NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.FAST_WRITE_MAILBOX_MESSAGE,
      customRequestParameters: [messageLength - 1, ...message],
    });
  }

  async fastReadMailboxMessageLength() {
    const [msgLength] = await NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.FAST_READ_MAILBOX_MESSAGE_LENGTH,
      customRequestParameters: [],
    });

    return msgLength;
  }
}
