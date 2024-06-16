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
}

export default new NfcService(ST25DV);
