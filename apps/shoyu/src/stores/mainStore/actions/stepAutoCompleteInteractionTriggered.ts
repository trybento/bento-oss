import {
  EmbedTypenames,
  GlobalStateActionPayloads,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { debugMessage } from 'bento-common/utils/debugging';
import {
  guideSelector,
  nextUrlOfFlowSelector,
  siblingStepEntityIdsOfStepSelector,
  stepAutoCompleteInteractionSelector,
  stepSelector,
} from '../helpers/selectors';
import { WorkingState } from '../types';
import { updateGuideCompletion } from '../helpers';
import setStepAutoCompletion from '../mutators/setStepAutoCompletion';
import stepChanged from './stepChanged';
import { recordPreviewProgress } from '../../../components/VisualBuilder/guidePreviewHelpers';
import { original } from 'immer';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import {
  startAirTrafficJourney,
  endAirTrafficJourney,
} from '../../airTrafficStore/helpers/airTraffic.helpers';
import { handleButtonClickUrl } from '../../../lib/helpers';

export default function stepAutoCompleteInteractionTriggered(
  state: WorkingState,
  {
    interactionEntityId,
    currentPageUrl,
  }: GlobalStateActionPayloads['stepAutoCompleteInteractionTriggered']
) {
  const interaction = stepAutoCompleteInteractionSelector(
    interactionEntityId,
    state
  );

  if (!interaction) {
    debugMessage('[BENTO] Auto-complete interaction not found, skipping...');
    return;
  }

  const guide = guideSelector(interaction.guide, state);

  if (!guide) {
    debugMessage(
      '[BENTO] Guide of auto-complete interaction not found, skipping...'
    );
    return;
  }

  updateGuideCompletion(state, guide.entityId);

  if (!guide.isPreview) {
    setStepAutoCompletion({
      interactionEntityId,
    });
  } else {
    stepChanged(state, {
      step: {
        entityId: interaction.step,
        isComplete: true,
        completedAt: new Date(),
        state: StepState.complete,
      },
      updateCompletionOnServer: false,
    });

    const updatedGuide = state.guides[guide.entityId];

    recordPreviewProgress({
      guide: updatedGuide,
      steps: original(state.steps),
    });
  }

  const step = stepSelector(interaction.step, state);
  const stepEntityIdSiblings = siblingStepEntityIdsOfStepSelector(
    state,
    step?.entityId
  );

  const nextStep = stepSelector(stepEntityIdSiblings.next, state);
  const nextUrlOfFlow = isFlowGuide(guide?.formFactor)
    ? nextUrlOfFlowSelector(state, { currentStep: step })
    : undefined;

  /**
   * If this is a Flow-type guide and a next step is available, start a new journey
   * and navigate the user to the next step.
   */
  if (nextStep && nextUrlOfFlow) {
    startAirTrafficJourney({
      type: EmbedTypenames.guide,
      startedFromGuide: step?.guide,
      startedFromModule: step?.module,
      startedFromStep: step?.entityId,
      selectedGuide: nextStep!.guide,
      selectedModule: nextStep!.module,
      selectedStep: nextStep!.entityId,
      selectedPageUrl: nextUrlOfFlow,
      endingCriteria: {
        closeSidebar: false,
        navigateAway: true,
      },
    });

    setTimeout(() => {
      if (handleButtonClickUrl(nextUrlOfFlow!, currentPageUrl, false) === -1) {
        endAirTrafficJourney({
          selectedGuide: interaction.guide,
          reason: { navigateAway: true },
        });
      }
    }, 10);
  } else if (!nextStep) {
    /**
     * For ALL form factors, if there is no next step, end an associated journey if one exists.
     * This is especially useful for properly handling auto-completion for the last step of a Flow.
     */
    endAirTrafficJourney({
      selectedGuide: interaction.guide,
      reason: { autoCompletion: true },
    });
  }
}
