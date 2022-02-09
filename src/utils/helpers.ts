export const splitStringAtFirst = (
  stringToSplit: string,
  separator: string
) => {
  const indexOfSeparator = stringToSplit.indexOf(separator);
  let firstPart = stringToSplit;
  let lastPart = undefined;
  if (indexOfSeparator >= 0) {
    firstPart = stringToSplit.substring(0, indexOfSeparator);
    lastPart = stringToSplit.substring(indexOfSeparator + separator.length);
  }
  return [firstPart, lastPart];
};

export const isValidFileOrDirName = (value: string): boolean => {
  return /^[^:/]+$/.test(value);
};
