/**
 * Converts a camelCase string to kebab-case
 * @param str any string
 */
export const kebabize = (str: string): string =>
    str.replace(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
    );