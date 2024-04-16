/**
 * Get the plural of a word based on a count.
 * Simply adds an s if no plural replacement param is provided
 */
export const pluralize = (
  count: number,
  word: string,
  plural: string = word + 's'
): string => ([1, -1].includes(count) ? word : plural);
