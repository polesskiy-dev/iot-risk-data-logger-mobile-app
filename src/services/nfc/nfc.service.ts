import { NfcError } from 'react-native-nfc-manager';

import ST25DV from '../../drivers/ST25DV/st25dv';
import { register8bToInfoString } from '../../drivers/ST25DV/st25dv.utils';
import { MB_CTRL_Dyn_SHIFT, MB_CTRL_Dyn_VAL } from '../../drivers/ST25DV/st25dv.constants';

class NfcService {
  private nfcDriver: InstanceType<typeof ST25DV>;
  constructor(NFCDriver: typeof ST25DV) {
    this.nfcDriver = new NFCDriver();
  }

  async readDeviceChipsInfo() {
    const tag = await this.nfcDriver.readBasicTagInfo();

    return { tag };
  }

  async testCmd() {
    try {
      await this.nfcDriver.requestNfcTechnology();
      let resp = await this.nfcDriver.presentRFPassword();
      console.log('presentRFPassword(): ', resp);

      resp = await this.nfcDriver.readMailboxConfig();
      console.log('readMailboxConfig()', resp);
      console.log(register8bToInfoString(resp[0], 'MB_CTRL_Dyn', MB_CTRL_Dyn_SHIFT, MB_CTRL_Dyn_VAL));

      resp = await this.nfcDriver.enableMailbox();
      console.log('enableMailbox()', resp);
    } catch (ex) {
      console.warn(JSON.stringify(ex, Object.getOwnPropertyNames(ex)));
      console.warn((ex as NfcError.NfcErrorBase).constructor.name);
    } finally {
      await this.nfcDriver.cancelTechnologyRequest();
    }
  }
}

export default new NfcService(ST25DV);
