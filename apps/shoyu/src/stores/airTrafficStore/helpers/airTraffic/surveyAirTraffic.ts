import { isIncompleteSurvey } from 'bento-common/data/helpers';
import { EmbedTypenames, NpsSurvey } from 'bento-common/types/globalShoyuState';

import { surveyTargetingMatches } from '../../../../lib/helpers';

import {
  AirTrafficControlCallbackReturn,
  airTrafficControlFactory,
} from './factory';

export const surveyAirTraffic = airTrafficControlFactory<NpsSurvey>(
  'surveyAirTraffic',
  (acc, survey, context): AirTrafficControlCallbackReturn => {
    /**
     * Wont show any visual tags or tooltips in case stealth mode is enabled.
     */
    if (context.stealthMode) {
      return [
        false,
        false,
        { scope: 'stealth mode', stealthMode: context.stealthMode },
      ];
    }

    /**
     * Check
     */

    /**
     * If there is an active journey, then we should ONLY show if this survey is part of it.
     *
     * NOTE:
     */
    if (context.activeJourney) {
      const belongsToCurrentJourney =
        context.activeJourney.type === EmbedTypenames.npsSurvey &&
        context.activeJourney.selectedSurvey === survey.entityId;

      const targetingMatches = surveyTargetingMatches(
        survey,
        context.currentPageUrl
      );

      return [
        belongsToCurrentJourney && targetingMatches,
        belongsToCurrentJourney && targetingMatches,
        {
          scope: 'active journey',
          journeyType: context.activeJourney.type,
          belongsToCurrentJourney,
          targetingMatches,
        },
      ];
    }

    const isIncomplete = isIncompleteSurvey(survey);

    if (!isIncomplete) {
      return [
        false,
        false,
        {
          scope: 'not answered or dismissed',
          isIncomplete,
        },
      ];
    }

    const competingGuides =
      acc.counters.announcementsCounter +
      acc.counters.tooltipsCounter +
      acc.counters.surveysCounter;

    if (competingGuides > 0 || acc.sidebarOpen || acc.sidebarAutoFocused) {
      return [
        false,
        false,
        {
          scope: 'competing guides',
          competingGuides: !!competingGuides,
          sidebarOpen: acc.sidebarOpen,
          sidebarAutoFocused: acc.sidebarAutoFocused,
        },
      ];
    }

    const targetingMatches = surveyTargetingMatches(
      survey,
      context.currentPageUrl
    );

    return [
      targetingMatches,
      targetingMatches,
      {
        scope: 'targeting',
        targetingMatches,
        targeting: {
          type: survey.pageTargeting.type,
          url: survey.pageTargeting.url,
        },
      },
    ];
  },
  'surveysCounter'
);
