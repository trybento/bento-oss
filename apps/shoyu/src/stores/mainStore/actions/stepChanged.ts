import {
  GlobalStateActionPayloads,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { deProxify, isInputStep } from 'bento-common/data/helpers';
import { isCompleteStep } from 'bento-common/utils/steps';
import { isFlowGuide } from 'bento-common/utils/formFactor';

import { guideSelectorByStep, stepSelector } from '../helpers/selectors';
import setStepSkipped from '../mutators/setStepSkipped';
import setStepCompletion from '../mutators/setStepCompletion';
import { WorkingState } from '../types';
import { updateGuideCompletion } from '../helpers';
import { InputFieldAnswerInput } from '../../../graphql/schema.types';
import mainStore from '..';

export default function stepChanged(
  state: WorkingState,
  {
    step,
    updateCompletionOnServer = true,
    /** Callback to hook into setStepCompletion onComplete event */
    onComplete,
  }: GlobalStateActionPayloads['stepChanged']
) {
  const previousStep = stepSelector(step.entityId, state)!;
  const guide = guideSelectorByStep(step.entityId, state);
  if (!guide) return;

  // merge step with new data
  state.steps[step.entityId] = {
    ...previousStep,
    ...step,
  };
  const fullStep = state.steps[step.entityId];

  updateGuideCompletion(state, guide.entityId);

  // should mark step as skipped/completed on the server?!
  if (
    updateCompletionOnServer &&
    !guide.isPreview &&
    previousStep &&
    step?.state &&
    step.state !== previousStep.state
  ) {
    const inputAnswers: InputFieldAnswerInput[] | undefined = isInputStep(
      fullStep.stepType
    )
      ? (fullStep.inputs || []).map(({ entityId, answer }) => ({
          entityId,
          answer,
        }))
      : undefined;

    switch (step.state) {
      case StepState.skipped:
        setStepSkipped({ stepEntityId: step.entityId, isSkipped: true });
        break;

      case StepState.complete:
      case StepState.incomplete:
        setStepCompletion(
          {
            stepEntityId: step.entityId,
            isComplete: isCompleteStep(step.state),
            ctaEntityId: step.ctaEntityId,
            inputAnswers,
          },
          { onComplete }
        );
        break;
    }
  } else if (
    /** @todo find better way of running the callback */
    updateCompletionOnServer &&
    !guide.isPreview &&
    previousStep &&
    step?.state &&
    step.state === previousStep.state
  ) {
    onComplete?.();
  } else if (
    guide?.isPreview &&
    step?.state &&
    step.state !== previousStep.state
  ) {
    const isComplete = !!guide.steps?.every(
      (stepEntityId) => state.steps[stepEntityId].isComplete
    );
    const guideData = deProxify({
      entityId: guide.entityId,
      isComplete,
      completedAt: isComplete ? guide.completedAt || new Date() : undefined,
    });

    setTimeout(() => {
      mainStore.getState().dispatch({
        type: 'guideChanged',
        guide: guideData,
      });
    }, 10);

    // Needed to redirect user after completing a step.
    if (isFlowGuide(guide.formFactor)) onComplete?.();
  }
}
