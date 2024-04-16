import { dset } from 'dset';

/**
 * This is a collection of utilities from lodash (or mimicking those) that we
 * use in shoyu and common. We've pulled these out because no matter how much
 * the lodash imports are optimized they still add way more bloat than is
 * necessary for how little of the library we use.
 */

export function pick<V extends object>(
  obj: V,
  keys: (keyof V)[]
): Pick<V, (typeof keys)[number]> {
  if (typeof obj !== 'object') {
    throw new TypeError('expected an object to pick');
  }
  return Object.fromEntries(
    keys.map((key) => [key, obj[key]]).filter(([_, val]) => val !== undefined)
  ) as Pick<V, (typeof keys)[number]>;
}

export function omit<V extends object>(
  obj: V,
  keys: (keyof V)[]
): Omit<V, (typeof keys)[number]> {
  if (typeof obj !== 'object') {
    throw new TypeError('expected an object to pick');
  }
  const keepKeys = (Object.keys(obj) as (keyof V)[]).filter(
    (key) => !keys.includes(key)
  );
  return pick<V>(obj, keepKeys);
}

export function once<V>(cb: (...args: any[]) => V) {
  let called = false;
  let ret: V;
  return (...args: Parameters<typeof cb>) => {
    if (!called) {
      called = true;
      ret = cb(...args);
    }
    return ret;
  };
}

export function keyBy<V extends object>(
  arr: V[],
  key: keyof V | ((v: V, i: number) => string)
): Record<string, V> {
  const getKey = typeof key === 'function' ? key : (item) => item[key];
  return Object.fromEntries(arr.map((item, i) => [getKey(item, i), item]));
}

export function groupBy<V extends object>(
  arr: V[],
  key: keyof V | ((v: V, i: number) => string)
): Record<string, V[]> {
  return arr.reduce((a, v: V, i) => {
    const itemKey = (typeof key === 'function' ? key : (item) => item[key])(
      v,
      i
    );

    if (a[itemKey]) a[itemKey].push(v);
    else a[itemKey] = [v];
    return a;
  }, {} as Record<string, V[]>);
}

export function isEqual(one: any, two: any): boolean {
  if (one === two) {
    return true;
  }
  if (
    typeof one !== typeof two ||
    (!Array.isArray(one) && typeof one !== 'object')
  ) {
    return false;
  }
  if (
    (Array.isArray(one) && one.length !== two.length) ||
    (typeof one === 'object' &&
      Object.keys(one).length !== Object.keys(two).length)
  ) {
    // there are a different number of keys the 2 items can't be equal
    return false;
  }
  let equal = true;
  const entries = typeof one === 'object' ? Object.entries(one) : one.entries();
  for (const [key, value] of entries) {
    equal = isEqual(value, two[key]);
    if (!equal) {
      break;
    }
  }
  return equal;
}

export function unzip(arr: any[][]): any[][] {
  if (arr.length === 0) {
    return [];
  }
  return arr.reduce(
    (result, item) => {
      for (const [i, value] of item.entries()) {
        result[i].push(value);
      }
      return result;
    },
    [...Array(arr[0].length)].map(() => [])
  );
}

export function cloneDeep<V>(value: V): V {
  if (value != null) {
    if (Array.isArray(value)) {
      return value.map(cloneDeep) as unknown as V;
    }
    if (typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as unknown as object).map(([key, v]) => [
          key,
          cloneDeep(v),
        ])
      ) as unknown as V;
    }
  }
  return value;
}

export function difference<V>(...arrs: V[][]): V[] {
  return arrs.reduce((a, b) => a.filter((value) => !b.includes(value)));
}

export function flow(
  funcs: ((...args: any[]) => any)[]
): (
  ...args: Parameters<(typeof funcs)[number]>
) => ReturnType<(typeof funcs)[0]> {
  return (...args) =>
    funcs.reduce(
      (fnArgs, fn) => fn(...(Array.isArray(fnArgs) ? fnArgs : [fnArgs])),
      args
    );
}

export function flowRight(
  funcs: ((...args: any[]) => any)[]
): (
  ...args: Parameters<(typeof funcs)[0]>
) => ReturnType<(typeof funcs)[number]> {
  return flow(funcs.slice().reverse());
}

