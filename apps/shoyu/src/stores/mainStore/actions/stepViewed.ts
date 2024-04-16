import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';
import { InternalTrackEvents } from 'bento-common/types';

import { guideSelectorByStep, stepSelector } from '../helpers/selectors';
import trackStepView from '../mutators/trackStepView';
import { WorkingState } from '../types';

export default function stepViewed(
  state: WorkingState,
  {
    formFactor,
    eventType,
    step: stepEntityId,
  }: GlobalStateActionPayloads['stepViewed']
) {
  const guide = guideSelectorByStep(stepEntityId, state);
  const step = stepSelector(stepEntityId, state);

  if (step && guide) {
    switch (eventType) {
      case InternalTrackEvents.stepViewingStarted:
        step.hasViewedStep = true;
        break;
    }

    if (!guide.isPreview) {
      trackStepView({ formFactor, type: eventType, stepEntityId });
    }
  }
}
