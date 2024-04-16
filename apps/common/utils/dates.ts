import { pluralize } from './pluralize';

export function isPST() {
  return new Date().getTimezoneOffset() / 60 === 8;
}

export function roundToPSTDayStart(date?: Date) {
  return roundToPSTHour(0, date);
}

export const roundToPSTHour = (hour: number, date: Date = new Date()) => {
  return new Date(`${date.toDateString()} ${hour}:00:00 GMT-8`);
};

export const addADay = (date?: Date): Date => {
  const newDate = date || new Date();
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

const ONE_SECOND_IN_MS = 1000;
const ONE_MINUTE_IN_MS = ONE_SECOND_IN_MS * 60;
const ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * 60;
const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;
const ONE_WEEK_IN_MS = ONE_DAY_IN_MS * 7;
const ONE_MONTH_IN_MS = ONE_DAY_IN_MS * 30;
const ONE_YEAR_IN_MS = ONE_DAY_IN_MS * 365;

export function fromNow(from: Date, to = new Date()) {
  const msDiff = Date.parse(to.toUTCString()) - Date.parse(from.toUTCString());
  let diff: number;
  let interval: string;
  if (msDiff < 0) {
    return 'the future';
  }
  if (msDiff < ONE_SECOND_IN_MS) {
    return 'just now';
  }
  if (msDiff >= ONE_YEAR_IN_MS) {
    diff = msDiff / ONE_YEAR_IN_MS;
    interval = 'year';
  } else if (msDiff >= ONE_MONTH_IN_MS) {
    diff = msDiff / ONE_MONTH_IN_MS;
    interval = 'month';
  } else if (msDiff >= ONE_WEEK_IN_MS) {
    diff = msDiff / ONE_WEEK_IN_MS;
    interval = 'week';
  } else if (msDiff >= ONE_DAY_IN_MS) {
    diff = msDiff / ONE_DAY_IN_MS;
    interval = 'day';
  } else if (msDiff >= ONE_HOUR_IN_MS) {
    diff = msDiff / ONE_HOUR_IN_MS;
    interval = 'hour';
  } else if (msDiff >= ONE_MINUTE_IN_MS) {
    diff = msDiff / ONE_MINUTE_IN_MS;
    interval = 'minute';
  } else if (msDiff >= ONE_SECOND_IN_MS) {
    diff = msDiff / ONE_SECOND_IN_MS;
    interval = 'second';
  }
  return `${Math.round(diff!)} ${pluralize(Math.floor(diff!), interval!)} ago`;
}

export function formatDate(
  date: Date | null | undefined,
  locales: string[] = ['en-us']
): string | null {
  return date
    ? date.toLocaleDateString(locales, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;
}

export function isValidDate(dateString: string): boolean {
  try {
    return !Number.isNaN(new Date(dateString).getTime());
  } catch (_e) {
    // Silence invalid date string and continue.
    return false;
  }
}
