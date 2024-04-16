import { FormFactorState } from 'bento-common/types/globalShoyuState';
import { cleanOrphanedItems } from '../helpers';
import { formFactorSelector } from '../helpers/selectors';

import { WorkingState } from '../types';
import formFactorRemoved from './formFactorRemoved';

export default function previewGuideRemoved(
  state: WorkingState,
  { previewId }: { previewId: string }
) {
  const formFactorState = formFactorSelector(state, previewId);
  if (formFactorState) {
    formFactorRemoved(state, { id: previewId });
    const guideEntityId = formFactorState.guides[0];
    if (
      !Object.values<FormFactorState>(state.formFactors).some((ff) =>
        ff.guides.includes(guideEntityId)
      )
    ) {
      delete state.guides[guideEntityId];
    }
    cleanOrphanedItems(state);
  }
}
