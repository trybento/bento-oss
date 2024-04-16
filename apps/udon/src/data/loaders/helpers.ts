import DataLoader from 'dataloader';
import { groupBy, keyBy } from 'lodash';
import promises from 'src/utils/promises';

/**
 * a convenience method for implementing a one to many data loader
 *
 * @param inputs ids for the input object to look up
 * @param rows result rows from the database query
 * @param groupKey column name in the results for the ids from inputs
 * @param rowKey column name in the results for the return object id
 * @param loader loader to invoke for result objects
 * @returns an array of objects, one for each key in the input
 */
export function loadBulk<
  R,
  GK extends keyof R,
  I extends R[GK] & (string | number),
  RK extends keyof R,
  V,
  DL extends DataLoader<R[RK], V>
>(
  inputs: readonly I[],
  rows: R[],
  groupKey: GK,
  rowKey: RK,
  loader: DL,
  allowNulls = false
): PromiseLike<V[][]> {
  const groups = groupBy(rows, groupKey);
  return promises.map(inputs, (input) => {
    if (!groups[input]) return [];
    return promises.map(
      groups[input],
      (row: R) =>
        (allowNulls
          ? row[rowKey]
            ? loader.load(row[rowKey])
            : null
          : loader.load(row[rowKey])) as unknown as V
    );
  });
}

/**
 * a convenience method for implementing a one to one data loader
 *
 * @param inputs ids for the input object to look up
 * @param rows result rows from the database query
 * @param groupKey column name in the results for the ids from inputs
 * @param rowKey column name in the results (or getter fn) for the return object id
 * @param loader loader to invoke for result objects
 * @returns an array of objects, one for each key in the input
 */
export function groupLoad<
  R,
  GK extends keyof R,
  I extends R[GK] & (string | number),
  RK extends keyof R,
  V,
  DL extends DataLoader<R[RK], V>
>(
  inputs: readonly I[],
  rows: R[],
  groupKey: GK,
  rowKey: RK | ((row: R) => R[RK]),
  loader: DL
): PromiseLike<(V | null)[]> {
  const groups = keyBy(rows, groupKey);
  return promises.map(inputs, (input) => {
    const id =
      typeof rowKey === 'function'
        ? rowKey(groups[input])
        : groups[input]?.[rowKey];
    return id ? loader.load(id) : null;
  });
}

/**
 * a convenience method for collating a one to many result for a data loader
 *
 * @param inputs ids for the input object to look up
 * @param rows result rows from the database query
 * @param groupKey column name in the results for the ids from inputs
 * @param rowKey column name in the results to return
 * @returns an array of objects, one for each key in the input
 */
export function collateLoaderResultsBulk<
  R,
  GK extends keyof R,
  I extends R[GK] & (string | number),
  RK extends keyof R
>(inputs: readonly I[], rows: R[], groupKey: GK, rowKey?: RK): (R | R[RK])[][] {
  const groups = groupBy(rows, groupKey);
  return inputs.map((input) =>
    (groups[input] || []).map((row) => (rowKey ? row[rowKey] : row))
  );
}

/**
 * a convenience method for collating a one to one result for a data loader
 *
 * @param inputs ids for the input object to look up
 * @param rows result rows from the database query
 * @param groupKey column name in the results for the ids from inputs
 * @param rowKey column name in the results to return
 * @returns an array of objects, one for each key in the input
 */
export function collateLoaderResults<
  R,
  GK extends keyof R,
  I extends R[GK] & (string | number),
  RK extends keyof R
>(
  inputs: readonly I[],
  rows: R[],
  groupKey: GK,
  rowKey?: RK,
  defaultValue?: R | R[RK]
): ((RK extends undefined ? R : R[RK]) | typeof defaultValue | null)[] {
  const groups = keyBy(rows, groupKey);
  return inputs.map(
    (input) =>
      (rowKey ? groups[input]?.[rowKey] : groups[input]) ?? defaultValue ?? null
  );
}
