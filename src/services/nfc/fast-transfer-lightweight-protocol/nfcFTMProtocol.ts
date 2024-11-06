import { ST25DV } from '../../../drivers/ST25DV/st25dv';
import { nfcCommands } from '../nfcCommands';

export const sendCommand = async  (nfcDriver: ST25DV, cmd: nfcCommands) => {
  await nfcDriver.fastWriteMailboxMessage([
    nfcCommands.GLOBAL_CMD_READ_SETTINGS,
  ]);

  // TODO polling
};
