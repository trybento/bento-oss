import isISODate from 'is-iso-date';
import fetch, { Response as FetchResponse } from 'node-fetch';
import { existsSync, mkdirSync } from 'fs';
import { AbortSignal } from 'node-fetch/externals';
import promises from 'src/utils/promises';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'sequelize';
import { isWeekend, isBefore, addDays } from 'date-fns';
import { TargetValueType } from 'bento-common/types';

import { logger } from 'src/utils/logger';
import { setFlushLocked } from 'src/data/events';
import { IS_DEVELOPMENT, IS_E2E, IS_TEST, SHUTDOWN_MAX } from './constants';
import TimeoutError from 'src/errors/TimeoutError';
import TimeoutManager from './TimeoutManager';
import { removeWhiteSpaces } from 'bento-common/data/helpers';
import BaseError from 'src/errors/baseError';

/*
 * Generic tiny utils that don't belong to any certain category
 */

/**
 * Sync directory create for dev use only
 * Example use case: make sure that __generated__ directory exists for creating schemas
 * @param dirPath
 */
export const makeDirIfNotExists = (dirPath: string): void => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, {
      recursive: true,
    });
  }
};

/**
 * When do we consider off hours in UTC time? 5am UTC, 10pm PST?
 *   Don't ride up too early to avoid DST shifts
 *   and 5am PST end
 */
const OFF_HOURS_START = 5;
const OFF_HOURS_END = 12;

/**
 * Define "off hours" as weekend
 *   or [var]-12AM UTC
 */
export const isOffHours = (inDate?: Date) => {
  const d = inDate ?? new Date();

  if (isWeekend(d)) return true;

  const utcHours = d.getUTCHours();
  return utcHours >= OFF_HOURS_START && utcHours <= OFF_HOURS_END;
};

/**
 * Get the next time we're in off hours.
 */
export const getOffHourStartTime = (inDate?: Date) => {
  const d = inDate ?? new Date();

  const targetDate = new Date(new Date().setUTCHours(OFF_HOURS_START, 0, 0, 0));

  /* If we lapsed over hour 0, dont allow targeting the past */
  return isBefore(targetDate, d) ? addDays(targetDate, 1) : targetDate;
};

export const addTimeToDate = (date: Date, milliseconds: number) => {
  date.setMilliseconds(date.getMilliseconds() + milliseconds);
  return date;
};

export const urlIsValid = async (
  url: string,
  acceptAllErrors = false,
  customTest?: (res) => void
) => {
  try {
    const controller = new AbortController();
    const signal = controller.signal as AbortSignal;
    const timeout = setTimeout(() => {
      logger.info(`[urlIsValid] Timeout hit for checking ${url}`);
      controller.abort();
    }, 25000).unref();

    const res = await fetch(url, { method: 'head', signal });

    customTest?.(res);

    if (timeout) clearTimeout(timeout);
    return !acceptAllErrors
      ? /* success defined by success code or server error on endpoint */
        res.status < 400 || res.status >= 500
      : res.status < 400;
  } catch (e) {
    return false;
  }
};

/** Check url valid several times to prevent one-off errors */
export const urlIsValidWithVerify = async (url: string, times: number) => {
  let failed = 0;
  for (let i = 0; i < times; i++) {
    const valid = await urlIsValid(url);
    if (!valid) failed++;
    await sleep(1000);
  }

  return failed < times;
};

const isNotError = <T>(item: T | Error): item is T => !(item instanceof Error);

/** Remove errors from list so TS doesn't think everything is (Type | Error) */
export const stripErrorsFromArray = <T>(arr: (T | Error)[]): T[] =>
  arr.filter(isNotError);

export const sortArrayByObjectKey = <T>(
  inputArray: T[],
  key: keyof T,
  asc = true
) => {
  if (!Array.isArray(inputArray) || !key || typeof key !== 'string')
    return inputArray;

  inputArray.sort((a, b) => {
    if (a[key] < b[key]) {
      return asc ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return asc ? 1 : -1;
    }
    return 0;
  });

  return inputArray;
};

export const dedupeArrayByKey = <T>(array: T[], key: keyof T) =>
  array.filter(
    (value, i, arr) => arr.findIndex((t) => t[key] === value[key]) === i
  );

/** Create an async partition to break up potentially blocking long-running tasks */
export const createPartition = (): Promise<void> =>
  new Promise((resolve) => setImmediate(resolve));

/** Create easy waits */
export const sleep = (delay: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delay).unref());

export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

export const getEmailsArray = (emails: string | null = '', separator = ',') => {
  if (!emails) return [];
  return removeWhiteSpaces(emails).split(separator).filter(Boolean);
};

/**
 * @param rate Number, 0 - 1
 * @returns whether or not rng is under the provided rate.
 */
export const downsample = (rate: number) => {
  const _rate = rate < 0 ? 0 : rate > 1 ? 1 : rate;

  return Math.random() < _rate;
};

