import { getEmbedFormFactorsForGuide } from 'bento-common/data/helpers';
import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';

import { formFactorSelector, guideSelector } from '../helpers/selectors';
import { WorkingState } from '../types';

/**
 * This action will mark a new guide as selected and
 * unselect any previously selected module or step.
 *
 * NOTE: when selecting a different onboarding guide in the inline or sidebar
 * this will update the other as well to reduce the amount of guides that can
 * be displayed at any one time
 */
export default function guideSelected(
  state: WorkingState,
  {
    guide: guideEntityId,
    formFactor,
    keepExistingSelections,
  }: GlobalStateActionPayloads['guideSelected']
) {
  const guide = guideSelector(guideEntityId, state);
  const guideFormFactors = getEmbedFormFactorsForGuide(guide, formFactor);

  for (const formFactor of guideFormFactors) {
    const formFactorState = formFactorSelector(state, formFactor);

    /**
     * If this is the initial load and we already have a guide selected,
     * we skip selecting a new guide for this form factor to not override
     * the initial selection from client storage.
     */
    if (keepExistingSelections && formFactorState?.selectedGuide) {
      continue;
    }

    if (formFactorState && formFactorState.selectedGuide !== guideEntityId) {
      formFactorState.selectedGuide = guideEntityId || undefined;
      formFactorState.selectedModule = undefined;
      formFactorState.selectedStep = undefined;
      formFactorState.selectedAt = new Date();

      if (!guideEntityId && formFactorState.initialGuide) {
        // this is mainly used to persist a context guide across page views when
        // the sidebar is still open, but if the sidebar is closed the context
        // guide gets deselected so this also effectively removes it from the
        // list of active guides unless it's still targeted for the current page
        delete formFactorState.initialGuide;
      }
    }
  }
}
