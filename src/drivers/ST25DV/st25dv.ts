/**
 * @file ST25DV.ts
 * @brief Driver for NFC operations with ST ST25DV NFC tag
 * @details ST25DV is a dynamic NFC/RFID tag IC for IoT, connected objects, and industrial applications.
 *
 * @link https://www.st.com/en/nfc/st25dv04k.html
 * @link https://www.st.com/resource/en/product_presentation/st25tv_product_presentation-may2018.pdf
 * @link https://www.st.com/resource/en/datasheet/st25dv04k.pdf
 * @link https://www.st.com/resource/en/application_note/an4910-data-exchange-between-wired-ic-and-wireless-rf-iso-15693-using-fast-transfer-mode-supported-by-st25dvi2c-series-stmicroelectronics.pdf
 *
 * Memory organization:
 * ST25DV memory consists of blocks, addressed by ENDAi
 * TODO: Add more details about memory organization
 *
 * Generic data transfer:
 * RF user must first open the RF configuration security session to write ENDAi registers.
 * Most registers: R always, W if RF configuration security session is open and configuration not locked
 *
 * Mailbox (Fast Transfer Mode):
 * Mailbox is a 256-byte memory block that can be used to exchange data between the RF and the I2C interfaces.
 * In RF, mailbox is read via a dedicated (Fast) Read Message command. Read can start from any address value
 * inside the mailbox, between 00h and FFh. Writing in the mailbox is done via the (Fast) Write Message command
 * in one shot, always starting at mailbox address 00h. No password is needed to access mailbox from RF, but fast
 * transfer mode must be enabled.
 *
 * @note Particular data sequence could be found in AN4910 application note.
 *
 * The RF Control & Access to mailbox is possible using dedicated custom commands:
 * - Read Dynamic Configuration and Fast Read Dynamic Configuration to check availability of mailbox.
 * - Write Dynamic Configuration and Fast Write Dynamic configuration to enable or disable fast transfer mode.
 * - Read Message Length and Fast Read Message Length to get the length of the contained message,
 * - Read Message and Fast Read Message to download the content of the mailbox,
 * - Write Message and Fast Write Message to put a new message in mailbox. (New length is automatically
 * updated after completion of a successful Write Message or Fast Write Message command).
 *
 */
import { TagEvent } from 'react-native-nfc-manager';

export type LoggerFunction = (...args: Parameters<typeof console.log>) => void;

export interface ST25DV {
  /**
   * @brief Request NFC technology
   * @details Start any of your NFC operations sequence by calling this method.
   * NfcManager scans for NFC tags in the vicinity that support the requested technology.
   * Once an NFC tag of the specified technology is detected, the NFC manager sets up a connection with the tag.
   * This connection allows to send commands to and receive responses from the tag.
   */
  requestTechnology(): Promise<void>;

  /**
   * @brief Present RF password
   * @details Required for write operations - opens a security session
   */
  presentRFPassword(): Promise<number[]>;

  /**
   * @brief Read static configuration register
   */
  readConfiguration(registerAddress: number): Promise<number[]>;

  /**
   * @brief Write static configuration register
   * @returns empty array on success
   */
  writeConfiguration(
    registerAddress: number,
    registerValue: number,
  ): Promise<number[]>;

  /**
   * @brief Read dynamic configuration register
   */
  readDynamicConfiguration(registerAddress: number): Promise<number[]>;

  /**
   * @brief Write dynamic configuration register
   * @returns empty array on success
   */
  writeDynamicConfiguration(
    registerAddress: number,
    registerValue: number,
  ): Promise<number[]>;

  /**
   * @brief Read up to 256 byte of the mailbox, at double data rate.
   */
  fastReadMailboxMessage(): Promise<number[]>;

  /**
   * @brief Write up to 256 byte of the mailbox, at double data rate.
   * @param message - up to 256 byte message to write
   * @returns empty array on success
   */
  fastWriteMailboxMessage(message: number[]): Promise<number[]>;

  /**
   * @brief Read the length of the mailbox message, at double data rate.
   * @returns Length of the mailbox message - 1 byte e.g. 0xFF (255) means 256 bytes length
   */
  fastReadMailboxMessageLength(): Promise<number>;

  /**
   * @brief Initialize NFC Manager
   */
  init(): Promise<void>;

  /**
   * @brief Cancel the NFC technology request
   * @details End any of your NFC operations sequence by calling this method.
   */
  cancelTechnologyRequest(): Promise<void>;

  /**
   * @brief Get System information (basic tag information)
   */
  readBasicTagInfo(): Promise<TagEvent | null | undefined>;

  /**
   * @brief initialize Mailbox for Fast Transfer Mode
   * @details Enable Mailbox MB_MODE and initialize Mailbox MB_CTRL_Dyn
   * @note RF security session must be opened before (presentRFPassword)
   */
  initMailbox(): Promise<void>;

  /**
   * @brief Configure GPO Control Dynamic register
   */
  configureGPOControl(gpoControl: number): Promise<void>;
}
