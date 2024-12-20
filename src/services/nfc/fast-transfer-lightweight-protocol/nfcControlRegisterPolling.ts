import {
  MB_CTRL_Dyn_SHIFT,
  MB_CTRL_Dyn_VAL,
  RF_REGISTER_ADDRESS,
} from '../../../drivers/ST25DV/st25dv.constants';
import { ST25DV } from '../../../drivers/ST25DV/st25dv';

type PollPredicate = (controlRegisterValue: number) => boolean;

const MAILBOX_RF_POLLING_INTERVAL_MS = 50; // milliseconds
const RF_POLLING_TIMEOUT_MS = 1000; // interval to poll until aborting

const MESSAGE_IS_FROM_RF =
  MB_CTRL_Dyn_VAL.MESSAGE_IN_MB_IS_FROM_RF << MB_CTRL_Dyn_SHIFT.RF_CURRENT_MSG;
const MESSAGE_IS_FROM_HOST =
  MB_CTRL_Dyn_VAL.MESSAGE_IN_MB_IS_FROM_I2C <<
  MB_CTRL_Dyn_SHIFT.HOST_CURRENT_MSG;
const MESSAGE_IS_NOT_READ_BY_HOST =
  MB_CTRL_Dyn_VAL.RF_MESSAGE_IN_MAILBOX << MB_CTRL_Dyn_SHIFT.RF_PUT_MSG;
const MESSAGE_MISSED_BY_HOST =
  MB_CTRL_Dyn_VAL.I2C_MISSED_MESSAGE << MB_CTRL_Dyn_SHIFT.HOST_MISS_MSG;
const MESSAGE_MISSED_BY_RF =
  MB_CTRL_Dyn_VAL.RF_MISSED_MESSAGE << MB_CTRL_Dyn_SHIFT.RF_MISS_MSG;
const MESSAGE_PUT_BY_HOST =
  MB_CTRL_Dyn_VAL.I2C_MESSAGE_IN_MAILBOX << MB_CTRL_Dyn_SHIFT.HOST_PUT_MSG;

export const messageIsNotFromRF = (mbCtrlDyn: number) =>
  Boolean(!(mbCtrlDyn & MESSAGE_IS_FROM_RF));
export const messageIsMissedByHost = (mbCtrlDyn: number) =>
  Boolean(mbCtrlDyn & MESSAGE_MISSED_BY_HOST);
export const messageIsReadByHostSuccessfully = (mbCtrlDyn: number) =>
  Boolean(!(mbCtrlDyn & MESSAGE_IS_NOT_READ_BY_HOST));
export const messageIsMissedByRF = (mbCtrlDyn: number) =>
  Boolean(mbCtrlDyn & MESSAGE_MISSED_BY_RF);
export const messageIsFromHost = (mbCtrlDyn: number) =>
  Boolean(mbCtrlDyn & MESSAGE_IS_FROM_HOST);
export const messagePutByHost = (mbCtrlDyn: number) =>
  Boolean(mbCtrlDyn & MESSAGE_PUT_BY_HOST);

export const pollMBControlRegister = async (
  nfcDriver: ST25DV,
  pollSuccessPredicates: PollPredicate[],
  pollFailPredicates: PollPredicate[],
) => {
  let pollingIntervalID: NodeJS.Timeout | null = null;
  let pollingTimeoutID: NodeJS.Timeout | null = null;

  // poll (read MB_CTRL_Dyn with intervals) while cmd will be read by host or timeout exceeds
  return new Promise<number>((resolve, reject) => {
    pollingIntervalID = setInterval(() => {
      nfcDriver
        .readDynamicConfiguration(RF_REGISTER_ADDRESS.MB_CTRL_Dyn)
        .then(([mbCtrlDyn]) => {
          // check MB_CTRL_Dyn throughout all success predicates (AND): all should fulfill
          if (pollSuccessPredicates.every(predicate => predicate(mbCtrlDyn))) {
            resolve(mbCtrlDyn);
          }

          // check MB_CTRL_Dyn throughout all failure predicates (OR): fail in case of any
          if (pollFailPredicates.some(predicate => predicate(mbCtrlDyn))) {
            reject(
              new Error(
                `pollControlRegisterTillResult failed with MB_CTRL_Dyn value of ${mbCtrlDyn}`,
              ),
            );
          }
        })
        .catch(() => {
          reject(
            // in case of .readDynamicConfiguration fails itself
            new Error(
              'readDynamicConfiguration(RF_REGISTER_ADDRESS.MB_CTRL_Dyn) failure',
            ),
          );
        });
    }, MAILBOX_RF_POLLING_INTERVAL_MS);

    // abort polling on time limit exceeds
    pollingTimeoutID = setTimeout(() => {
      reject(new Error('MB_CTRL_Dyn polling exceeds timeout'));
    }, RF_POLLING_TIMEOUT_MS);
  }).finally(() => {
    if (pollingIntervalID) clearInterval(pollingIntervalID);
    if (pollingTimeoutID) clearTimeout(pollingTimeoutID);
  });
};
