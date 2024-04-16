import { formFactorSelector } from './../helpers/selectors';
import { WorkingState } from '../types';
import sidebarStore from '../../sidebarStore';

type Payload = {
  id: string;
};

/**
 * Assumes all guides related to this preview id will share the same
 * form factor, since the expectation is that different form factors
 * would ultimately use different ids.
 */
export default function formFactorRemoved(
  state: WorkingState,
  { id }: Payload
) {
  const sidebarStateId = formFactorSelector(state, id)?.sidebarStateId;
  if (sidebarStateId) {
    sidebarStore.getState().removeSidebarState(sidebarStateId);
  }
  delete state.formFactors[id];
}