export const randomFromArray = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const elementsAfterValue = <T>(arr: T[], ele: T, include = true) => {
  const i = arr.indexOf(ele) + (include ? 0 : 1);
  return i >= 0 ? arr.slice(i) : arr;
};

/** Run a callback upon receiving an exit code */
export const useExitHook = (
  callback: (signal?: string) => Promise<void> | void
) =>
  ['exit', 'SIGNINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'].forEach((signal) =>
    process.on(signal, (signal) => callback(signal))
  );

/** Run a callback on an unhandled error event */
export const useUncaughtErrorHook = (callback: (e: any) => void) =>
  ['unhandledRejection', 'uncaughtException'].forEach((errEvent) =>
    process.on(errEvent, (e) => {
      callback(e);
      throw e;
    })
  );

/**
 * Determines if we should force quit instead of attempting a
 * graceful shutdown.
 */
export const shouldForceQuit = () => IS_DEVELOPMENT || IS_E2E || IS_TEST;

export const fetchTimeout = (
  url: string,
  options,
  timeout = 30 * 1000
): Promise<FetchResponse> => {
  if (!url) throw new Error('No URL provided to fetchTimeout');
  if (timeout < 100)
    throw new Error('Invalid timeout supplied to fetchTimeout');

  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new TimeoutError(url, timeout)), timeout)
    ) as any,
  ]);
};

export const parseCmdArgs = (): { [arg: string]: string } => {
  const cmdArgs = process.argv.slice(2);
  return cmdArgs.reduce((a, v) => {
    const t = v.split('=');
    a[t[0]] = t[1] || true;
    return a;
  }, {});
};

export function slugify(name: string): string {
  return name.toLocaleLowerCase().replace(/\s/g, '-').replace(/[^\w]/gi, '');
}

export const parseParams = (query: URLSearchParams) => {
  // parse query string
  const params = query;

  const obj = {};

  // iterate over all keys
  for (const key of params.keys()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = params.get(key);
    }
  }

  return obj;
};

/** Read an env var as a number if it exists */
export const envNum = (varName: string) =>
  process.env[varName] ? Number(process.env[varName]) : undefined;

/** Remove undefined so prevent key setting uses with sqlize */
export const removeUndefined = (obj: object) =>
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);

