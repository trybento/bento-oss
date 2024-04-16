import { Cancelable, OmitFirstParameter } from '../types';
import { debounce, throttle } from './lodash';

/**
 * Given a callback, this will add a cancel method which when called will
 * prevent the callback from actually being called anymore. This is mostly
 * useful for throttling and debouncing with some other delayed call.
 */
export function makeCancelable<A extends any[]>(
  cb: Cancelable<(...args: A) => any>,
  onCancel?: () => void
) {
  let canceled = false;
  const cancelableCallback = (...args: A) => {
    if (canceled) return;
    return cb(...args);
  };
  cancelableCallback.cancel = () => {
    canceled = true;
    cb.cancel?.();
    onCancel?.();
  };
  return cancelableCallback;
}

/**
 * This allows making an extra call to the provided callback after the given
 * delay. This is useful for cases where it maybe takes one extra render for
 * for an element (or anything else really) to be finished updating.
 */
export function callAgainAfterDelay<A extends any[]>(
  cb: Cancelable<(...args: A) => any>,
  delay: number
) {
  const cancelableCallback = makeCancelable(cb);
  const debouncedCallback = debounce(cancelableCallback, delay);

  const callback = makeCancelable(
    (...args: A) => {
      debouncedCallback(...args);
      return cancelableCallback(...args);
    },
    () => {
      cancelableCallback.cancel();
      debouncedCallback.cancel();
    }
  );

  return callback;
}

/**
 * Create a cancelable wrapped callback which bubbles up the cancelation
 */
function bubbleCancel<WA extends any[], CA extends any[]>(
  wrapperFn: Cancelable<
    (cb: Cancelable<(...args: CA) => any>, ...args: WA) => any
  >,
  cb: Cancelable<(...args: CA) => any>,
  // @ts-ignore
  wrapperFnParams: OmitFirstParameter<typeof wrapperFn> = []
) {
  return makeCancelable(wrapperFn(cb, ...wrapperFnParams), () => {
    cb.cancel?.();
  });
}

type ThrottleOpts = {
  throttleArgs: OmitFirstParameter<typeof throttle>;
  extraDelay: number;
};

export function throttleWithExtraCall<A extends any[]>(
  cb: Cancelable<(...args: A) => any>,
  { throttleArgs, extraDelay }: ThrottleOpts
) {
  return bubbleCancel(
    throttle,
    callAgainAfterDelay(cb, extraDelay),
    throttleArgs
  );
}

type DebounceOpts = {
  debounceArgs: OmitFirstParameter<typeof debounce>;
  extraCallDelay: number;
};

export function debounceWithExtraCall<A extends any[]>(
  cb: Cancelable<(...args: A) => any>,
  { debounceArgs, extraCallDelay }: DebounceOpts
) {
  return bubbleCancel(
    debounce,
    callAgainAfterDelay(cb, extraCallDelay),
    debounceArgs
  );
}

export const noop = () => {};
