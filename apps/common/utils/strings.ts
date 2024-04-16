export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const stringToBoolean = (str: string | null | undefined): boolean => {
  switch (`${str}`.toLowerCase().trim()) {
    case 'false':
    case 'null':
    case 'undefined':
    case '0':
      return false;

    default:
      return Boolean(str);
  }
};
export const isIsoDate = (str: string) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d as any) && d.toISOString() === str; // valid date
};

const illegalRe = /[/?<>\\:*|"]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[. ]+$/;

/**
 * basically `sanitize-filename` package but simplified
 */
export const sanitizeForFilename = (str: string, replacement = '') =>
  str
    .replace(illegalRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);

export const snakeToCamelCase = (value: string | null | undefined): string =>
  typeof value === 'string'
    ? value.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    : '';

export const camelToSnakeCase = (value: string | null | undefined): string =>
  typeof value === 'string'
    ? value.replace(/([a-z][A-Z])/g, (g) => g[0] + '_' + g[1].toLowerCase())
    : '';

export const validJson = (input: string) => {
  if (!input) return null;
  try {
    JSON.parse(input);
  } catch {
    return false;
  }
  return true;
};

export const isJsonError = (message: string) =>
  message.includes('JSON at position') || message.includes('not valid JSON');

/** Get first series of digits from a string */
export const extractNumbers = (str: string): number[] =>
  str.match(/-?\d+/g)?.map((r) => Number(r)) ?? [];
