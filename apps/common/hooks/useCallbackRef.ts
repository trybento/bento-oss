import { useCallback, useEffect } from 'react';

import useAutoUpdatingRef from './useAutoUpdatingRef';
import usePrevious from './usePrevious';
import { Cancelable, OmitFirstParameter } from '../types';
import { makeCancelable } from '../utils/functions';

type Opts = {
  callOnDepsChange?: boolean;
  callOnLoad?: boolean;
};

/**
 * Creates a memoized callback which always calls the most recent version of
 * the passed callback based on the given dependencies.
 *
 * NOTE: callOnDepsChange and callOnLoad cannot be used if the callback requires
 * any paramenters, i.e. only callbacks which are expected to be called without
 * parameters will work correctly when either of those options is enabled
 */
export default function useCallbackRef<A extends any[], D extends any[]>(
  cb: Cancelable<(...args: A) => any>,
  deps: D,
  { callOnDepsChange, callOnLoad }: Opts = {}
) {
  const callback = useCallback(makeCancelable(cb), deps);
  const prevCallback = usePrevious(callback);
  const callbackRef = useAutoUpdatingRef(callback);

  const cbFunc = useCallback((...args: A) => callbackRef.current(...args), []);

  useEffect(() => {
    if (
      // explicitly set to call on load
      (!prevCallback && callOnLoad) ||
      // set to call on dep change and not explicitly set to not call on load
      (callOnDepsChange && (prevCallback || callOnLoad !== false))
    ) {
      // @ts-ignore - we can't know what the parameters would be here so this
      // option only really works if the callback is expected to be called
      // without any parameters. And there isn't any really good way to let TS
      // know this so just ignore the error
      cbFunc();
    }
    // prevent callback from firing after it's been changed or the component
    // has been unmounted
    return () => callback.cancel?.();
  }, [callback]);

  return cbFunc;
}

type WrapperFn<CA extends any[], WA extends any[]> = Cancelable<
  (cb: Cancelable<(...args: CA) => any>, ...args: WA) => any
>;

type WrapperArgs<F extends WrapperFn<any[], any[]>> = {
  fn: F;
  args: OmitFirstParameter<F>;
};

/**
 * Creates a memoized wrapped callback where the wrapper's logic doesn't get
 * reset when the underlying callback is changed. This is useful for cases
 * where the callback is throttled or debounced and changes a lot but the
 * throttle/debounce shouldn't be canceled just because the callback changes.
 *
 * NOTE: callOnDepsChange and callOnLoad will NOT honor the wrapper logic
 * because that would then require the wrapped callback to also react to the
 * dependencies thus negating the benefit of this helper. As such, if either of
 * those options are on it may cause duplicate calls to the underlying callback.
 */
export function useWrappedCallbackRef<
  WA extends any[],
  CA extends any[],
  D extends any[]
>(
  wrapper: WrapperArgs<WrapperFn<CA, WA>>,
  cb: Cancelable<(...args: CA) => any>,
  deps: D,
  callbackRefArgs?: Opts
) {
  const callbackRef = useCallbackRef(cb, deps, callbackRefArgs);
  return useCallback(wrapper.fn(callbackRef, ...wrapper.args), []);
}
