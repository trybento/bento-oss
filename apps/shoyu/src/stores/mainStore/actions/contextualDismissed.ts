import {
  GlobalStateActionPayload,
  StepState,
} from 'bento-common/types/globalShoyuState';

import { guideSelector } from '../helpers/selectors';
import { WorkingState } from '../types';
import mainStore from '..';
import stepChanged from './stepChanged';

const contextualDismissed = (
  state: WorkingState,
  { guideEntityId, formFactor }: GlobalStateActionPayload<'contextualDismissed'>
) => {
  const guide = guideSelector(guideEntityId, state);
  const firstStepEntityId = guide?.steps?.[0];

  if (!firstStepEntityId) return;

  stepChanged(state, {
    updateCompletionOnServer: !guide.isPreview,
    step: {
      entityId: firstStepEntityId,
      state: StepState.skipped,
    },
  });

  if (guide.isPreview) {
    setTimeout(() => {
      mainStore.getState().dispatch({
        type: 'stepSelected',
        formFactor,
        step: firstStepEntityId,
      });

      mainStore.getState().dispatch({
        type: 'stepChanged',
        updateCompletionOnServer: false,
        step: {
          entityId: firstStepEntityId,
          state: StepState.incomplete,
        },
      });
    }, 3000);
  }
};
export default contextualDismissed;
