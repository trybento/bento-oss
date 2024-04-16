import { deProxify } from 'bento-common/data/helpers';
import { GuideCompletionState } from 'bento-common/types';
import {
  GlobalStateActionPayloads,
  Guide,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { debugMessage } from 'bento-common/utils/debugging';

import { WorkingState } from '../types';

export default async function guidesLoaded(
  state: WorkingState,
  payload: GlobalStateActionPayloads['guidesLoaded']
) {
  // If there are no guides, then we don't need to do a thing
  if (!payload.guides.length) return;

  const guides = deProxify(
    Object.values<Guide>(state.guides).filter(
      (g) => !g.isPreview && payload.guides.includes(g.entityId)
    )
  );
  debugMessage('[BENTO] Sending guides loaded event');
  for (const guide of guides) {
    document.dispatchEvent(
      new CustomEvent('bento-onGuideLoad', {
        detail: {
          isComplete:
            (guide.completionState as unknown as GuideCompletionState) ===
              GuideCompletionState.complete || guide.isComplete,
          // NOTE: guide base isn't passed for the preview
          ...(guide.guideBase ? { guideBaseId: guide.guideBase.entityId } : {}),
          allSteps: guide.stepsByState
            ? [
                ...guide.stepsByState[StepState.incomplete],
                ...guide.stepsByState[StepState.complete],
                ...guide.stepsByState[StepState.skipped],
              ]
                .filter(Boolean)
                .map((s) => s.name)
            : [],
          completedSteps:
            guide.stepsByState?.[StepState.complete]?.map((s) => s.name) || [],
          skippedSteps:
            guide.stepsByState?.[StepState.skipped]?.map((s) => s.name) || [],
          viewedSteps: guide.stepsByState?.viewed?.map((s) => s.name) || [],
          isOnboarding: !guide.isSideQuest,
        },
      })
    );
  }
}
