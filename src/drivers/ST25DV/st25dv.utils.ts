export const register8bToInfoString = (
  register: number | null | undefined,
  registerName: string,
  registerBitsEnum: Record<string, number | string>,
  registerValuesMap: Record<string, number>,
): string => {
  let infoString = `${registerName}: `;
  if (register === undefined || register === null)
    return infoString.concat('Undefined value, please verify it\n');

  // register value in HEX and BIN
  const registerHEXValue = register.toString(16);
  const registerBinValue = register.toString(2);
  infoString = infoString.concat(
    `HEX: 0x${registerHEXValue} | BIN: 0b${registerBinValue} \n`,
  );

  const registerBitsNames = Object.values(registerBitsEnum) as string[];
  const registerValuesNames = Object.keys(registerValuesMap);

  for (let bitPos = 0; bitPos < 8; bitPos++) {
    const bitName = registerBitsNames[bitPos];
    const bitValue = (register >> bitPos) & 1;
    const bitValueName = registerValuesNames[bitPos * 2 + bitValue];
    infoString = infoString.concat(
      `b${bitPos}: ${bitName.padEnd(32, ' ')} = ${bitValue} ${bitValueName}\n`,
    );
  }

  return infoString;
};
