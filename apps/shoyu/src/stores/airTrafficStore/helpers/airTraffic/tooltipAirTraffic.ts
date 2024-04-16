import { isIncompleteGuide, isIntrusiveTag } from 'bento-common/data/helpers';
import {
  EmbedTypenames,
  Guide,
  TaggedElement,
} from 'bento-common/types/globalShoyuState';
import { getVisibleElement } from 'bento-common/utils/dom';
import { isTooltipGuide } from 'bento-common/utils/formFactor';

import {
  extractTargetingDetails,
  guideTargetingMatches,
} from '../../../../lib/helpers';
import {
  AirTrafficControlCallbackReturn,
  airTrafficControlFactory,
} from './factory';

export const tooltipAirTraffic = airTrafficControlFactory<Guide>(
  'tooltipAirTraffic',
  (acc, guide, context): AirTrafficControlCallbackReturn => {
    if (!isTooltipGuide(guide.formFactor)) {
      throw Error(`Expected tooltip guide but got '${guide.formFactor}'`);
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

    const taggedElement: TaggedElement | undefined =
      context.taggedElements[guide.taggedElements?.[0]];

    if (!taggedElement) {
      return [
        false,
        false,
        {
          scope: 'tagged element availability',
          taggedElement,
        },
      ];
    }

    /**
     * Allow preview guides to show up regardless of everything else.
     */
    if (guide.isPreview) {
      const targetingMatches = guideTargetingMatches(
        guide,
        context.currentPageUrl,
        taggedElement
      );

      return [
        targetingMatches,
        false,
        { scope: 'preview', isPreview: guide.isPreview, targetingMatches },
      ];
    }

    const isIncomplete = isIncompleteGuide(guide);
    const isIntrusive = isIntrusiveTag(taggedElement, guide);

    /**
     * If we're in an active journey and the tooltip is intrusive,
     * then we should ONLY show the tooltip that is part of the active journey.
     *
     * NOTE: Un-intrusive Tooltips (aka tooltips that show on hover) should NOT be suppressed for not being
     * part of the active journey.
     */
    if (context.activeJourney && (isIntrusive || !isIncomplete)) {
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
      const targetingMatches = guideTargetingMatches(
        guide,
        context.currentPageUrl,
        taggedElement
      );

      if (!belongsToCurrentJourney || !targetingMatches) {
        return [
          false,
          false,
          {
            scope: 'active journey and targeting',
            belongsToCurrentJourney,
            targeting: extractTargetingDetails(guide),
          },
        ];
      }

      const element = getVisibleElement(taggedElement.elementSelector);
      const elementVisible = !!element;

      return [
        elementVisible,
        elementVisible,
        {
          scope: 'active journey and target element visibility',
          elementVisible,
        },
      ];
    }

    /**
     * Complete tooltips that aren't part of a journey shouldn't ever show up,
     * regardless of being considered intrusive or not.
     */
    if (!isIncomplete) {
      return [
        false,
        false,
        {
          scope: 'incomplete',
          isIncomplete,
        },
      ];
    }

    if (isIntrusive) {
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
    }

    const targetingMatches = guideTargetingMatches(
      guide,
      context.currentPageUrl,
      taggedElement
    );

    if (!targetingMatches) {
      return [
        false,
        false,
        {
          scope: 'targeting',
          targeting: extractTargetingDetails(guide),
          tagWildcardUrl: taggedElement.wildcardUrl,
        },
      ];
    }

    const element = getVisibleElement(taggedElement.elementSelector);
    const elementVisible = !!element;

    return [
      elementVisible,
      isIntrusive, // should only increment counter if intrusive
      {
        scope: 'target element visibility',
        // NOTE: Can't pass in the actual ref, otherwise cloneDeep will exceed stack calls
        elementRef: String(element),
        elementSelector: taggedElement.elementSelector,
        elementVisible,
        isIncomplete,
      },
    ];
  },
  'tooltipsCounter'
);
