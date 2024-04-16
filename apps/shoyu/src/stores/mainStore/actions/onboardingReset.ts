import { denormalize } from 'normalizr';
import {
  FullGuide,
  GlobalStateActionPayload,
  Guide,
} from 'bento-common/types/globalShoyuState';
import { deProxify } from 'bento-common/data/helpers';
import { omit } from 'bento-common/utils/lodash';

import mainStore from '..';
import {
  branchingStepInGuideSelector,
  lastBranchingGuideSelector,
} from '../helpers/selectors';
import resetOnboarding from '../mutators/resetOnboarding';
import { WorkingState } from '../types';
import normalizrSchema from '../schema';

export default function onboardingReset(
  state: WorkingState,
  { formFactor }: GlobalStateActionPayload<'onboardingReset'>
) {
  const guide = lastBranchingGuideSelector(state, formFactor);
  const branchingStep = branchingStepInGuideSelector(state, guide?.entityId);

  if (guide?.isPreview) {
    const fullGuide = deProxify(
      denormalize(
        branchingStep?.guide,
        normalizrSchema.guide,
        state
      ) as FullGuide
    );
    fullGuide.isComplete = false;
    fullGuide.isDone = false;
    fullGuide.completedStepsCount -= 1;
    fullGuide.nextGuide = undefined;
    fullGuide.canResetOnboarding = false;
    for (const module of fullGuide.modules) {
      if (module.entityId === branchingStep?.module) {
        module.completedStepsCount -= 1;
        module.isComplete = false;
        for (const step of module.steps) {
          if (step.entityId === branchingStep?.entityId) {
            step.isComplete = false;
            step.branching = {
              ...step.branching!,
              branches: step.branching!.branches.map((b) => ({
                ...b,
                selected: false,
              })),
            };
          }
        }
      }
    }
    setTimeout(() => {
      mainStore.getState().dispatch({
        type: 'availableGuidesChanged',
        availableGuides: [omit(fullGuide, ['modules', 'steps']) as Guide],
      });
      mainStore.getState().dispatch({ type: 'guideChanged', guide: fullGuide });
      mainStore.getState().dispatch({
        type: 'guideSelected',
        guide: fullGuide.entityId,
        formFactor,
      });
    }, 1);
  } else {
    resetOnboarding({ guideEntityId: guide?.entityId });
  }
}
