import { faker } from '@faker-js/faker';
import { groupBy } from 'lodash';
import {
  collateLoaderResults,
  collateLoaderResultsBulk,
} from 'src/data/loaders/helpers';

const ids = [1, 2, 3, 4];
const idField = 'someId';
const otherPropField = 'otherProp';
const rowsOneOfEach = ids
  .slice()
  .reverse()
  .map((id) => ({
    [idField]: id,
    [otherPropField]: faker.person.fullName(),
  }));
const rowsMultipleOfEach = ids
  .slice()
  .reverse()
  .flatMap((id) =>
    Array(Math.ceil(Math.random() * 4))
      .fill(0)
      .map(() => ({ [idField]: id, [otherPropField]: faker.person.fullName() }))
  );

const groupedRows = groupBy(rowsMultipleOfEach, idField);
const groupedRowsWithValue = Object.fromEntries(
  Object.entries(groupedRows).map(([group, rows]) => [
    group,
    rows.map((row) => row[otherPropField]),
  ])
);

describe('collateLoaderResult', () => {
  test('entire row', () => {
    const collatedResult = collateLoaderResults(ids, rowsOneOfEach, idField);
    for (const [i, row] of collatedResult.entries()) {
      expect(row).toBe(rowsOneOfEach[3 - i]);
    }
  });
  test('some data within row', () => {
    const collatedResult = collateLoaderResults(
      ids,
      rowsOneOfEach,
      idField,
      otherPropField
    );
    for (const [i, row] of collatedResult.entries()) {
      expect(row).toBe(rowsOneOfEach[3 - i][otherPropField]);
    }
  });
  test('some data within row with a default for missing rows', () => {
    const collatedResult = collateLoaderResults(
      [...ids, 5],
      rowsOneOfEach,
      idField,
      otherPropField,
      'default'
    );
    for (const [i, row] of collatedResult.entries()) {
      expect(row).toBe(rowsOneOfEach[3 - i]?.[otherPropField] ?? 'default');
    }
  });
});

describe('collateLoaderResultBulk', () => {
  test('entire row', () => {
    const collatedResult = collateLoaderResultsBulk(
      ids,
      rowsMultipleOfEach,
      idField
    );
    for (const [i, row] of collatedResult.entries()) {
      expect(row).toEqual(groupedRows[ids[i]]);
    }
  });
  test('some data within row', () => {
    const collatedResult = collateLoaderResultsBulk(
      ids,
      rowsMultipleOfEach,
      idField,
      otherPropField
    );
    for (const [i, row] of collatedResult.entries()) {
      expect(row).toEqual(groupedRowsWithValue[ids[i]]);
    }
  });
  test('some data within row with a default for missing rows', () => {
    const collatedResult = collateLoaderResultsBulk(
      [...ids, 5],
      rowsMultipleOfEach,
      idField,
      otherPropField
    );
    for (const [i, row] of collatedResult.entries()) {
      expect(row).toEqual(groupedRowsWithValue[ids[i]] ?? []);
    }
  });
});
