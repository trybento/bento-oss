export default function sortByString(
  rowA: any,
  rowB: any,
  /** Pass undefined if there is no need to access any key. */
  key: string | undefined,
  desc: boolean
) {
  const emptyVal = desc ? '' : 'zzzzzzzzzzzzz';
  const stringA = (
    ((key === undefined ? rowA : rowA?.[key]) || emptyVal) as string
  ).toLowerCase();
  const stringB: string = (
    ((key === undefined ? rowB : rowB?.[key]) || emptyVal) as string
  ).toLowerCase();
  return stringA === stringB ? 0 : stringA < stringB ? -1 : 1;
}
