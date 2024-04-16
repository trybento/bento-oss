import { isIncompleteGuide, isIntrusiveTag } from 'bento-common/data/helpers';
import { TagVisibility } from 'bento-common/types';
import {
  EmbedTypenames,
  TaggedElement,
} from 'bento-common/types/globalShoyuState';
import { getVisibleElement } from 'bento-common/utils/dom';
import {
  isFlowGuide,
  isSingleStepGuide,
  isTooltipGuide,
} from 'bento-common/utils/formFactor';
import { isIncompleteStep } from 'bento-common/utils/steps';
import {
  extractTargetingDetails,
  guideTargetingMatches,
} from '../../../../lib/helpers';

import {
  AirTrafficContext,
  EnrichedDesiredState,
  EvaluationDetails,
} from '../../types';

export type TagsAirTrafficReturnType = [
  /** Whether the tagged element can show */
  canShow: boolean,
  /** Reason for allowing to show or not show */
  reason: EvaluationDetails
];

/**
 * Filter which tags are allowed to show based on the given guides desired state and the context.
 *
 * NOTE: Tags are not pre-sorted before this gets called, therefore we shouldn't have any logic that assumes that.
 *
 * WARNING: Different than other air traffic handlers implemented through a factory, this can freely mutate the
 * `acc` object (aka `EnrichedDesiredState`).
 */
