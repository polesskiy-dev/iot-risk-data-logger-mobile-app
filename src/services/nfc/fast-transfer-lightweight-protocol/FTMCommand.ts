import { calculateCrc8NRSC5 } from './crc8';

const NFC_MAILBOX_PROTOCOL_CRC8_SIZE = 1;
const NFC_MAILBOX_PROTOCOL_CMD_SIZE = 1;
const NFC_MAILBOX_PROTOCOL_PAYLOAD_SIZE_SIZE = 1;
const NFC_MAILBOX_PROTOCOL_HEADER_SIZE =
  NFC_MAILBOX_PROTOCOL_CRC8_SIZE +
  NFC_MAILBOX_PROTOCOL_CMD_SIZE +
  NFC_MAILBOX_PROTOCOL_PAYLOAD_SIZE_SIZE;

const MAILBOX_DATA_MAX_SIZE = 256; // max capacity of ST25DV Mailbox buffer (0x100)
const MAILBOX_PAYLOAD_MAX_SIZE =
  MAILBOX_DATA_MAX_SIZE - NFC_MAILBOX_PROTOCOL_HEADER_SIZE; // capacity left for useful data

export enum PROTOCOL_CMD {
  GLOBAL_CMD_START_LOGGING = 0xc0, ///< Start logging measurements
  GLOBAL_CMD_STOP_LOGGING = 0xc1, ///< Stop logging measurements
  GLOBAL_CMD_WRITE_SETTINGS = 0xc2, ///< Write settings to the device
  GLOBAL_CMD_READ_SETTINGS = 0xc3, ///< Read settings from the device
  GLOBAL_CMD_READ_LOG_CHUNK = 0xc4, ///< Read log chunk from the device
}

/**
 * @brief Command for ST25DV Fast Transfer Mode data exchange
 *
 * @detailed The protocol implemented here facilitates lightweight and reliable communication in a client-server manner.
 * Mobile sends the command with a payload and receives response
 *
 * @see protocol description @link https://github.com/polesskiy-dev/iot-risk-logger-stm32l4/blob/main/firmware/iot-risk-logger-stm32l4/app/tasks/nfc/README.md
 */
export class FTMCommand {
  private readonly crc8: number; // CRC-8/NRSC-5
  private readonly payloadSize: number;

  constructor(
    readonly command: PROTOCOL_CMD,
    private readonly payload: number[],
  ) {
    this.command = command;

    if (payload.length > MAILBOX_PAYLOAD_MAX_SIZE)
      console.error('way too long payload fro mailbox');

    this.payload = payload.slice(0, MAILBOX_PAYLOAD_MAX_SIZE); // copy and trim to max size
    this.payloadSize = payload.length;

    // calc crc8/nrsc5
    this.crc8 = calculateCrc8NRSC5([
      this.command,
      this.payloadSize,
      ...this.payload,
    ]);
  }

  serialize() {
    const header = [this.crc8, this.command, this.payloadSize];
    return [...header, ...this.payload];
  }

  toString() {
    return this.serialize().reduce(
      (str, byte) => str.concat(Number(byte).toString(16)),
      '',
    );
  }
}

// TODO implement Response
