import { original } from 'immer';
import { debugMessage } from 'bento-common/utils/debugging';
import { genTraceId } from 'bento-common/utils/trace';
import { EmbedTypenames } from 'bento-common/types/globalShoyuState';
import { AtLeast } from 'bento-common/types';

import {
  JourneyGuideDetails,
  JourneyStartActionPayload,
  JourneySurveyDetails,
  WorkingAirTrafficStore,
} from '../types';

export default function journeyStarted(
  state: WorkingAirTrafficStore,
  { type, endingCriteria, ...overrides }: JourneyStartActionPayload
) {
  const previousJourney = state.activeJourney
    ? original(state.activeJourney)
    : undefined;

  // overrides the active journey with the new one
  switch (type) {
    case EmbedTypenames.guide:
      state.activeJourney = {
        type,
        startedOnPageUrl: window?.location?.href,
        selectedPageUrl: undefined,
        startedFromGuide: undefined,
        startedFromModule: undefined,
        startedFromStep: undefined,
        ...(overrides as AtLeast<JourneyGuideDetails, 'selectedGuide'>),
        endingCriteria: {
          timeElapsed: true,
          dismissSelection: true,
          closeSidebar: false,
          navigateAway: !!overrides.selectedPageUrl,
          ...endingCriteria,
        },
        entityId: genTraceId(),
        startedAt: new Date(),
      };
      break;

    case EmbedTypenames.npsSurvey:
      state.activeJourney = {
        type,
        startedOnPageUrl: window?.location?.href,
        selectedPageUrl: undefined,
        ...(overrides as AtLeast<JourneySurveyDetails, 'selectedSurvey'>),
        endingCriteria: {
          timeElapsed: false,
          dismissSelection: false, // surveys are not affected by this
          closeSidebar: false,
          navigateAway: !!overrides.selectedPageUrl,
          ...endingCriteria,
        },
        entityId: genTraceId(),
        startedAt: new Date(),
      };
      break;

    default:
      throw new Error(`Refused to start journey for unknown type: ${type}`);
  }

  debugMessage('[BENTO] Journey started', {
    previousJourney,
    nextJourney: state.activeJourney,
  });
}
