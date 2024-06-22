import NfcManager, { NfcTech } from 'react-native-nfc-manager';

import {
  CMD,
  DEFAULT_RF_PASSWORD,
  ST25DV_HIGH_DATA_RATE_HEADER,
  ST25DV_REQUEST_HEADER_MF_CODE,
  ST25DV_RF_PWD_0_NUMBER,
} from './st25dv.constants';
import { LoggerFunction } from './st25dv';
import { ST25DVBase } from './st25dv.base';

export class ST25DVAndroid extends ST25DVBase {
  constructor(debugLogger: LoggerFunction, errorLogger: LoggerFunction) {
    super(debugLogger, errorLogger);
  }

  async requestTechnology() {
    try {
      await NfcManager.requestTechnology(NfcTech.NfcV);
      this.debugLogger('Iso15693IOS technology requested');
    } catch (ex: unknown) {
      this.debugLogger('Error requesting NfcV technology', ex);
      return Promise.reject(ex);
    }
  }

  // TODO verify on physical device
  async presentRFPassword() {
    return await NfcManager.transceive([
      ST25DV_HIGH_DATA_RATE_HEADER,
      CMD.PRESENT_PASSWORD,
      ST25DV_REQUEST_HEADER_MF_CODE,
      // PasswordNumber + Password Value.
      ST25DV_RF_PWD_0_NUMBER,
      ...DEFAULT_RF_PASSWORD,
    ]);
  }

  // TODO verify on physical device
  async readConfiguration(registerAddress: number) {
    return NfcManager.transceive([
      ST25DV_HIGH_DATA_RATE_HEADER,
      CMD.READ_CONFIGURATION,
      ST25DV_REQUEST_HEADER_MF_CODE,
      registerAddress,
    ]);
  }

  // TODO verify on physical device
  async writeConfiguration(registerAddress: number, registerValue: number) {
    return NfcManager.transceive([
      ST25DV_HIGH_DATA_RATE_HEADER,
      CMD.WRITE_CONFIGURATION,
      ST25DV_REQUEST_HEADER_MF_CODE,
      registerAddress,
      registerValue,
    ]);
  }

  // TODO verify on physical device
  async readDynamicConfiguration(registerAddress: number) {
    return NfcManager.transceive([
      ST25DV_HIGH_DATA_RATE_HEADER,
      CMD.READ_DYN_CONFIGURATION,
      ST25DV_REQUEST_HEADER_MF_CODE,
      registerAddress,
    ]);
  }

  // TODO verify on physical device
  async writeDynamicConfiguration(
    registerAddress: number,
    registerValue: number,
  ) {
    return NfcManager.transceive([
      ST25DV_HIGH_DATA_RATE_HEADER,
      CMD.WRITE_DYN_CONFIGURATION,
      ST25DV_REQUEST_HEADER_MF_CODE,
      registerAddress,
      registerValue,
    ]);
  }

  // TODO verify on physical device
  async fastReadMailboxMessage() {
    return NfcManager.transceive([
      ST25DV_HIGH_DATA_RATE_HEADER,
      CMD.FAST_READ_MAILBOX_MESSAGE,
      ST25DV_REQUEST_HEADER_MF_CODE,
    ]);
  }

  // TODO verify on physical device
  async fastWriteMailboxMessage(message: number[]) {
    const messageLength = message.length;
    if (messageLength > 256)
      return Promise.reject(
        new Error('Message length is greater than 256 bytes'),
      );

    return NfcManager.transceive([
      ST25DV_HIGH_DATA_RATE_HEADER,
      CMD.FAST_WRITE_MAILBOX_MESSAGE,
      ST25DV_REQUEST_HEADER_MF_CODE,
      messageLength - 1,
      ...message,
    ]);
  }

  // TODO verify on physical device
  async fastReadMailboxMessageLength() {
    const [msgLength] = await NfcManager.transceive([
      ST25DV_HIGH_DATA_RATE_HEADER,
      CMD.FAST_READ_MAILBOX_MESSAGE_LENGTH,
      ST25DV_REQUEST_HEADER_MF_CODE,
    ]);

    return msgLength;
  }
}
