import { Platform } from 'react-native';

// TODO implement constants
// const NFC_MAILBOX_PROTOCOL_CRC8_SIZE = 1
// const NFC_MAILBOX_PROTOCOL_CMD_SIZE               1
// #define NFC_MAILBOX_PROTOCOL_PAYLOAD_SIZE_ADDR      (NFC_MAILBOX_PROTOCOL_CMD_ADDR + NFC_MAILBOX_PROTOCOL_CMD_SIZE)
// #define NFC_MAILBOX_PROTOCOL_PAYLOAD_SIZE_SIZE      1
// #define NFC_MAILBOX_PROTOCOL_PAYLOAD_ADDR           (NFC_MAILBOX_PROTOCOL_PAYLOAD_SIZE_ADDR + NFC_MAILBOX_PROTOCOL_PAYLOAD_SIZE_SIZE)
// #define NFC_MAILBOX_PROTOCOL_HEADER_SIZE            (NFC_MAILBOX_PROTOCOL_CRC8_SIZE + NFC_MAILBOX_PROTOCOL_CMD_SIZE + NFC_MAILBOX_PROTOCOL_PAYLOAD_SIZE_SIZE)

// TODO implement Command
export class FTMCommand {
  constructor(private readonly command: FTMCommand, private readonly payload: number) {

  }
}

// TODO implement Response