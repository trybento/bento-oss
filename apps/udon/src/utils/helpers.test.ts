import { sub, differenceInHours, isAfter } from 'date-fns';

import {
  checkForUnixDate,
  createdAtChanged,
  getOffHourStartTime,
  isOffHours,
} from './helpers';
import { applyFinalCleanupHook } from 'src/data/datatests';

applyFinalCleanupHook();

describe('checkForUnixDate', () => {
  test('date ISO string helper returns ISO string', () => {
    const now = Date.now();
    const d = new Date(now);
    const strUnix = String(now);
    const str = d.toISOString();

    expect(checkForUnixDate(now)).toEqual(str);
    expect(checkForUnixDate(strUnix)).toEqual(str);
    expect(checkForUnixDate(d)).toEqual(str);
  });

  test('null or undefined return the same', () => {
    expect(checkForUnixDate(null)).toBeNull();
    expect(checkForUnixDate(undefined)).toBeUndefined();
  });
});

describe('createdAtChanged', () => {
  test.each([
    [undefined, null],
    [null, undefined],
    [new Date('Jan 9, 2023'), new Date('Jan 9, 2023').toISOString()],
    [new Date('2021-12-14T23:41:13.000Z'), '2021-12-14T23:41:13.000Z'],
  ])('[%s, %s] returns false', (left, right) => {
    expect(createdAtChanged(left, right)).toEqual(false);
  });

  test.each([
    [null, new Date().toISOString()],
    [undefined, new Date().toISOString()],
    [new Date(), null],
    [new Date(), sub(new Date(), { days: 1 }).toISOString()],
  ])('[%s, %s] returns true', (left, right) => {
    expect(createdAtChanged(left, right)).toEqual(true);
  });
});

describe('off hour detection helpers', () => {
  test('detects off hours', () => {
    const businessIsGood = new Date('April 5, 2023 16:15:30 GMT');

    expect(isOffHours(businessIsGood)).toBeFalsy();

    const thingsAreQuiet = new Date('April 5, 2023 08:15:30 GMT');

    expect(isOffHours(thingsAreQuiet)).toBeTruthy();
  });

  test('gets next off hours', () => {
    [0, 3, 15, 23].forEach((hour) => {
      const startTime = new Date(new Date().setUTCHours(hour, 0, 0, 0));

      const nextTimeItsQuiet = getOffHourStartTime(startTime);

      expect(isOffHours(nextTimeItsQuiet)).toBeTruthy();
      expect(differenceInHours(startTime, nextTimeItsQuiet)).toBeLessThan(24);
      expect(isAfter(nextTimeItsQuiet, startTime)).toBeTruthy();
    });
  });
});
