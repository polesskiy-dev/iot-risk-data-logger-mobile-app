export enum nfcCommands {
  GLOBAL_CMD_START_LOGGING = 0xc0, ///< Start logging measurements
  GLOBAL_CMD_STOP_LOGGING = 0xc1, ///< Stop logging measurements
  GLOBAL_CMD_WRITE_SETTINGS = 0xc2, ///< Write settings to the device
  GLOBAL_CMD_READ_SETTINGS = 0xc3, ///< Read settings from the device
  GLOBAL_CMD_READ_LOG_CHUNK = 0xc4, ///< Read log chunk from the device
}
