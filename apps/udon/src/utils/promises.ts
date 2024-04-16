import { chunk } from 'lodash';

type Resolvable<R> = R | PromiseLike<R>;

/**
 * Accepts a list of items, runs a mapping function for each
 * item, and returns the results in an array. Like Array.map(),
 * but for promises.
 *
 * Items will be mapped concurrently. An optional concurrency
 * setting controls the number of promises run in parallel.
 */
const map = async <T, R>(
  items: readonly T[],
  callback: (item: T, idx: number) => Resolvable<R>,
  options?: { concurrency?: number }
) => {
  const itemsWithIndex = items.map((v, i) => ({ v, i }));
  const batches = options?.concurrency
    ? chunk(itemsWithIndex, options.concurrency)
    : [itemsWithIndex];
  const results: R[] = [];

  for (const batch of batches) {
    results.push(
      ...(await Promise.all(batch.map(({ v, i }) => callback(v, i))))
    );
  }

  return results;
};

/**
 * Like `map` above, but iterates through items synchronously.
 */
const mapSeries = async <T, R>(
  items: readonly T[],
  callback: (item: T, index: number) => Resolvable<R>
) => {
  const results: R[] = [];
  let idx = 0;

  for (const item of items) {
    results.push(await callback(item, idx));
    idx++;
  }

  return results;
};

/**
 * Runs the given callback function for each item. All items
 * will be run in series unless concurrency specified.
 */
const each = async <T>(
  items: readonly T[],
  callback: (item: T) => Resolvable<unknown>,
  options?: { concurrency?: number }
) => {
  if (!options?.concurrency || options.concurrency <= 0) {
    for (const item of items) {
      await callback(item);
    }

    return;
  }

  /* Handle concurrency */
  const itemsWithIndex = items.map((v) => ({ v }));
  const batches = chunk(itemsWithIndex, options.concurrency);

  for (const batch of batches) {
    await Promise.all(batch.map(({ v }) => callback(v)));
  }
};

/**
 * Accepts a list of items, runs a filter function for each
 * item, and returns the filtered results in an array. Like
 * Array.filter(), but for promises.
 *
 * Items will be filtered in series.
 */
const filter = async <T>(
  items: readonly T[],
  callback: (item: T, index: number) => Resolvable<boolean>
) => {
  const results: T[] = [];
  let idx = 0;

  for (const item of items) {
    const shouldKeep = await callback(item, idx);

    if (shouldKeep) {
      results.push(item);
    }

    idx++;
  }

  return results;
};

/**
 * Accepts a list of items, runs a reduction function for each
 * item, and returns the final output. Like Array.reduce(), but
 * for promises.
 *
 * Items will be evaluated in series.
 */
const reduce = async <T, R>(
  items: readonly T[],
  callback: (out: R, item: T) => Resolvable<R>,
  init: R
) => {
  let out = init;

  for (const item of items) {
    out = await callback(out, item);
  }

  return out;
};

/**
 * Take a list of promises and resolves to the first one that's successful.
 *
 * Polyfill of an impending Promise.any implementation in ES2021
 * @link https://dev.to/sinxwal/looking-for-promise-any-let-s-quickly-implement-a-polyfill-for-it-1kga
 * @link https://github.com/tc39/proposal-promise-any
 */
const any = async <T>(iterable: Iterable<T | PromiseLike<T>>): Promise<T> => {
  return Promise.all(
    [...iterable].map((promise) => {
      return new Promise((resolve, reject) =>
        Promise.resolve(promise).then(reject, resolve)
      );
    })
  ).then(
    (errors) => Promise.reject(errors),
    (value) => Promise.resolve<T>(value)
  );
};

export default { mapSeries, map, each, filter, reduce, any };
