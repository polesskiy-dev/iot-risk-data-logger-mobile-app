/**
 * @file ST25DV.ts
 * @brief Driver for NFC operations with ST ST25DV NFC tag
 * @details ST25DV is a dynamic NFC/RFID tag IC for IoT, connected objects, and industrial applications.
 *
 * @link https://www.st.com/en/nfc/st25dv04k.html
 * @link https://www.st.com/resource/en/datasheet/st25dv04k.pdf
 * @link https://www.st.com/resource/en/application_note/an4910-data-exchange-between-wired-ic-and-wireless-rf-iso-15693-using-fast-transfer-mode-supported-by-st25dvi2c-series-stmicroelectronics.pdf
 *
 * Memory organization:
 * ST25DV memory consists of blocks, addressed by ENDAi
 * TODO: Add more details about memory organization
 *
 * Generic data transfer:
 * RF user must first open the RF configuration security session to write ENDAi registers.
 * Most registers: R always, W if RF configuration security session is open and configuration not locked
 *
 * Mailbox (Fast Transfer Mode):
 * Mailbox is a 256-byte memory block that can be used to exchange data between the RF and the I2C interfaces.
 * In RF, mailbox is read via a dedicated (Fast) Read Message command. Read can start from any address value
 * inside the mailbox, between 00h and FFh. Writing in the mailbox is done via the (Fast) Write Message command
 * in one shot, always starting at mailbox address 00h. No password is needed to access mailbox from RF, but fast
 * transfer mode must be enabled.
 *
 * @note Particular data sequence could be found in AN4910 application note.
 *
 * The RF Control & Access to mailbox is possible using dedicated custom commands:
 * - Read Dynamic Configuration and Fast Read Dynamic Configuration to check availability of mailbox.
 * - Write Dynamic Configuration and Fast Write Dynamic configuration to enable or disable fast transfer mode.
 * - Read Message Length and Fast Read Message Length to get the length of the contained message,
 * - Read Message and Fast Read Message to download the content of the mailbox,
 * - Write Message and Fast Write Message to put a new message in mailbox. (New length is automatically
 * updated after completion of a successful Write Message or Fast Write Message command).
 *
 */
import NfcManager, {
  NfcTech,
  Nfc15693RequestFlagIOS,
} from 'react-native-nfc-manager';
import {
  CMD,
  CMD_STANDARD_SIZE_BYTES,
  DEFAULT_RF_PASSWORD,
  GPO_CTRL_Dyn_SHIFT,
  GPO_CTRL_Dyn_VAL,
  MAILBOX_START_ADDRESS,
  MB_CTRL_Dyn_SHIFT,
  MB_CTRL_Dyn_VAL,
  MB_MODE_SHIFT,
  MB_MODE_VAL,
  RF_REGISTER_ADDRESS,
  ST25DV_REQUEST_HEADER_MF_CODE,
  ST25DV_RF_PWD_0_NUMBER,
} from './st25dv.constants';

export default class ST25DV {
  constructor() {
    // Pre-step, call this before any NFC operations
    NfcManager.start();
    console.log('NFC Manager started');
  }

  /**
   * @brief Request NFC-V (ISO 15693) technology
   * @details Library scans for NFC tags in the vicinity that support the requested technology.
   * Once an NFC tag of the specified technology is detected, the NFC manager sets up a connection with the tag.
   * This connection allows to send commands to and receive responses from the tag.
   */
  async requestNfcTechnology() {
    try {
      await NfcManager.requestTechnology(NfcTech.Iso15693IOS); // for Android - NfcTech.NfcV
      console.log('Iso15693IOS technology requested');
    } catch (ex) {
      console.warn(ex);
    }
  }

  async cancelTechnologyRequest() {
    return await NfcManager.cancelTechnologyRequest();
  }

  async readBasicTagInfo() {
    try {
      await this.requestNfcTechnology();
      const tag = await NfcManager.getTag(); // data example: {"icManufacturerCode": 2, "icSerialNumber": [Array], "id": "E0022402DFD5434E", "tech": "iso15693"}

      return tag;
    } catch (ex) {
      console.warn(ex);
    } finally {
      // Cancel the technology request
      NfcManager.cancelTechnologyRequest();
    }
  }

  /**
   * @note The iOS CoreNFC custom command works only in NON-ADDRESSED mode.
   * @see https://developer.apple.com/documentation/corenfc/nfciso15693tag#3214383
   */
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

  async readMailboxMode() {
    return await NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.READ_CONFIGURATION,
      customRequestParameters: [RF_REGISTER_ADDRESS.MB_MODE],
    });
  }

  async readMailboxControl() {
    return await NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.READ_DYN_CONFIGURATION,
      customRequestParameters: [RF_REGISTER_ADDRESS.MB_CTRL_Dyn],
    });
  }

  // TODO for Mailbox operations check MB_CTRL_Dyn MB enabled (MB_EN) and set MB_MODE to 0x01

  async enableMailbox() {
    return await NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.WRITE_CONFIGURATION,
      customRequestParameters: [
        RF_REGISTER_ADDRESS.MB_MODE,
        MB_MODE_VAL.ENABLE_FTM << MB_MODE_SHIFT.MB_MODE, // Enable mailbox
      ],
    });
  }

  async initMailbox() {
    console.log(
      'Write to MB_CTRL_Dyn: ',
      MB_CTRL_Dyn_VAL.ENABLE_FTM << MB_CTRL_Dyn_SHIFT.MB_EN,
    );
    return await NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.WRITE_DYN_CONFIGURATION,
      customRequestParameters: [
        RF_REGISTER_ADDRESS.MB_CTRL_Dyn,
        MB_CTRL_Dyn_VAL.ENABLE_FTM << MB_CTRL_Dyn_SHIFT.MB_EN, // Enable mailbox
      ],
    });
  }

  async writeMailboxMessage(message: number[]) {
    const messageLength = message.length;
    if (messageLength > 256) {
      throw new Error('Message length is greater than 256 bytes');
    }

    return await NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.WRITE_MAILBOX_MESSAGE,
      customRequestParameters: [messageLength - 1, ...message],
    });
  }

  async readGPOControl() {
    return await NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.READ_CONFIGURATION,
      customRequestParameters: [RF_REGISTER_ADDRESS.GPO_CTRL],
    });
  }

  async configureGPOControl() {
    return await NfcManager.iso15693HandlerIOS.customCommand({
      flags: Nfc15693RequestFlagIOS.HighDataRate,
      customCommandCode: CMD.WRITE_CONFIGURATION,
      customRequestParameters: [
        RF_REGISTER_ADDRESS.GPO_CTRL,
        (GPO_CTRL_Dyn_VAL.ENABLED_GPO_OUTPUT << GPO_CTRL_Dyn_SHIFT.GPO_EN) |
          (GPO_CTRL_Dyn_VAL.PULSE_ON_WM_EOM <<
            GPO_CTRL_Dyn_SHIFT.RF_GET_MSG_EN) |
          (GPO_CTRL_Dyn_VAL.PULSE_ON_WM_COMPLETE <<
            GPO_CTRL_Dyn_SHIFT.RF_PUT_MSG_EN),
      ],
    });
  }
}
