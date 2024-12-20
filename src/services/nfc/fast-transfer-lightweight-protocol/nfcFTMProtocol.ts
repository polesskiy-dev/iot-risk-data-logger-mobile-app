/**
 * @brief Data exchange function between Mobile and ST25DV
 *
 * @detailed The protocol implemented here facilitates lightweight and reliable communication in a client-server manner.
 * Mobile sends the command with a payload and receives response
 *
 * @see protocol description @link https://github.com/polesskiy-dev/iot-risk-logger-stm32l4/blob/main/firmware/iot-risk-logger-stm32l4/app/tasks/nfc/README.md
 * @see RF-I2C ST Application Note  https://www.st.com/resource/en/application_note/an4910-data-exchange-between-wired-ic-and-wireless-rf-iso-15693-using-fast-transfer-mode-supported-by-st25dvi2c-series-stmicroelectronics.pdf
 */

import { ST25DV } from '../../../drivers/ST25DV/st25dv';
import { FTMCommand } from './FTMCommand';
import {
  GPO_CTRL_Dyn_SHIFT,
  GPO_CTRL_Dyn_VAL,
  MB_CTRL_Dyn_SHIFT,
  MB_CTRL_Dyn_VAL,
  RF_REGISTER_ADDRESS,
} from '../../../drivers/ST25DV/st25dv.constants';
import { register8bToInfoString } from '../../../drivers/ST25DV/st25dv.utils';
import {
  messageIsFromHost,
  messageIsMissedByHost,
  messageIsMissedByRF,
  messageIsNotFromRF,
  messageIsReadByHostSuccessfully,
  messagePutByHost,
  pollMBControlRegister,
} from './nfcControlRegisterPolling';

export const configureRFTransmission = async (nfcDriver: ST25DV) => {
  await nfcDriver.requestTechnology();
  await nfcDriver.presentRFPassword(); // it's required to present RF password before Mailbox transactions
  // TODO check weather RF password should be provided once at the very beginning or on every Mailbox transmission

  // configure GPO (interrupts pin for ST25DV)
  await nfcDriver.configureGPOControl(
    (GPO_CTRL_Dyn_VAL.ENABLED_GPO_OUTPUT << GPO_CTRL_Dyn_SHIFT.GPO_EN) |
      (GPO_CTRL_Dyn_VAL.PULSE_ON_WM_EOM << GPO_CTRL_Dyn_SHIFT.RF_GET_MSG_EN) |
      (GPO_CTRL_Dyn_VAL.PULSE_ON_WM_COMPLETE <<
        GPO_CTRL_Dyn_SHIFT.RF_PUT_MSG_EN),
    // | (GPO_CTRL_Dyn_VAL.PULSE_ON_RF_FIELD <<
    // GPO_CTRL_Dyn_SHIFT.FIELD_CHANGE_EN),
  );

  // read GPO control config back (for debug)
  const [gpoControl] = await nfcDriver.readDynamicConfiguration(
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
  await nfcDriver.initMailbox();
  console.log('enableMailbox()');

  // validate that FTM is enabled
  const [mbCtrlDyn] = await nfcDriver.readDynamicConfiguration(
    RF_REGISTER_ADDRESS.MB_CTRL_Dyn,
  );

  const MAILBOX_ENABLED = MB_CTRL_Dyn_VAL.ENABLE_FTM << MB_CTRL_Dyn_SHIFT.MB_EN;
  if (!(mbCtrlDyn & MAILBOX_ENABLED))
    throw new Error('Mailbox enabling failed');

  console.log('readMailboxControl()', mbCtrlDyn);
  console.log(
    register8bToInfoString(
      mbCtrlDyn,
      'MB_CTRL_Dyn',
      MB_CTRL_Dyn_SHIFT,
      MB_CTRL_Dyn_VAL,
    ),
  );
};

/**
 * @brief send general command with payload to device
 *
 * 1. RF Puts message
 * 2. Host (ST25DV) detects event
 * 3. Host (ST25DV) gets message
 * 4. RF polls for message being read by host (checking MB_CTRL_Dyn)
 */
export const sendCommand = async (nfcDriver: ST25DV, cmd: FTMCommand) => {
  try {
    console.log('sending a command: ', cmd.command.toString());
    // transfer command via RF to device
    const resp = await nfcDriver.fastWriteMailboxMessage(cmd.serialize());
    console.log('fastWriteMailboxMessage(): ', resp); // TODO check that resp is 0x00
  } catch (ex) {
    throw new Error('fastWriteMailboxMessage failed');
  }

  try {
    const mbCtrlDyn = await pollMBControlRegister(
      nfcDriver,
      [messageIsReadByHostSuccessfully],
      [messageIsNotFromRF, messageIsMissedByHost],
    );
    console.log(
      'pollControlRegisterTillResult: ',
      Number(mbCtrlDyn).toString(16),
    );
  } catch (ex) {
    throw ex;
  }
};

/**
 * @brief Read the data from device
 *
 * @note implied that command was sent before
 *
 * 1. Host Puts message
 * 2. RF polls for message (checking MB_CTRL_Dyn)
 * 4. RF reads the message length
 * 3. RF reads the actual message
 */
export const readResponse = async (nfcDriver: ST25DV) => {
  try {
    const mbCtrlDyn = await pollMBControlRegister(
      nfcDriver,
      [messageIsFromHost, messagePutByHost],
      [messageIsMissedByRF],
    );

    console.log(
      'pollControlRegisterTillResult: ',
      Number(mbCtrlDyn).toString(16),
    );

    const mbLenDyn = await nfcDriver.fastReadMailboxMessageLength(); // (returns size - 1) byte
    const mailboxData = await nfcDriver.fastReadMailboxMessage();

    return mailboxData;
  } catch (ex) {
    throw ex;
  }
};
