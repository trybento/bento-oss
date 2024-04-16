import usePrevious from 'bento-common/hooks/usePrevious';
import { useRef, useState, useCallback, useEffect } from 'react';
import useReduxDevtools from './useReduxDevtools';
import { Action } from '../types';
import { getDiffMessage } from '../utils/debugging';
import { debounce } from '../utils/lodash';

type Dispatcher<A extends Action> = (action: A) => void;

export type ReducerEffect<A extends Action, S extends object> = (
  dispatch: Dispatcher<A>,
  addEffect: (cb: () => void) => void,
  state: S,
  prevState: S
) => void;

type Options = {
  // Used to define the name of the store in the Redux Devtools
  name?: string;
  // Whether to attach the redux devtools to help debugging
  debug: boolean;
};

/**
 * Just like `useReducer` except it allows providing an effect callback which
 * while similar to using a separate `useEffect` will evaluate the callback
 * immediately rather than waiting for the component to fully render. This means
 * it's useful for making the state react to changes from outside data without
 * waiting for a full render cycle (and any potentially flashing/delays that
 * might cause). This also means the effect cannot be used to directly handle
 * component state updates or anything else that might affect anything
 * external to the reducer state.
 *
 * State updates are handled by sending actions to the dispatcher passed to the
 * effect callback as if it were being dispatched to a normal `useReducer`.
 *
 * There are some cases where "normal" effects are desired and would be
 * cumbersome to handle in a normal `useEffect`. For those cases, an addition
 * callback is sent to the effect which can be used to define such effect and
 * will run within a normal `useEffect` during the current render cycle.
 *
 * Note: This uses the Redux Devtools for debugging and a name can be provided
 * to ensure it's easy to find and follow.
 *
 * Example:
 * ```ts
 * const [state, dispatch] = useReducerWithEffect(
 *   initialState,
 *   reducer,
 *   (effectDispatch, addEffect) => {
 *     if (some condition) {
 *       effectDispatch({type: 'someAction', ...payload});
 *     } else if (some other condition that needs an actual effect) {
 *       addEffect(() => setSomeStateOrSomething(someData));
 *       effectDispatch({type: 'someOtherAction', ...payload});
 *     }
 *   },
 *   { name: 'Some Reducer' },
 * );
 * ```
 */
export default function useReducerWithEffect<
  S extends object,
  A extends Action
>(
  initialState: S,
  reducer: (state: S, action: A) => typeof initialState,
  effect: ReducerEffect<A, S>,
  deps: any[],
  options: Options = {
    debug: false,
  }
): [typeof initialState, Dispatcher<A>] {
  const [, setStateChange] = useState<boolean>(false);
  const state = useRef<S>(initialState);

  const triggerStateChange = useCallback(
    // small debounce to batch state changes
    debounce(() => setStateChange((a) => !a), 16),
    []
  );

  const { actionWrapper: debugAction, init } = useReduxDevtools(
    `${options.name || 'useReducerWithEffect'} - ${window.location.host}`,
    options.debug
  );

  useEffect(() => {
    init(state.current);
  }, [init]);

  const applyAction = useCallback<Dispatcher<A>>(
    (action) => {
      debugAction(action, () => {
        state.current = reducer(state.current, action);
        return state.current;
      });
    },
    [reducer, debugAction]
  );

  const dispatch = useCallback<Dispatcher<A>>(
    (action) => {
      applyAction(action);
      triggerStateChange();
    },
    [applyAction]
  );

  const effects = useRef([]);

  const addEffect = (cb: () => void) => {
    effects.current.push(cb);
  };

  const prevDeps = usePrevious(deps);
  const prevState = usePrevious(state.current);
  if (
    !prevDeps ||
    prevDeps.length !== deps.length ||
    deps.filter((dep, i) => dep !== prevDeps[i]).length > 0 ||
    prevState !== state.current
  ) {
    effect(
      (action) =>
        applyAction({
          ...action,
          deps,
          prevDeps,
          depDiff: getDiffMessage(prevDeps, deps),
        }),
      addEffect,
      state.current,
      prevState
    );
  }

  useEffect(() => {
    effects.current.forEach((e) => e());
    effects.current = [];
  });

  return [state.current, dispatch];
}
