import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export default class ST25DV {
  constructor() {
    // Pre-step, call this before any NFC operations
    NfcManager.start();
  }

  /**
   * @brief Request NFC-V (ISO 15693) technology
   * @details Library scans for NFC tags in the vicinity that support the requested technology.
   * Once an NFC tag of the specified technology is detected, the NFC manager sets up a connection with the tag.
   * This connection allows to send commands to and receive responses from the tag.
   */
  async requestNfcV() {
    try {
      await NfcManager.requestTechnology(NfcTech.NfcV);
      console.log('NFC-V technology requested');
    } catch (ex) {
      console.warn(ex);
    }
  }

  async readRegister(registerAddress: number) {
    try {
      await this.requestNfcV();

      const cmd = [
        ST25DV_REQUEST_HEADER,
        ST25DV_READ_SINGLE_BLOCK,
        registerAddress,
      ];
      const response = await NfcManager.transceive(cmd);
      console.log('Register Value:', response);
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  async writeRegister(registerAddress: number, value: number) {
    try {
      await this.requestNfcV();

      const cmd = [
        ST25DV_REQUEST_HEADER,
        ST25DC_WRITE_SINGLE_BLOCK,
        registerAddress,
        value,
      ];
      await NfcManager.transceive(cmd);
      console.log('Register written successfully');
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  async readBasicTagInfo() {
    try {
      await this.requestNfcV();
      const tag = await NfcManager.getTag(); // data example: {"icManufacturerCode": 2, "icSerialNumber": [Array], "id": "E0022402DFD5434E", "tech": "iso15693"}

      return tag;
    } catch (ex) {
      console.warn(ex);
    } finally {
      // Cancel the technology request
      NfcManager.cancelTechnologyRequest();
    }
  }
}
