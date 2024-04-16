import { EmbedTypenames, Guide } from 'bento-common/types/globalShoyuState';
import {
  isFinishedGuide,
  isIncompleteGuide,
  isSavedGuide,
} from 'bento-common/data/helpers';
import { isModalGuide } from 'bento-common/utils/formFactor';

import {
  AirTrafficControlCallback,
  AirTrafficControlCallbackReturn,
} from './factory';
import {
  extractTargetingDetails,
  guideTargetingMatches,
} from '../../../../lib/helpers';

/**
 * If we're in an active journey, then we should only show the guide
 * that is selected as part of this flow.
 *
 * WARNING: Shouldn't be used for guides possibly targeted by visual tag.
 */
export const activeJourneyCheck: AirTrafficControlCallback<
  Guide,
  AirTrafficControlCallbackReturn | undefined
> = (_, guide, context) => {
  if (context.activeJourney) {
    // wont match other types of journeys
    if (context.activeJourney.type !== EmbedTypenames.guide) {
      return [
        false,
        false,
        {
          scope: 'different type of journey',
          journeyType: context.activeJourney.type,
        },
      ];
    }

    const belongsToCurrentJourney =
      guide.entityId === context.activeJourney.selectedGuide;

    if (belongsToCurrentJourney) {
      const targetingMatches = guideTargetingMatches(
        guide,
        context.currentPageUrl
      );
      const isFinishedOrSavedModal =
        isModalGuide(guide.formFactor) &&
        (isFinishedGuide(guide) || isSavedGuide(guide));

      return [
        targetingMatches || isFinishedOrSavedModal,
        targetingMatches || isFinishedOrSavedModal,
        {
          scope: 'active journey and targeting',
          belongsToCurrentJourney,
          targeting: extractTargetingDetails(guide),
          targetingMatches,
          isFinishedOrSavedModal,
        },
      ];
    }

    return [false, false, { scope: 'active journey', belongsToCurrentJourney }];
  }
  return undefined;
};

/**
 * NOTE: Completed or saved modals shouldn't ever show up unless they're part of a flow,
 * but that should be handled outside of the below if statement.
 */
export const incompleteOrSavedCheck: AirTrafficControlCallback<
  Guide,
  AirTrafficControlCallbackReturn | null
> = (_, guide) => {
  const isIncomplete = isIncompleteGuide(guide);
  const isSaved = isSavedGuide(guide);

  if (!isIncomplete || isSaved)
    return [
      false,
      false,
      {
        scope: 'incomplete and unsaved',
        isIncomplete,
        isSaved,
      },
    ];

  return null;
};

/**
 * Check if guide is eligible to show on this current page
 */
export const pageTargetingCheck: AirTrafficControlCallback<
  Guide,
  AirTrafficControlCallbackReturn | null
> = (_, guide, context) => {
  const eligible = guideTargetingMatches(guide, context.currentPageUrl);

  if (!eligible) {
    return [
      false,
      false,
      {
        scope: 'targeting',
        targeting: extractTargetingDetails(guide),
      },
    ];
  }

  return null;
};
