import { NfcError } from 'react-native-nfc-manager';

import ST25DV from '../../drivers/ST25DV/st25dv';
import { register8bToInfoString } from '../../drivers/ST25DV/st25dv.utils';
import {
  GPO_CTRL_Dyn_SHIFT,
  GPO_CTRL_Dyn_VAL,
  MB_CTRL_Dyn_SHIFT,
  MB_CTRL_Dyn_VAL,
  MB_MODE_SHIFT,
  MB_MODE_VAL,
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

  // async writeMessageToMailbox(message: Uint8Array[]) {
  //   try {
  //     await this.nfcDriver.requestNfcTechnology();
  //     await this.nfcDriver.presentRFPassword();
  //     await this.nfcDriver.configureGPOControl();
  //     await this.nfcDriver.enableMailbox();
  //   } catch (ex: unknown) {
  //     console.error((ex as NfcError.NfcErrorBase).constructor.name);
  //     throw ex;
  //   } finally {
  //     await this.nfcDriver.cancelTechnologyRequest();
  //   }
  // }

  async testCmd() {
    try {
      await this.nfcDriver.requestNfcTechnology();
      let resp = await this.nfcDriver.presentRFPassword();
      console.log('presentRFPassword(): ', resp);

      // configure GPO
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

      // enable FTM
      resp = await this.nfcDriver.enableMailbox();
      console.log('enableMailbox()', resp);

      resp = await this.nfcDriver.readMailboxMode();
      console.log('readMailboxMode()', resp);
      console.log(
        register8bToInfoString(resp[0], 'MB_MODE', MB_MODE_SHIFT, MB_MODE_VAL),
      );

      // init FTM
      resp = await this.nfcDriver.initMailbox();
      console.log('initMailbox()', resp);

      resp = await this.nfcDriver.readMailboxControl();
      console.log('readMailboxControl()', resp);
      console.log(
        register8bToInfoString(
          resp[0],
          'MB_CTRL_Dyn',
          MB_CTRL_Dyn_SHIFT,
          MB_CTRL_Dyn_VAL,
        ),
      );

      // test MB message
      resp = await this.nfcDriver.writeMailboxMessage([
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
      ]);
      console.log('writeMailboxMessage()', resp);
    } catch (ex) {
      // TODO handle TagConnectionLost
      // console.warn(JSON.stringify(ex, Object.getOwnPropertyNames(ex)));
      console.warn((ex as NfcError.NfcErrorBase).constructor.name);
    } finally {
      await this.nfcDriver.cancelTechnologyRequest();
    }
  }
}

export default new NfcService(ST25DV);
