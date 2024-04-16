export function cleanArray<T>(
  arr: (T | undefined | null)[] | undefined | null
): T[] {
  if (!arr) return [];

  return arr.filter(Boolean);
}
