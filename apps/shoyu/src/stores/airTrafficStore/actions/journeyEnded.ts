import { original } from 'immer';
import { debugMessage } from 'bento-common/utils/debugging';
import { EmbedTypenames } from 'bento-common/types/globalShoyuState';

import { JourneyEndActionPayload, WorkingAirTrafficStore } from '../types';

/**
 * Ends an air traffic journey.
 *
 * If type/selection is given, it will only end the journey if the active journey matches.
 * This is useful to avoid wrongly ending other journeys.
 *
 * If type/selection is not given, it will end the active journey regardless of type/selection.
 */
export default function journeyEnded(
  state: WorkingAirTrafficStore,
  payload: JourneyEndActionPayload
) {
  const previousJourney = state.activeJourney
    ? original(state.activeJourney)
    : undefined;

  const { type, reason } = payload;

  switch (type) {
    case EmbedTypenames.guide:
      if (
        state.activeJourney?.type === type &&
        state.activeJourney?.selectedGuide === payload.selectedGuide
      ) {
        state.activeJourney = undefined;
      }

      break;

    case EmbedTypenames.npsSurvey:
      if (
        state.activeJourney?.type === type &&
        state.activeJourney?.selectedSurvey === payload.selectedSurvey
      ) {
        state.activeJourney = undefined;
      }
      break;

    // affects all types of journeys, regardless of selection
    case undefined:
      state.activeJourney = undefined;
      break;

    default:
      throw new Error(`Refused to end journey for unknown type: ${type}`);
  }

  debugMessage('[BENTO] Journey ended', {
    previousJourney,
    reason,
  });
}
