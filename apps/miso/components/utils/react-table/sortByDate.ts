export default function sortByDate(
  rowA: any,
  rowB: any,
  /** Pass undefined if there is no need to access any key. */
  key: string | undefined,
  desc: boolean
) {
  const dateStringA = key === undefined ? rowA : rowA?.[key];
  const dateStringB = key === undefined ? rowB : rowB?.[key];

  if (!dateStringA && !dateStringB) return 0;

  if (!dateStringA) return desc ? -1 : 1;
  if (!dateStringB) return desc ? 1 : -1;

  const dateA = new Date(dateStringA);
  const dateB = new Date(dateStringB);

  if (dateA > dateB) return 1;
  if (dateB > dateA) return -1;

  return 0;
}
