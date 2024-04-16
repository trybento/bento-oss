import {
  isIncompleteGuide,
  isVisualTagTargetedGuide,
} from 'bento-common/data/helpers';
import { TooltipShowOn, TooltipStyle } from 'bento-common/types';
import { EmbedTypenames, Guide } from 'bento-common/types/globalShoyuState';
import { getVisibleElement } from 'bento-common/utils/dom';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import { isFinishedStep } from 'bento-common/utils/steps';
import { isTargetPage } from 'bento-common/utils/urls';

import {
  extractTargetingDetails,
  guideTargetingMatches,
} from '../../../../lib/helpers';
import { isGuideHydrationFailed } from '../../../mainStore/helpers';
import {
  AirTrafficControlCallbackReturn,
  airTrafficControlFactory,
} from './factory';

/**
 * Handle air traffic control for flow-type guides.
 *
 * WARNING: Based on the code structure currently in place, the order in which we execute checks is important
 * and wrongly moving things can result in unexpected behavior.
 */
export const flowAirTraffic = airTrafficControlFactory<Guide>(
  'flowAirTraffic',
  (acc, guide, context): AirTrafficControlCallbackReturn => {
    if (!isFlowGuide(guide.formFactor)) {
      throw Error(`Expected flow guide but got '${guide.formFactor}'`);
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

    if (guide.isPreview) {
      return [true, true, { scope: 'preview', isPreview: guide.isPreview }];
    }

    /**
     * Currently, a Flow guide can still show up as incomplete if its Step is dismissed,
     * which wont allow the end-user to see it, therefore we should consider it as not incomplete.
     *
     * @todo record flow-type guide as done when step is skipped and rely on its state instead
     */
    const isIncomplete =
      isIncompleteGuide(guide) &&
      !isFinishedStep(context.stepSelector(guide.firstIncompleteStep)?.state);

    /**
     * Un-intrusive Tooltips (aka visual tags) shouldn't ever be throttled,
     * regardless of us being in an active journey or any other scenario.
     *
     * @todo create `isVisualTagTooltip` helper
     */
    if (
      isVisualTagTargetedGuide(guide) &&
      (guide.formFactorStyle as TooltipStyle)?.tooltipShowOn ===
        TooltipShowOn.hover
    ) {
      return [
        isIncomplete, // show only if incomplete
        false, // won't increment counter for un-intrusive tips,
        {
          scope: 'incomplete and un-intrusive',
          isIncomplete,
        },
      ];
    }

    /**
     * If we're in an active journey, then we should ONLY show the Tooltip
     * that is selected as part of this Flow.
     *
     * This also checks to determine if the active journey is of Guide type.
     */
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
      const taggedElement = context.taggedElementOfStepSelector(
        guide.entityId,
        context.activeJourney.selectedStep
      );
      const targetingMatches = isTargetPage(
        context.currentPageUrl,
        taggedElement?.wildcardUrl
      );

      if (!belongsToCurrentJourney || !taggedElement || !targetingMatches) {
        return [
          false,
          false,
          {
            scope: 'active journey and targeting',
            belongsToCurrentJourney,
            targetingMatches,
            tagAvailable: !!taggedElement,
            targeting: extractTargetingDetails(guide),
          },
        ];
      }

      const element = getVisibleElement(taggedElement?.elementSelector);
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
     * Complete flows that aren't part of a journey shouldn't ever show up
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
     * Given we've already confirmed the guide is incomplete, we can assume there will be an incomplete step.
     * We then use the tag associated with the incomplete step to determine whether the tag availability and
     * targeting criteria are satisfied.
     */
    const taggedElement = context.taggedElementOfStepSelector(
      guide.entityId,
      guide.firstIncompleteStep
    );

    if (!taggedElement) {
      return [
        false,
        false,
        {
          scope: 'tag availability',
          taggedElement,
        },
      ];
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

    if (!elementVisible) {
      return [
        false,
        false,
        {
          scope: 'target element visibility',
          // NOTE: Can't pass in the actual ref, otherwise cloneDeep will exceed stack calls
          elementRef: String(element),
          elementSelector: taggedElement.elementSelector,
          elementVisible,
        },
      ];
    }

    /**
     * Unless we've permanently failed to hydrate the guide, we want to hold its space until
     * we're done hydrating so we won't fall through and show other experiences,
     * such as modals, only to remove them later once the flow is loaded.
     */
    const isGuideHydrationNotFailed = !isGuideHydrationFailed(guide);

    return [
      isGuideHydrationNotFailed,
      isGuideHydrationNotFailed,
      {
        scope: 'guide is still hydrating or has already hydrated',
        hydrationState: guide.hydrationState,
      },
    ];
  },
  'tooltipsCounter'
);
