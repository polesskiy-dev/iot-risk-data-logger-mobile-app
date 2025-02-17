export const ST25DV_REQUEST_HEADER_MF_CODE = 0x02;
export const ST25DV_HIGH_DATA_RATE_HEADER = 0x02;

export const ST25DV_RF_PWD_0_NUMBER = 0x00;

export const DEFAULT_RF_PASSWORD = [
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
];

/**
 * ST25DV Commands list
 * @link https://www.st.com/resource/en/datasheet/st25dv04k.pdf#page=81
 */
export enum CMD {
  READ_SINGLE_BLOCK = 0x20,
  WRITE_SINGLE_BLOCK = 0x21,
  /**
   * System configuration registers commands
   * @note For ISO15693 it's custom command (0xA0 to 0xDF command code)
   */
  READ_CONFIGURATION = 0xa0,
  WRITE_CONFIGURATION = 0xa1,
  READ_DYN_CONFIGURATION = 0xad,
  WRITE_DYN_CONFIGURATION = 0xae,
  MANAGE_GPO = 0xa9, // emits a pulse on GPO
  /**
   * Special commands
   * @note some special commands doesn't require register address
   */
  PRESENT_PASSWORD = 0xb3,
  /**
   * Mailbox commands
   */
  FAST_WRITE_MAILBOX_MESSAGE = 0xaa, // 0xca,
  FAST_READ_MAILBOX_MESSAGE_LENGTH = 0xcb,
  FAST_READ_MAILBOX_MESSAGE = 0xcc,
}

export const MAILBOX_START_ADDRESS = 0x00;

// TODO: _Dyn registers are reset after POR, thereby we need to set them on device configuring
export enum RF_REGISTER_ADDRESS {
  GPO_CTRL_Dyn = 0x00, // GPO control
  MB_MODE = 0x0d, // Mailbox, Fast transfer mode control and status
  MB_CTRL_Dyn = 0x0d, // Mailbox, Fast transfer mode control and status
  MB_LEN_Dyn = 0x07, // Mailbox data length, Size in byte, minus 1 byte
}

export enum MB_MODE_SHIFT {
  MB_MODE = 0,
  RFU1,
  RFU2,
  RFU3,
  RFU4,
  RFU5,
  RFU6,
  RFU7,
}

export const MB_MODE_VAL = {
  DISABLE_FTM: 0x00,
  ENABLE_FTM: 0x01,
  RFU0: 0x00,
  RFU1: 0x00,
  RFU2: 0x00,
  RFU3: 0x00,
  RFU4: 0x00,
  RFU5: 0x00,
  RFU6: 0x00,
  RFU7: 0x00,
  RFU8: 0x00,
  RFU9: 0x00,
  RFU10: 0x00,
  RFU11: 0x00,
  RFU12: 0x00,
  RFU13: 0x00,
};

export enum MB_CTRL_Dyn_SHIFT {
  MB_EN = 0,
  HOST_PUT_MSG,
  RF_PUT_MSG,
  RFU,
  HOST_MISS_MSG,
  RF_MISS_MSG,
  HOST_CURRENT_MSG,
  RF_CURRENT_MSG,
}

export const MB_CTRL_Dyn_VAL = {
  DISABLE_FTM: 0x00,
  ENABLE_FTM: 0x01,
  NO_I2C_MESSAGE_IN_MAILBOX: 0x00,
  I2C_MESSAGE_IN_MAILBOX: 0x01,
  NO_RF_MESSAGE_IN_MAILBOX: 0x00,
  RF_MESSAGE_IN_MAILBOX: 0x01,
  RFU_RESERVED_LOW: 0x00,
  RFU_RESERVED_HIGH: 0x01,
  NO_MESSAGE_MISSED_BY_I2C: 0x00,
  I2C_MISSED_MESSAGE: 0x01,
  NO_MESSAGE_MISSED_BY_RF: 0x00,
  RF_MISSED_MESSAGE: 0x01,
  NO_MESSAGE_OR_MESSAGE_NOT_FROM_I2C: 0x00,
  MESSAGE_IN_MB_IS_FROM_I2C: 0x01,
  NO_MESSAGE_OR_MESSAGE_NOT_FROM_RF: 0x00,
  MESSAGE_IN_MB_IS_FROM_RF: 0x01,
};

export enum GPO_CTRL_Dyn_SHIFT {
  RF_USER_EN = 0,
  RF_ACTIVITY_EN,
  RF_INTERRUPT_EN,
  FIELD_CHANGE_EN,
  RF_PUT_MSG_EN, // Enabling this bit will generate a pulse on GPO on Mailbox message RF write completion
  RF_GET_MSG_EN, // Enabling this bit will generate a pulse on GPO on Mailbox message RF read completion
  RF_WRITE_EN,
  GPO_EN,
}

export const GPO_CTRL_Dyn_VAL = {
  DISABLED_RF_USER: 0x00,
  LEVEL_MANAGED_BY_GPO_COMMAND_SET: 0x01, // GPO output level is controlled by Manage GPO Command (set/reset)
  DISABLED_ACTIVITY: 0x00,
  LEVEL_CHANGES_BY_RF_EOF: 0x01, // GPO output level changes from RF command EOF to response EOF
  DISABLED_INTERRUPT: 0x00,
  LEVEL_MANAGED_BY_GPO_COMMAND_PULSE: 0x01, // : GPO output level is controlled by Manage GPO Command (pulse).
  DISABLED_FIELD_CHANGE: 0x00,
  PULSE_ON_RF_FIELD: 0x01, // A pulse is emitted on GPO, when RF field appears or disappears.
  DISABLED_RF_PUT_MSG: 0x00,
  PULSE_ON_WM_COMPLETE: 0x01, // A pulse is emitted on GPO at completion of valid RF Write Message command.
  DISABLED_GET_MSG: 0x00,
  PULSE_ON_WM_EOM: 0x01, // A pulse is emitted on GPO at completion of valid RF Read Message command if end of message has been reached.
  DISABLED_WRITE: 0x00,
  PULSE_ON_WM_COMPLETE_EEPROM: 0x01, // A pulse is emitted on GPO at completion of valid RF write operation in EEPROM.
  DISABLED_GPO_OUTPUT: 0x00,
  ENABLED_GPO_OUTPUT: 0x01,
};
