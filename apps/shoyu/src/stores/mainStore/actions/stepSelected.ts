import { moduleSelector } from './../helpers/selectors';
import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';

import { formFactorSelector, stepSelector } from '../helpers/selectors';
import { WorkingState } from '../types';

/**
 * This action will mark a new step as selected or deselect the current step.
 *
 * NOTE: this action only updates the selection for the specific form factor
 * passed so the sidebar and inline can stay somewhat independent
 */
export default function stepSelected(
  state: WorkingState,
  { formFactor, step: stepEntityId }: GlobalStateActionPayloads['stepSelected']
) {
  const step = stepSelector(stepEntityId, state);
  const module = moduleSelector(step?.module, state);

  if (module?.isNew) module.isNew = false;

  const formFactorState = formFactorSelector(state, formFactor);

  if (formFactorState) {
    formFactorState.selectedGuide =
      step?.guide || formFactorState.selectedGuide;
    formFactorState.selectedModule =
      step?.module || formFactorState.selectedModule;
    formFactorState.selectedStep = stepEntityId;
    formFactorState.selectedAt = new Date();
  }
}
