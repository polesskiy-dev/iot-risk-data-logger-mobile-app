import NfcManager, { TagEvent } from 'react-native-nfc-manager';

import { register8bToInfoString } from './st25dv.utils';
import {
  GPO_CTRL_Dyn_SHIFT,
  GPO_CTRL_Dyn_VAL,
  MB_CTRL_Dyn_SHIFT,
  MB_CTRL_Dyn_VAL,
  MB_MODE_SHIFT,
  MB_MODE_VAL,
  RF_REGISTER_ADDRESS,
} from './st25dv.constants';
import { LoggerFunction, ST25DV } from './st25dv';

export abstract class ST25DVBase implements ST25DV {
  protected constructor(
    protected debugLogger: LoggerFunction = console.log,
    protected errorLogger: LoggerFunction = console.error,
  ) {}

  /** @see  ST25DV.requestTechnology */
  abstract requestTechnology(): Promise<void>;
  /** @see  ST25DV.presentRFPassword */
  abstract presentRFPassword(): Promise<number[]>;
  /** @see  ST25DV.readConfiguration */
  abstract readConfiguration(registerAddress: number): Promise<number[]>;
  /** @see  ST25DV.writeConfiguration */
  abstract writeConfiguration(
    registerAddress: number,
    registerValue: number,
  ): Promise<number[]>;
  /** @see  ST25DV.readDynamicConfiguration */
  abstract readDynamicConfiguration(registerAddress: number): Promise<number[]>;
  /** @see  ST25DV.writeDynamicConfiguration */
  abstract writeDynamicConfiguration(
    registerAddress: number,
    registerValue: number,
  ): Promise<number[]>;
  /** @see  ST25DV.fastReadMailboxMessage */
  abstract fastReadMailboxMessage(): Promise<number[]>;
  /** @see  ST25DV.fastWriteMailboxMessage */
  abstract fastWriteMailboxMessage(message: number[]): Promise<number[]>;
  /** @see  ST25DV.fastReadMailboxMessageLength */
  abstract fastReadMailboxMessageLength(): Promise<number>;

  /** @see  ST25DV.init */
  async init(): Promise<void> {
    // Pre-step, call this before any NFC operations
    await NfcManager.start();
    this.debugLogger('NFC Manager started');
  }

  /** @see  ST25DV.cancelTechnologyRequest */
  async cancelTechnologyRequest(): Promise<void> {
    try {
      await NfcManager.cancelTechnologyRequest(); // for Android - NfcTech.NfcV
      this.debugLogger('NFC Technology canceled');
    } catch (ex) {
      this.errorLogger(JSON.stringify(ex));
      return Promise.reject(ex);
    }
  }

  /** @see  ST25DV.readBasicTagInfo */
  async readBasicTagInfo(): Promise<TagEvent | null | undefined> {
    try {
      await this.requestTechnology();
      return await NfcManager.getTag(); // data example: {"icManufacturerCode": 2, "icSerialNumber": [Array], "id": "E0022402DFD5434E", "tech": "iso15693"}
    } catch (ex) {
      this.errorLogger(JSON.stringify(ex));
    } finally {
      this.cancelTechnologyRequest();
    }
  }

  /** @see  ST25DV.initMailbox */
  async initMailbox() {
    this.debugLogger('Enable Mailbox MB_MODE');
    await this.writeConfiguration(
      RF_REGISTER_ADDRESS.MB_MODE,
      MB_MODE_VAL.ENABLE_FTM << MB_MODE_SHIFT.MB_MODE,
    );

    // validate Mailbox enabling, MB_MODE
    const [mbMode] = await this.readConfiguration(RF_REGISTER_ADDRESS.MB_MODE);
    if (mbMode !== MB_MODE_VAL.ENABLE_FTM << MB_MODE_SHIFT.MB_MODE) {
      this.errorLogger(
        register8bToInfoString(mbMode, 'MB_MODE', MB_MODE_SHIFT, MB_MODE_VAL),
      );
      return Promise.reject(new Error('Failed to enable Mailbox MB_MODE'));
    }

    this.debugLogger('Initialize Mailbox MB_CTRL_Dyn');
    await this.writeDynamicConfiguration(
      RF_REGISTER_ADDRESS.MB_CTRL_Dyn,
      MB_CTRL_Dyn_VAL.ENABLE_FTM << MB_CTRL_Dyn_SHIFT.MB_EN,
    );

    // validate Mailbox initializing, MB_CTRL_Dyn
    const [mbCtrlDyn] = await this.readDynamicConfiguration(
      RF_REGISTER_ADDRESS.MB_CTRL_Dyn,
    );
    const mailboxEnabled =
      MB_CTRL_Dyn_VAL.ENABLE_FTM << MB_CTRL_Dyn_SHIFT.MB_EN;
    if (mailboxEnabled !== (mbCtrlDyn & mailboxEnabled)) {
      this.errorLogger(
        register8bToInfoString(
          mbCtrlDyn,
          'MB_CTRL_Dyn',
          MB_CTRL_Dyn_SHIFT,
          MB_CTRL_Dyn_VAL,
        ),
      );

      return Promise.reject(
        new Error('Failed to initialize Mailbox MB_CTRL_Dyn'),
      );
    }
  }

  /**
   * @brief Write GPO Control Dynamic register
   * @TODO mark as static register
   * @see ST25DV.configureGPOControl
   * @example configureGPOControl(
   * (GPO_CTRL_Dyn_VAL.ENABLED_GPO_OUTPUT << GPO_CTRL_Dyn_SHIFT.GPO_EN)
   * | (GPO_CTRL_Dyn_VAL.PULSE_ON_WM_EOM << GPO_CTRL_Dyn_SHIFT.RF_GET_MSG_EN)
   * | (GPO_CTRL_Dyn_VAL.PULSE_ON_WM_COMPLETE << GPO_CTRL_Dyn_SHIFT.RF_PUT_MSG_EN))
   */
  async configureGPOControl(gpoControl: number) {
    this.debugLogger(
      'Configure GPO Control ',
      register8bToInfoString(
        gpoControl,
        'GPO_CTRL_Dyn',
        GPO_CTRL_Dyn_SHIFT,
        GPO_CTRL_Dyn_VAL,
      ),
    );
    await this.writeConfiguration(RF_REGISTER_ADDRESS.GPO_CTRL_Dyn, gpoControl);
  }
}