export const chunkArray = <T>(arr: T[], chunkSize: number) => {
  const result: Array<T>[] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

type ShutdownFallbackArgs = {
  onFail?: () => void;
};

/**
 * Adds a fallback eprocess exit timer.
 * @returns Cancel method to clear the timeout
 */
export const useShutdownFallback = ({ onFail }: ShutdownFallbackArgs = {}) => {
  const fallback = setTimeout(() => {
    logger.warn(
      '[exit] Could not properly clean due to timeout, forcing shutdown'
    );
    onFail && onFail();
    process.nextTick(() => process.exit(1));
  }, SHUTDOWN_MAX);

  const cancelFallback = () => fallback && clearTimeout(fallback);

  return cancelFallback;
};

/** Run necessary cleanup methods and wrap with logs and fallback */
export const runShutdown = async (
  processName: string,
  fns: (() => Promise<any>)[]
) => {
  const shutdownProcesses = new Set<string>();

  const logOutstandingShutdown = () => () => {
    logger.warn(
      `[exit:${processName}] Outstanding processes: ${Array.from(
        shutdownProcesses
      ).join(',')}`
    );
  };

  /** See if method starts/resolves */
  const wrapWithLog = async (fn: () => Promise<any>) => {
    const n = fn.name;
    const start = Date.now();
    logger.info(`[exit:${processName}:${n}] Initiated`);
    shutdownProcesses.add(n);
    await fn();
    logger.info(
      `[exit:${processName}:${n}] Resolved in ${Date.now() - start}ms`
    );
    shutdownProcesses.delete(n);
  };

  const cancelFallback = useShutdownFallback({
    onFail: logOutstandingShutdown(),
  });

  /* Standard shutdowns that apply across processes */
  TimeoutManager.clearAll();
  setFlushLocked(true);

  /*
   * We limit the concurrency to make sure we can shutdown the priority items first
   *  e.g. stop taking new requests before closing db connections
   */
  await promises.map(fns, (fn) => wrapWithLog(fn), { concurrency: 2 });

  cancelFallback();
};

export const formatColor = (value: string | null | undefined) => {
  return value ? `#${value}` : '';
};

/** Make sure UNIX dates become ISO strings too */
export const checkForUnixDate = (
  value: null | undefined | number | string | Date
) => {
  return value === null
    ? value
    : typeof value === 'number' || !isNaN(value as any)
    ? new Date(+value!).toISOString()
    : typeof value === 'string' || !value
    ? value
    : value.toISOString();
};

/**
 * Determines if the createdAt of an object has changed by comparing
 * both values.
 *
 * Most useful within account/user attr checks.
 */
export const createdAtChanged = (
  current: undefined | null | Date,
  newValue: undefined | null | string
): boolean => {
  // if both values are falsy (undefined or null)
  if (!current && !newValue) {
    return false;
  }

  // if a current value exists but now should be set to null
  if (current && newValue === null) {
    return true;
  }

  // if a new value has been set
  if (newValue) {
    /**
     * WARNING: Need to cast dates to same format before comparing,
     * otherwise runs the risk of false positives if the input format
     * is not ISO format.
     */
    return current?.getTime() !== new Date(newValue).getTime();
  }

  // e.g. if new value is undefined but current value exists
  return false;
};

/**
 * Determines if any mutable attribute has changed by comparing
 * current vs input values.
 *
 * Most useful within account/user attr checks.
 */
export const mutableAttrsChanged = (
  mutableAttributes: string[],
  existing: Model | null,
  input: Record<string, unknown>
) => {
  if (!existing) return true;
  return mutableAttributes.some((attr) => {
    if (
      // if attribute is not present in the input object
      typeof input[attr] === 'undefined' ||
      // or if both current/new values are falsy
      (!existing?.[attr] && !input[attr])
    ) {
      return false;
    }
    return existing?.[attr] !== input[attr];
  });
};

type WithRetriesArgs = {
  remainingAttempts?: number;
  backoff?: boolean;
  max: number;
  /** Custom error classes we'll throw because retries won't help */
  throwErrors?: Array<typeof BaseError>;
  /** Pass a handler if we want to do something with the error besides discarding */
  onError?: (e: any, remainingAttempts: number) => void;
};

/** Retry a block before permanent failing */
export const withRetries = async <T>(
  fn: (attempt?: number) => Promise<T>,
  { remainingAttempts, max, backoff, throwErrors, onError }: WithRetriesArgs
): Promise<T> => {
  const _remaining = remainingAttempts ?? max;
  try {
    return await fn(_remaining);
  } catch (e) {
    onError?.(e, _remaining);

    if (
      _remaining === 0 ||
      throwErrors?.some((errType) => e instanceof errType)
    )
      throw e;
    logger.debug(
      `[retryBlock] retry block failed, remaining attempts: ${remainingAttempts}`
    );

    if (backoff) await sleep(backoffDelay(_remaining));

    return withRetries(fn, { remainingAttempts: _remaining - 1, backoff, max });
  }
};

/** Remove null keys from an object */
export const removeNullKeys = (obj: object) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

export function getCustomAttributeValueColumnName(valueType: TargetValueType) {
  return valueType === TargetValueType.stringArray
    ? 'textValue'
    : `${valueType}Value`;
}

export function getAttributeValueFieldName(valueType: TargetValueType) {
  return valueType === TargetValueType.stringArray
    ? 'textValues'
    : `${valueType}Value`;
}

export function getAttributeValueType(value: any): TargetValueType | null {
  return Array.isArray(value)
    ? TargetValueType.stringArray
    : isISODate(value)
    ? TargetValueType.date
    : (typeof value === 'string'
        ? TargetValueType.text
        : TargetValueType[typeof value]) || null;
}

/**
 * Convert between utf8 and base64
 */
export const handleBase64String = (
  input: string,
  direction: 'to' | 'from' = 'to'
) =>
  direction === 'to'
    ? Buffer.from(input, 'utf8').toString('base64')
    : Buffer.from(input, 'base64').toString('utf8');

/** By default: 100, 200, 400, 800, 1600... etc */
export const backoffDelay = (tries: number, randomSpread = 0) =>
  2 ** tries * 100 +
  (randomSpread > 0 ? Math.ceil(Math.random() * randomSpread) : 0);

/** Take a number from 0 to 1 and plot it to a logarithmic scale from 1 to 100 */
export const linearToLogarithmic = (linearValue: number) => {
  let value = Math.round(Math.pow(100, linearValue));

  if (value < 1) {
    value = 1;
  } else if (value > 100) {
    value = 100;
  }

  return value;
};

export const emptyMiddleware = (
  _a: Request,
  _b: Response,
  next: NextFunction
) => {
  next();
};

export const flattenObject = (obj: object) => {
  const flattened = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value));
    } else {
      flattened[key] = value;
    }
  });

  return flattened;
};

export const allElementsEqual = <T>(arr: Array<T>) =>
  arr.every((v) => v === arr[0]);

/**
 * Gets the given environment variable, or throws an error
 * if it is not set.
 */
export const getEnvOrFail = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} not defined`);
  }

  return value;
};

/**
 * Determines if the given variable is either null or undefined,
 * enforcing the resulting type.
 */
export const isUndefinedOrNull = (val: any): val is undefined | null =>
  val === undefined || val === null;

/**
 * Extract Id directly from number or object.
 *
 * Useful for allowing methods to easily receive models or numbers directly since
 * the latter is much easier for unit testing purposes.
 */
export const extractId = <T extends number | { id: number }>(target: T) => {
  return typeof target === 'number' ? target : target?.id;
};
