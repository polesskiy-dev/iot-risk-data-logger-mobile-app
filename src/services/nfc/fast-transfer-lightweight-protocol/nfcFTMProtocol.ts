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

const MAILBOX_RF_POLLING_INTERVAL_MS = 1; // milliseconds

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
 * 1. RF Put message
 * 2. Host (ST25DV) detect event
 * 3. Host (ST25DV) get message
 * 4. RF poll for message being read by host
 * 5. Host (ST25DV) sends response (ACK/NACK)
 */
export const sendCommand = async (nfcDriver: ST25DV, cmd: FTMCommand) => {
  const resp = await nfcDriver.fastWriteMailboxMessage(cmd.serialize());
  console.log('fastWriteMailboxMessage(): ', resp); // TODO check that resp is 0x00?

  const MESSAGE_IS_FROM_RF =
    MB_CTRL_Dyn_VAL.MESSAGE_IN_MB_IS_FROM_RF <<
    MB_CTRL_Dyn_SHIFT.RF_CURRENT_MSG;
  const MESSAGE_IS_NOT_READ_BY_HOST =
    MB_CTRL_Dyn_VAL.RF_MESSAGE_IN_MAILBOX << MB_CTRL_Dyn_SHIFT.RF_PUT_MSG;
  const MESSAGE_MISSED_BY_HOST =
    MB_CTRL_Dyn_VAL.I2C_MISSED_MESSAGE << MB_CTRL_Dyn_SHIFT.HOST_MISS_MSG;

  // TODO implement polling correctly by wrapping with Promise
  // polling until host will read RF message or
  const pollingID = setInterval(async () => {
    const [mbCtrlDyn] = await nfcDriver.readDynamicConfiguration(
      RF_REGISTER_ADDRESS.MB_CTRL_Dyn,
    );

    // console.log('readMailboxControl()', mbCtrlDyn);
    // console.log(
    //   register8bToInfoString(
    //     mbCtrlDyn,
    //     'MB_CTRL_Dyn',
    //     MB_CTRL_Dyn_SHIFT,
    //     MB_CTRL_Dyn_VAL,
    //   ),
    // );

    if (!(mbCtrlDyn & MESSAGE_IS_FROM_RF)) {
      clearInterval(pollingID);
      throw new Error('command is not transferred to host');
    }

    if (mbCtrlDyn & MESSAGE_MISSED_BY_HOST) {
      clearInterval(pollingID);
      throw new Error('command is missed by host');
    }

    // command successfully read by host (i2c)
    if (!(mbCtrlDyn & MESSAGE_IS_NOT_READ_BY_HOST)) {
      clearInterval(pollingID);
    }
  }, MAILBOX_RF_POLLING_INTERVAL_MS);
};
