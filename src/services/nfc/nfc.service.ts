import { NfcError } from 'react-native-nfc-manager';

import ST25DV from '../../drivers/ST25DV/st25dv';
import { register8bToInfoString } from '../../drivers/ST25DV/st25dv.utils';
import {
  GPO_CTRL_Dyn_SHIFT,
  GPO_CTRL_Dyn_VAL,
  MB_CTRL_Dyn_SHIFT,
  MB_CTRL_Dyn_VAL,
} from '../../drivers/ST25DV/st25dv.constants';

class NfcService {
  private nfcDriver: InstanceType<typeof ST25DV>;
  constructor(NFCDriver: typeof ST25DV) {
    this.nfcDriver = new NFCDriver();
  }

  async readDeviceChipsInfo() {
    const tag = await this.nfcDriver.readBasicTagInfo();

    return { tag };
  }

  async prepareMailbox() {
    try {
      await this.nfcDriver.requestNfcTechnology();
      await this.nfcDriver.presentRFPassword();
      await this.nfcDriver.configureGPOControl();
      await this.nfcDriver.enableMailbox();
    } catch (ex: unknown) {
      console.error((ex as NfcError.NfcErrorBase).constructor.name);
      throw ex;
    } finally {
      await this.nfcDriver.cancelTechnologyRequest();
    }
  }

  async testCmd() {
    try {
      await this.nfcDriver.requestNfcTechnology();
      let resp = await this.nfcDriver.presentRFPassword();
      console.log('presentRFPassword(): ', resp);

      resp = await this.nfcDriver.configureGPOControl();
      console.log('configureGPOControl()', resp);

      resp = await this.nfcDriver.readGPOControl();
      console.log('readGPOControl()', resp);
      console.log(
        register8bToInfoString(
          resp[0],
          'GPO_CTRL',
          GPO_CTRL_Dyn_SHIFT,
          GPO_CTRL_Dyn_VAL,
        ),
      );

      resp = await this.nfcDriver.enableMailbox();
      console.log('enableMailbox()', resp);

      resp = await this.nfcDriver.readMailboxConfig();
      console.log('readMailboxConfig()', resp);
      console.log(
        register8bToInfoString(
          resp[0],
          'MB_MODE',
          MB_CTRL_Dyn_SHIFT,
          MB_CTRL_Dyn_VAL,
        ),
      );
    } catch (ex) {
      // TODO handle TagConnectionLost
      console.warn(JSON.stringify(ex, Object.getOwnPropertyNames(ex)));
      console.warn((ex as NfcError.NfcErrorBase).constructor.name);
    } finally {
      await this.nfcDriver.cancelTechnologyRequest();
    }
  }
}

export default new NfcService(ST25DV);
