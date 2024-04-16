import { normalize, NormalizedSchema } from 'normalizr';
import {
  GlobalStateActionPayloads,
  StepAutoCompleteInteraction,
  StepAutoCompleteInteractionEntityId,
} from 'bento-common/types/globalShoyuState';

import schema from '../schema';
import { WorkingState } from '../types';
import { guideSelector } from '../helpers/selectors';

type NormalizedData = NormalizedSchema<
  {
    stepAutoCompleteInteractions: Record<
      StepAutoCompleteInteractionEntityId,
      StepAutoCompleteInteraction
    >;
  },
  StepAutoCompleteInteractionEntityId[]
>;

export default function stepAutoCompleteInteractionsChanged(
  state: WorkingState,
  payload: GlobalStateActionPayloads['stepAutoCompleteInteractionsChanged']
) {
  /**
   * Keep any existing interactions for destination guides, seeing as we
   * may want to relaunch a completed guide and therefore need the auto-complete
   * interactions to also be present.
   */
  const existingDestinationInteractions = Object.entries(
    state.stepAutoCompleteInteractions
  ).reduce((out, [entityId, interaction]) => {
    const { guide: guideEntityId } = interaction;
    const guide = guideSelector(guideEntityId, state);

    if (guide && guide.isDestination) {
      out[entityId] = interaction;
    }

    return out;
  }, {} as Record<StepAutoCompleteInteractionEntityId, StepAutoCompleteInteraction>);

  const {
    entities: { stepAutoCompleteInteractions },
  } = normalize(payload.stepAutoCompleteInteractions, [
    schema.stepAutoCompleteInteraction,
  ]) as NormalizedData;

  state.stepAutoCompleteInteractions = {
    ...existingDestinationInteractions,
    ...stepAutoCompleteInteractions,
  };
}
