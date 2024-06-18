import { NfcError } from 'react-native-nfc-manager';

import ST25DV from '../../drivers/ST25DV/st25dv';

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
