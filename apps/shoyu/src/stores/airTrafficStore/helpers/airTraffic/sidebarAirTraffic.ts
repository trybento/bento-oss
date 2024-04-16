import { isPageTargetedGuide, isEverboarding } from 'bento-common/data/helpers';
import { Guide } from 'bento-common/types/globalShoyuState';
import {
  isSidebarGuide,
  isInlineOrSidebarGuide,
} from 'bento-common/utils/formFactor';
import {
  extractTargetingDetails,
  guideTargetingMatches,
} from '../../../../lib/helpers';
import { shouldSidebarAutoOpen } from '../../../../system/airTraffic/airTraffic.helpers';
import { EnrichedDesiredState } from '../../types';
import { activeJourneyCheck } from './airTraffic.helpers';
import {
  AirTrafficControlCallbackReturn,
  airTrafficControlFactory,
} from './factory';

export const sidebarAirTraffic = airTrafficControlFactory<Guide>(
  'sidebarAirTraffic',
  (acc, guide, context): AirTrafficControlCallbackReturn => {
    if (
      !isSidebarGuide(guide.formFactor) &&
      !isInlineOrSidebarGuide(guide.formFactor)
    ) {
      throw Error(`Expected sidebar guide but got '${guide.formFactor}'`);
    }

    /** Enforce rules if we're in an active journey */
    const activeJourneyResult = activeJourneyCheck(acc, guide, context);
    if (activeJourneyResult) return activeJourneyResult;

    /**
     * If this is a sidebar contextual guide targeted by page, we shouldn't allow it to show unless
     * it matches the current page.
     *
     * NOTE: This is important because GuideAndStepTransitions bases its decision to select and open the sidebar for
     * an everboarding guide targeted to the page on this allowance, therefore wrongly allowing this guide to show
     * can cause it to jump the line when we navigate to the targeted page, given there is no guarantee that ATC
     * will run before GuideAndStepTransitions does.
     */
    if (
      // is everboarding
      isEverboarding(guide.designType) &&
      // is page targeted
      isPageTargetedGuide(guide) &&
      // does not match the current page
      !guideTargetingMatches(guide, context.currentPageUrl)
    ) {
      return [
        false,
        false,
        {
          scope: 'contextual guide targeting',
          targeting: extractTargetingDetails(guide),
        },
      ];
    }

    const competingGuides =
      acc.counters.announcementsCounter +
      acc.counters.tooltipsCounter +
      acc.counters.surveysCounter;

    /** Punt showing if other announcements/tt have shown */
    if (competingGuides > 0 || acc.sidebarAutoFocused) {
      return [
        false,
        false,
        {
          scope: 'competing guides',
          competingGuides: !!competingGuides,
        },
      ];
    }

    const stateModifiers: Partial<EnrichedDesiredState> = {};

    /** Check if we want to animate auto-open the sidebar given conditions */
    if (
      /** If it's already auto focused */
      !acc.sidebarAutoFocused &&
      /** If it's already open */
      !acc.sidebarOpen
    ) {
      stateModifiers.sidebarAutoFocused = shouldSidebarAutoOpen({
        guide,
        context,
      });
    }

    return [
      true,
      true,
      {
        scope: 'passed all checks',
      },
      stateModifiers,
    ];
  }
);
