import { Guide } from 'bento-common/types/globalShoyuState';
import { isModalGuide } from 'bento-common/utils/formFactor';

import { hasSeenAnotherModal } from '../../../mainStore/helpers/throttling';
import {
  AirTrafficControlCallbackReturn,
  airTrafficControlFactory,
} from './factory';
import {
  activeJourneyCheck,
  incompleteOrSavedCheck,
  pageTargetingCheck,
} from './airTraffic.helpers';

export const modalAirTraffic = airTrafficControlFactory<Guide>(
  'modalAirTraffic',
  (acc, guide, context): AirTrafficControlCallbackReturn => {
    if (!isModalGuide(guide.formFactor)) {
      throw Error(`Expected modal guide but got '${guide.formFactor}'`);
    }

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

    /**
     * NOTE: Currently, modals can't ever be targeted by visual tag.
     */
    const pageTargetingResults = pageTargetingCheck(acc, guide, context);
    if (pageTargetingResults) return pageTargetingResults;

    /**
     * Check if another modal has already been seen.
     */
    const notSeen = hasSeenAnotherModal(guide.entityId) === false;

    return [
      notSeen,
      notSeen,
      {
        scope: 'has seen another modal',
        hasSeenAnotherModal: !notSeen,
      },
    ];
  },
  'announcementsCounter'
);
