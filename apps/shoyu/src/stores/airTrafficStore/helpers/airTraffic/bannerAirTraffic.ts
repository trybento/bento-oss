import { Guide } from 'bento-common/types/globalShoyuState';
import { isBannerGuide } from 'bento-common/utils/formFactor';

import {
  AirTrafficControlCallbackReturn,
  airTrafficControlFactory,
} from './factory';
import {
  activeJourneyCheck,
  incompleteOrSavedCheck,
  pageTargetingCheck,
} from './airTraffic.helpers';

export const bannerAirTraffic = airTrafficControlFactory<Guide>(
  'bannerAirTraffic',
  (acc, guide, context): AirTrafficControlCallbackReturn => {
    if (!isBannerGuide(guide.formFactor))
      throw Error(`Expected modal guide but got '${guide.formFactor}'`);

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

    /** Enforce rules if we're in an active journey */
    const activeJourneyResult = activeJourneyCheck(acc, guide, context);
    if (activeJourneyResult) return activeJourneyResult;

    /** Enforce rules on completion/save state */
    const incompleteOrSavedResult = incompleteOrSavedCheck(acc, guide, context);
    if (incompleteOrSavedResult) return incompleteOrSavedResult;

    /**
     * Currently we always return all preview guides, but wont increment the counters for them.
     *
     * NOTE: If we decide to more gracefully handle preview cases in the future, then we would have to fully
     * separate the air traffic control state between Live vs Preview content.
     */
    if (guide.isPreview) {
      return [
        true,
        false,
        {
          scope: 'preview',
          isPreview: guide.isPreview,
        },
      ];
    }

    const competingGuides =
      acc.counters.announcementsCounter +
      acc.counters.tooltipsCounter +
      acc.counters.surveysCounter;

    /** Punt showing if other announcements/tt have shown */
    if (competingGuides > 0 || acc.sidebarOpen || acc.sidebarAutoFocused) {
      return [
        false,
        false,
        {
          scope: 'competing guides',
          competingGuides: !!competingGuides,
        },
      ];
    }

    /**
     * NOTE: Currently, banners can't ever be targeted by visual tag.
     */
    const pageTargetingResults = pageTargetingCheck(acc, guide, context);
    if (pageTargetingResults) return pageTargetingResults;

    return [
      true,
      true,
      {
        scope: 'passed all checks',
      },
    ];
  },
  'announcementsCounter'
);