export const tagsAirTraffic = (
  acc: Readonly<EnrichedDesiredState>,
  tag: Readonly<TaggedElement>,
  context: Readonly<AirTrafficContext>
): TagsAirTrafficReturnType => {
  const { activeJourney, sidebarSelectedStep } = context;
  const { tagVisibility } = context.settings;

  /**
   * Won't show any tags if stealth mode is enabled
   */
  if (context.stealthMode) {
    return [
      false,
      {
        scope: 'stealth mode',
        stealthMode: context.stealthMode,
      },
    ];
  }

  const parentGuide = context.guideSelector(tag.guide);
  const parentStep = context.stepSelector(tag.step);
  const belongsToActiveJourney =
    // an active journey exists
    !!activeJourney &&
    // and active journey is of guide-type
    activeJourney.type === EmbedTypenames.guide &&
    // and tag matches the selected guide
    activeJourney.selectedGuide === tag.guide &&
    // and tag matches the selected step, or is single-step guide (i.e. tooltip)
    (activeJourney.selectedStep === tag.step ||
      isSingleStepGuide(parentGuide?.theme, parentGuide?.formFactor));

  /**
   * Wont show dismissed tags, unless they belong to the active journey.
   *
   * This exception is useful for allowing to re-open Tooltip/Flow-type guides, since the end-user is able to
   * dismiss the guide and then re-open it.
   */
  if (
    // tag is dismissed
    tag.dismissedAt &&
    // tag is not part of the current journey
    !belongsToActiveJourney
  ) {
    return [
      false,
      {
        scope: 'dismissed',
        dismissed: tag.dismissedAt?.toISOString(),
      },
    ];
  }

  const isIncomplete = {
    guide: isIncompleteGuide(parentGuide),
    // whether tag isn't associated with a step or step is incomplete
    step: !tag.step || isIncompleteStep(parentStep?.state),
  };

  /**
   * Allow preview tags to show up regardless of everything else.
   *
   * If tag is associated with a flow-type guide, we then check whether it belongs to the first
   * incomplete step before allowing it to show up.
   *
   * For all other form factors, we simply show.
   */
  if (tag.isPreview) {
    const element = getVisibleElement(tag.elementSelector);
    const elementVisible = !!element;

    if (isFlowGuide(tag.formFactor)) {
      const guideFirstIncompleteStep = context.guideSelector(
        tag.guide
      )?.firstIncompleteStep;
      const belongsToGuideFirstIncompleteStep =
        tag.step === guideFirstIncompleteStep;

      return [
        elementVisible && belongsToGuideFirstIncompleteStep,
        {
          scope: 'preview and associated with first incomplete step',
          isPreview: tag.isPreview,
          guideFirstIncompleteStep,
          belongsToGuideFirstIncompleteStep,
          elementVisible,
        },
      ];
    }

    const targetingMatches = guideTargetingMatches(
      parentGuide,
      context.currentPageUrl,
      tag
    );

    return [
      targetingMatches && elementVisible,
      {
        scope: 'preview',
        isPreview: tag.isPreview,
        targetingMatches,
        elementVisible,
      },
    ];
  }

  if (!parentGuide) {
    return [false, { scope: 'guide availability', parentGuide }];
  }

  /**
   * NOTE: Given we're not providing the guide, we're really only checking
   * whether the tag is of overlay-type, therefore intrusive.
   */
  const isIntrusive = isIntrusiveTag(tag, parentGuide);

  const targetingMatches = guideTargetingMatches(
    parentGuide,
    context.currentPageUrl,
    tag
  );

  if (activeJourney && isIntrusive) {
    // wont match other types of journeys
    if (activeJourney.type !== EmbedTypenames.guide) {
      return [
        false,
        {
          scope: 'different type of journey',
          journeyType: activeJourney.type,
        },
      ];
    }

    const element = getVisibleElement(tag.elementSelector);
    const elementVisible = !!element;

    return [
      belongsToActiveJourney && targetingMatches && elementVisible,
      {
        scope: 'active journey, targeting and target element visibility',
        belongsToActiveJourney,
        targetingMatches,
        // NOTE: Can't pass in the actual ref, otherwise cloneDeep will exceed stack calls
        elementRef: String(element),
        elementSelector: tag.elementSelector,
        elementVisible,
      },
    ];
  }

  /**
   * Wont show tags that belong to finished steps or guides.
   */
  if ((!isIncomplete.guide || !isIncomplete.step) && !belongsToActiveJourney) {
    return [
      false,
      {
        scope: 'incomplete associated guide or step',
        belongsToActiveJourney,
        isIncomplete,
        step: tag.step,
        guide: tag.guide,
      },
    ];
  }

  if (!targetingMatches) {
    return [
      false,
      {
        scope: 'targeting',
        targeting: extractTargetingDetails(parentGuide),
        tagWildcardUrl: tag.wildcardUrl,
      },
    ];
  }

  /**
   * List of guides from the same form factor that are allowed to show up.
   * Useful to determine whether an associated tag can show.
   */
  const guidesToShow = acc.show[EmbedTypenames.guide][tag.formFactor] || [];

  /**
   * If tagged element belongs to a tooltip guide, then it should show if ANY of the following is true:
   *
   * - If tag is considered intrusive, then it should only show if their guide counterpart is
   * allowed to show.
   * - Or if tag is not considered intrusive, then it should always show.
   *
   * NOTE: Given tooltips is a "single-step" form factor, we shouldn't consider the tag visibility settings
   * or need to check for target element visibility.
   */
  if (isTooltipGuide(tag.formFactor)) {
    // We always check for guide allowance to not have to check for element visibility,
    // given tooltipAirTraffic already does it for both intrusive and non-intrusive.
    const isTooltipAllowedToShow = guidesToShow.includes(tag.guide);

    return [
      isTooltipAllowedToShow,
      {
        scope: 'tag associated with tooltip guide',
        isTooltipAllowedToShow,
        isIntrusive,
      },
    ];
  }

  const element = getVisibleElement(tag.elementSelector);
  const elementVisible = !!element;

  /**
   * If tagged element belongs to a flow-type guide, then it should be considered eligible to show if ANY
   * of the following is true:
   *
   * - If tag is considered intrusive, then it should only show if their guide counterpart is allowed to show.
   * - Or if that is not considered intrusive, then it should show always show.
   *
   * Additionally, it MUST match the first incomplete step of the guide — otherwise it shouldn't ever show.
   */
  if (isFlowGuide(tag.formFactor)) {
    const notIntrusiveOrGuideCanShow = isIntrusive
      ? guidesToShow.includes(tag.guide)
      : true;

    if (notIntrusiveOrGuideCanShow) {
      const guideFirstIncompleteStep = context.guideSelector(
        tag.guide
      )?.firstIncompleteStep;
      const belongsToGuideFirstIncompleteStep =
        tag.step === guideFirstIncompleteStep;

      return [
        belongsToGuideFirstIncompleteStep && elementVisible,
        {
          scope: 'tag associated with a flow guide',
          guideFirstIncompleteStep,
          belongsToGuideFirstIncompleteStep,
          isIntrusive,
          elementVisible,
        },
      ];
    }

    return [
      notIntrusiveOrGuideCanShow,
      {
        scope: 'tag associated with a flow guide',
        notIntrusiveOrGuideCanShow,
        isIntrusive,
      },
    ];
  }

  /** @todo check whether this is a multi-step ff before restricting */
  if (tagVisibility === TagVisibility.activeStep) {
    const belongsToActiveStep =
      acc.sidebarOpen &&
      !!sidebarSelectedStep &&
      sidebarSelectedStep === tag.step;

    if (!belongsToActiveStep) {
      return [
        false,
        {
          scope: 'tag visibility',
          tagVisibility,
          sidebarOpen: acc.sidebarOpen,
          sidebarSelectedStep,
        },
      ];
    }
  }

  return [
    elementVisible,
    {
      scope: 'target element visibility',
      // NOTE: Can't pass in the actual ref, otherwise cloneDeep will exceed stack calls
      elementRef: String(element),
      elementSelector: tag.elementSelector,
      elementVisible,
    },
  ];
};
