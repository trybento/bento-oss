export const reduceAsync = async <R, A extends any[]>(
  arr: A,
  cb: (acc: R | A[number], v: A[number], i: number, a: A) => Promise<R>,
  initialValue?: R
): Promise<R> =>
  arr.reduce<Promise<R>>(async (acc, v, i, a) => {
    const accValue = await acc;
    // @ts-ignore - complains about A being assignable to any[], but any[] not
    // being assignable to A... which seems weird
    return cb(accValue, v, i, a);
  }, Promise.resolve(initialValue));

/**
 * Polyfill of an impending Promise.any implementation in ES2021
 * @link https://dev.to/sinxwal/looking-for-promise-any-let-s-quickly-implement-a-polyfill-for-it-1kga
 * @link https://github.com/tc39/proposal-promise-any
 */
export const promiseAny = async <T>(
  iterable: Iterable<T | PromiseLike<T>>
): Promise<T> => {
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

/** Create wait time when we don't have a clear async resolve */
export const sleep = (time: number) =>
  new Promise<void>((res) => setTimeout(res, time));
