import { original } from 'immer';
import { isEqual } from 'bento-common/utils/lodash';

import { lastDesiredStateSelector } from '../helpers/selectors';
import {
  AirTrafficStore,
  DesiredState,
  WorkingAirTrafficStore,
} from '../types';

/** Determines the max allowed length of the desired state history list */
const DESIRED_STATE_HISTORY_LIMIT = 10;

/**
 * @todo unit test that the list wont grow indefinitely
 * @todo unit test the list removes the last desired state when threshold is met
 */
export default function desiredStatePushed(
  state: WorkingAirTrafficStore,
  { value }: Parameters<AirTrafficStore['pushDesiredState']>[0]
) {
  let lastDesiredState: DesiredState | undefined =
    lastDesiredStateSelector(state);

  if (lastDesiredState) {
    lastDesiredState = original(lastDesiredState);
  }

  // skip if the new state is the same as the last one
  if (lastDesiredState && isEqual(value, lastDesiredState)) return;

  // append the new value to the history while still making sure the list doesn't grow indefinitely
  state.desiredStateHistory = [
    ...state.desiredStateHistory.slice(1 - DESIRED_STATE_HISTORY_LIMIT),
    value,
  ];
  state.sidebarOpen = value.sidebarOpen;
  state.sidebarAutoFocused = value.sidebarAutoFocused;
}
