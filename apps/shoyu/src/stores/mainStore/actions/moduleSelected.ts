import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';

import { moduleSelector, formFactorSelector } from '../helpers/selectors';
import { WorkingState } from '../types';

/**
 * This action will mark a new module as selected and
 * unselect a previously selected step.
 *
 * NOTE: this action only updates the selection for the specific form factor
 * passed so the sidebar and inline can stay somewhat independent
 */
export default function moduleSelected(
  state: WorkingState,
  {
    formFactor,
    module: moduleEntityId,
  }: GlobalStateActionPayloads['moduleSelected']
) {
  const module = moduleSelector(moduleEntityId, state);

  if (module) module.isNew = false;

  const formFactorState = formFactorSelector(state, formFactor);

  if (formFactorState) {
    formFactorState.selectedModule = module?.entityId;
    formFactorState.selectedStep = undefined;
  }
}