export function debounce<R>(
  func: (...args: any[]) => R,
  wait: number,
  {
    leading = false,
    trailing = true,
    maxWait,
  }: { leading?: boolean; trailing?: boolean; maxWait?: number } = {}
): typeof func & {
  cancel: () => void;
  flush: () => void;
  pending: () => void;
} {
  let lastArgs: Parameters<typeof func> | undefined;
  let lastThis: any | undefined;
  let result: R;
  let timerId: number | NodeJS.Timeout | undefined;
  let lastCallTime: number | undefined;

  let lastInvokeTime = 0;
  let maxing = false;

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF =
    !wait && wait !== 0 && typeof window.requestAnimationFrame === 'function';

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  wait = +wait || 0;
  maxing = !!maxWait;
  maxWait = maxing ? Math.max(maxWait || 0, wait) : maxWait;

  function invokeFunc(time: number) {
    const args = lastArgs!;
    const thisArg = lastThis!;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function startTimer(
    pendingFunc: Function | FrameRequestCallback,
    wait: number
  ) {
    if (useRAF) {
      window.cancelAnimationFrame(timerId as number);
      return window.requestAnimationFrame(pendingFunc as FrameRequestCallback);
    }
    return setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id: number | NodeJS.Timeout) {
    if (useRAF) {
      return window.cancelAnimationFrame(id as number);
    }
    clearTimeout(id);
  }

  function leadingEdge(time: number) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - lastCallTime!;
    const timeSinceLastInvoke = time - lastInvokeTime!;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, maxWait! - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - lastCallTime!;
    const timeSinceLastInvoke = time - lastInvokeTime!;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait!)
    );
  }

  // @ts-ignore-error
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timerId !== undefined;
  }

  function debounced(...args: Parameters<typeof func>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    // @ts-ignore - TS complains that this is implicitly any, but we don't know
    // what the actual type is and setting it to any explicitly doesn't clear up
    // the error
    lastThis = this; // eslint-disable-line @typescript-eslint/no-this-alias
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  return debounced;
}

export function throttle(
  func: (...args: any[]) => void,
  wait: number,
  {
    leading = false,
    trailing = true,
  }: { leading?: boolean; trailing?: boolean } = {}
) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}

export function isNil(value: any): boolean {
  return value === null || value === undefined;
}

export function isPlainObject(val: any) {
  if (val === undefined || val === null || val.then) return false;
  return Object.prototype.toString.call(val) === '[object Object]';
}

export function chunk<T>(array: T[], size = 1) {
  size = Math.max(size, 0);
  const length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  return result;
}

/** @todo improve types and add unit tests */
export function forOwn(obj: Object, iteratee: Function) {
  for (const key of Object.keys(obj)) {
    const result = iteratee(obj[key], key, obj);
    if (result === false) {
      break;
    }
  }
}

/** @todo improve types and add unit tests */
export function deepFreeze<T>(value: T) {
  if (
    Array.isArray(value) ||
    isPlainObject(value) ||
    typeof value === 'function'
  ) {
    Object.freeze(value);
    forOwn(value as Object, Object.freeze);
  }
  return value;
}

/** @todo improve types and add unit tests */
export function get(object: any, path: string | string[], fallback?: any) {
  if (isPlainObject(object)) {
    const keys = Array.isArray(path) ? path : path.split('.');

    let index = 0;
    const length = keys.length;

    while (object != null && index < length) {
      object = object[keys[index++]];
    }
    return index && index === length ? object || fallback : fallback;
  }

  return fallback;
}

/**
 * Memoize a function result based on its arguments.
 * WARNING: The caching map can grow indefinitely, therefore this should be used with caution.
 *
 * @todo add unit tests
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  resolver?: (...args: Parameters<T>) => any
): T & {
  cache: Map<any, ReturnType<T>>;
} {
  const cache = new Map<any, ReturnType<T>>();

  const memoized = function (...args: Parameters<T>) {
    const key = resolver ? resolver(...args) : args[0];
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }
  };

  // exposes the case to the outside world
  memoized.cache = cache;

  return memoized as T & { cache: Map<any, ReturnType<T>> };
}

export {
  /**
   * Allows safely writing deep Object values.
   * NOTE: This implementation comes from `dset`, but shares the exact same API as `lodash/set`;
   */
  dset as set,
};
