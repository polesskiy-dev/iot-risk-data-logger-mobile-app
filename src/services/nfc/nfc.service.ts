import { NfcError } from 'react-native-nfc-manager';

import { register8bToInfoString } from '../../drivers/ST25DV/st25dv.utils';
import {
  GPO_CTRL_Dyn_SHIFT,
  GPO_CTRL_Dyn_VAL,
  MB_CTRL_Dyn_SHIFT,
  MB_CTRL_Dyn_VAL,
  RF_REGISTER_ADDRESS,
} from '../../drivers/ST25DV/st25dv.constants';
import { ST25DVFactory } from '../../drivers/ST25DV/st25dv.factory';
import { ST25DV } from '../../drivers/ST25DV/st25dv';
import { nfcCommands } from './nfcCommands';

class NfcService {
  private nfcDriver: ST25DV;
  constructor(nfcDriver: ST25DV) {
    this.nfcDriver = nfcDriver;
  }

  async init() {
    this.nfcDriver.init();
  }

  async readDeviceChipsInfo() {
    const tag = await this.nfcDriver.readBasicTagInfo();

    return { tag };
  }

  async readDeviceSettings() {
    // TODO use FTM protocol utils

    const deviceSettings = 'mocked'; //await this.nfcDriver.readBasicTagInfo();

    return { deviceSettings };
  }

  async testCmd() {
    try {
      await this.nfcDriver.requestTechnology();
      let resp = await this.nfcDriver.presentRFPassword();
      console.log('presentRFPassword(): ', resp);

      // configure GPO
      await this.nfcDriver.configureGPOControl(
        (GPO_CTRL_Dyn_VAL.ENABLED_GPO_OUTPUT << GPO_CTRL_Dyn_SHIFT.GPO_EN) |
          (GPO_CTRL_Dyn_VAL.PULSE_ON_WM_EOM <<
            GPO_CTRL_Dyn_SHIFT.RF_GET_MSG_EN) |
          (GPO_CTRL_Dyn_VAL.PULSE_ON_WM_COMPLETE <<
            GPO_CTRL_Dyn_SHIFT.RF_PUT_MSG_EN),
        // | (GPO_CTRL_Dyn_VAL.PULSE_ON_RF_FIELD <<
        // GPO_CTRL_Dyn_SHIFT.FIELD_CHANGE_EN),
      );

      const [gpoControl] = await this.nfcDriver.readDynamicConfiguration(
        RF_REGISTER_ADDRESS.GPO_CTRL_Dyn,
      );
      console.log('readGPOControl()', gpoControl);
      console.log(
        register8bToInfoString(
          gpoControl,
          'GPO_CTRL_Dyn',
          GPO_CTRL_Dyn_SHIFT,
          GPO_CTRL_Dyn_VAL,
        ),
      );

      // init FTM
      await this.nfcDriver.initMailbox();
      console.log('enableMailbox()');

      const [mbCtrlDyn] = await this.nfcDriver.readDynamicConfiguration(
        RF_REGISTER_ADDRESS.MB_CTRL_Dyn,
      );
      console.log('readMailboxControl()', mbCtrlDyn);
      console.log(
        register8bToInfoString(
          mbCtrlDyn,
          'MB_CTRL_Dyn',
          MB_CTRL_Dyn_SHIFT,
          MB_CTRL_Dyn_VAL,
        ),
      );

      const CMD_TEST_ASCII = 'CMD_TEST'.split('').map((c) => c.charCodeAt(0));

      // test MB message
      resp = await this.nfcDriver.fastWriteMailboxMessage(CMD_TEST_ASCII);
      console.log('fastWriteMailboxMessage()', resp);
    } catch (ex) {
      // TODO handle TagConnectionLost
      console.warn((ex as NfcError.NfcErrorBase).constructor.name);
    } finally {
      await this.nfcDriver.cancelTechnologyRequest();
    }
  }
}

const nfcDriver = ST25DVFactory.createPlatformDriver(
  console.log,
  console.error,
);
const nfcServiceInstance = new NfcService(nfcDriver);

export default nfcServiceInstance;
