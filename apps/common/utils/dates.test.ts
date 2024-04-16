import { roundToPSTDayStart, roundToPSTHour, addADay } from './dates';

const tzOffset = -(new Date().getTimezoneOffset() / 60);

const getTestDateString = (tz: number = tzOffset, day = '01') =>
  `2023-02-${day} 12:00:00 GMT${tz >= 0 ? `+${tz}` : tz}`;

// these tests have to take into account the timezone of the machine
// they're running on so they're not flaky
const getExpectedDateString = (tz: number, hour = '00') =>
  `${
    tzOffset - tz > 12
      ? '2023-02-02'
      : tzOffset - tz < -12
      ? '2023-01-31'
      : '2023-02-01'
  } ${hour}:00:00 GMT-8`;

describe('roundToPSTDayStart', () => {
  test.each([0, 3, 12, -5, -8, -11])('timezone offset: %d', (tz) => {
    expect(roundToPSTDayStart(new Date(getTestDateString(tz)))).toEqual(
      new Date(getExpectedDateString(tz))
    );
  });
});

describe('roundToPSTHour', () => {
  test.each([0, 3, 11, -5, -8, -11])('timezone offset: %d', (tz) => {
    expect(roundToPSTHour(3, new Date(getTestDateString(tz)))).toEqual(
      new Date(getExpectedDateString(tz, '03'))
    );
  });
});

describe('addADay', () => {
  test.each([3, 5, 23])('initial day: %d', (day) => {
    expect(
      addADay(
        new Date(getTestDateString(undefined, day.toString().padStart(2, '0')))
      )
    ).toEqual(
      new Date(
        getTestDateString(undefined, (day + 1).toString().padStart(2, '0'))
      )
    );
  });
});
