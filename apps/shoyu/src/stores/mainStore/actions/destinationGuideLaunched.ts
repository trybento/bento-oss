import { normalize } from 'normalizr';
import {
  EmbedTypenames,
  FullGuide,
  Guide,
  GuideHydrationState,
  Step,
  StepAutoCompleteInteraction,
  StepEntityId,
} from 'bento-common/types/globalShoyuState';
import {
  isAnnouncement,
  isEverboarding,
  getEmbedFormFactorForContextualTagGuide,
  getEmbedFormFactorsForGuide,
  isAnyPageTargetedGuide,
  isPageTargetedGuide,
  isVisualTagTargetedGuide,
} from 'bento-common/data/helpers';
import { isTargetPage } from 'bento-common/utils/urls';
import { isDynamicUrl } from 'bento-common/utils/wildcardUrlHelpers';
import { EmbedFormFactor } from 'bento-common/types';

import schema, { NormalizedGuideData } from '../schema';
import { WorkingState } from '../types';
import { getFormFactorFlags } from '../../../lib/formFactors';
import { extractTargetingDetails, navigateToUrl } from '../../../lib/helpers';
import guideSelected from './guideSelected';
import stepSelected from './stepSelected';
import taggedElementFlagSet from './taggedElementFlagSet';
import {
  firstModuleOfGuideSelector,
  firstStepOfGuideSelector,
  startingTaggedElementOfGuideSelector,
  stepSelector,
} from '../helpers/selectors';
import UnableToRedirectError from '../../../errors/UnableToRedirectError';
import {
  startAirTrafficJourney,
  endAirTrafficJourney,
} from '../../airTrafficStore/helpers/airTraffic.helpers';
import { Journey } from '../../airTrafficStore/types';
import formFactorGuidesUpdated from './formFactorGuidesUpdated';

export type DestinationGuideLaunchedAction = {
  startedFromStepEntityId: StepEntityId;
  guide: Omit<FullGuide, 'steps'>;
  stepAutoCompleteInteractions: StepAutoCompleteInteraction[];
  appLocation: string | undefined;
};

const immediatelySelectGuideOrStep = (
  state: WorkingState,
  /** The guide to be selected */
  guide: Guide,
  /** The step to be selected, if any */
  step?: Step
) => {
  const formFactor = isEverboarding(guide.designType)
    ? getEmbedFormFactorForContextualTagGuide(guide, undefined)
    : getEmbedFormFactorsForGuide(guide, undefined)[0];

  guideSelected(state, {
    guide: guide.entityId,
    formFactor,
    keepExistingSelections: false,
  });

  // if a step is given and matches the guide, select it
  if (step?.guide === guide.entityId) {
    stepSelected(state, {
      step: step.entityId,
      formFactor,
    });
  }
};

/**
 * This method naively checks for the presence of wildcard regexp
 * within the redirect url contents to prevent attempting to
 * redirect to an undetermined page.
 */
export const canRedirect = (
  redirectUrl: string | null | undefined
): boolean => {
  return !!redirectUrl && !isDynamicUrl(redirectUrl);
};

/**
 * NOTE: Regardless of eventual WS messages arriving to update
 * the available guides and tagged elements in response to the destination
 * guide launching, this leverages the synchronous response to immediately
 * ingest the data into the store.
 */
export default function destinationGuideLaunched(
  state: WorkingState,
  {
    appLocation,
    startedFromStepEntityId,
    ...payload
  }: DestinationGuideLaunchedAction
) {
  const {
    result: guideEntityId,
    entities: { guides, modules, steps, taggedElements },
  } = normalize(payload.guide, schema.guide) as NormalizedGuideData;

  const guide = guides[guideEntityId];

  if (guide) {
    state.guides[guideEntityId] = {
      ...(state.guides[guideEntityId] || {}),
      ...guide,
      steps: guide.modules?.flatMap((m) => modules?.[m]?.steps || []),
      hydrationState: GuideHydrationState.hydrated,
    };
  }

  if (modules) {
    for (const moduleEntityId of Object.keys(modules)) {
      state.modules[moduleEntityId] = {
        ...(state.modules[moduleEntityId] || {}),
        ...modules[moduleEntityId],
      };
    }
  }

  if (steps) {
    state.steps = {
      ...state.steps,
      ...steps,
    };
  }

  if (taggedElements) {
    state.taggedElements = {
      ...state.taggedElements,
      ...taggedElements,
    };
  }

  if (payload.stepAutoCompleteInteractions.length > 0) {
    const {
      entities: { stepAutoCompleteInteractions },
    } = normalize(payload.stepAutoCompleteInteractions, [
      schema.stepAutoCompleteInteraction,
    ]);

    state.stepAutoCompleteInteractions = {
      ...state.stepAutoCompleteInteractions,
      ...stepAutoCompleteInteractions,
    };
  }

  const embedFormFactor = getEmbedFormFactorsForGuide(guide, undefined)[0];

  // Update the form factors to make sure the guide will be added there
  formFactorGuidesUpdated(state, {
    formFactorStateKey: embedFormFactor,
    formFactor: embedFormFactor as EmbedFormFactor,
    keepExistingSelections: true,
  });

  const guideIs = getFormFactorFlags(guide.formFactor);
  const isEverboardingGuide = isEverboarding(guide.designType);
  const isAnnouncementGuide = isAnnouncement(guide.designType);
  const isTargetedByVisualTag = isVisualTagTargetedGuide(guide);
  const isTargetedByPage = isPageTargetedGuide(guide);
  const isTargetedToAnyPage = isAnyPageTargetedGuide(guide);
  const firstModule = firstModuleOfGuideSelector(state, guide.entityId);
  const firstStep = firstStepOfGuideSelector(state, guide.entityId);
  const tag = startingTaggedElementOfGuideSelector(state, guideEntityId);

  const { module: startedFromModule, guide: startedFromGuide } = stepSelector(
    startedFromStepEntityId,
    state
  )! || {
    // but an available guides changed event can still happen in the middle and take the guide/module/step out // theoretically the step from which this flow has been started should continue to exist
    guide: undefined,
    module: undefined,
  };

  /** @todo do we need to blocklist inline-only guides? */
  const ownStartJourney = (redirectUrl?: Journey['selectedPageUrl']) => {
    startAirTrafficJourney({
      type: EmbedTypenames.guide,
      startedFromGuide,
      startedFromModule,
      startedFromStep: startedFromStepEntityId,
      startedOnPageUrl: appLocation,
      selectedGuide: guide.entityId,
      // selects the first module, regardless of state
      selectedModule: firstModule?.entityId,
      // selects the first step, regardless of state
      selectedStep: firstStep?.entityId,
      selectedPageUrl: redirectUrl,
      endingCriteria: {
        dismissSelection: true, // always
        closeSidebar: guideIs.isSidebar, // only if guide targets the sidebar
        navigateAway: !!redirectUrl, // only if url is provided
      },
    });

    // preemptively end journey to prevent locking the user into an unachievable state
    return () => endAirTrafficJourney({ reason: { navigateAway: true } });
  };

  // handle contextual and flow guides targeted by visual tag
  if (isEverboardingGuide && isTargetedByVisualTag) {
    if (!tag)
      throw new Error(`Expected contextual guide's visual tag not found`);

    const redirectUrl = tag.wildcardUrl;

    const ownEndJourney = ownStartJourney(redirectUrl);

    if (isTargetPage(appLocation, redirectUrl)) {
      if (guideIs.isSidebar)
        immediatelySelectGuideOrStep(state, guide, firstStep);

      /**
       * Tell the tag to scroll into view if necessary
       * and immediately show up, therefore overriding any user settings
       * for that specific session
       */
      taggedElementFlagSet(state, {
        taggedElementEntityId: tag.entityId,
        scrollIntoView: true,
        forcefullyOpen: true,
      });
      return;
    }

    /**
     * Checks whether we can safely redirect the user to the destination url.
     *
     * WARNING: This will fail for wildcard urls that does NOT match the current page since
     * we can't possibly guess what the URL should be. For cases like that, we should encourage our
     * customers to leverage dynamic attributes.
     */
    if (canRedirect(redirectUrl)) {
      taggedElementFlagSet(state, {
        taggedElementEntityId: tag.entityId,
        scrollIntoView: true,
        forcefullyOpen: true,
      });

      return navigateToUrl(redirectUrl);
    }

    ownEndJourney();
    throw new UnableToRedirectError(redirectUrl);
  }

  // handle contextual guides targeted by page
  if (isEverboardingGuide && isTargetedByPage) {
    const redirectUrl = extractTargetingDetails(guide).url;
    const ownEndJourney = ownStartJourney(redirectUrl);

    if (isTargetPage(appLocation, redirectUrl)) {
      if (guideIs.isSidebar)
        immediatelySelectGuideOrStep(state, guide, firstStep);
      return;
    }

    if (canRedirect(redirectUrl)) {
      startAirTrafficJourney({
        type: EmbedTypenames.guide,
        selectedGuide: guide.entityId,
        selectedModule: firstModule?.entityId,
        selectedStep: firstStep?.entityId,
      });

      // redirects the user
      return navigateToUrl(redirectUrl);
    }

    ownEndJourney();
    throw new UnableToRedirectError(redirectUrl);
  }

  // handle sidebar contextual guides targeted to any page
  if (isEverboardingGuide && guideIs.isSidebar && isTargetedToAnyPage) {
    ownStartJourney();
    immediatelySelectGuideOrStep(state, guide, firstStep);
    return;
  }

  // handle announcements targeted by page
  if (isAnnouncementGuide && isTargetedByPage) {
    const redirectUrl = extractTargetingDetails(guide).url;
    const ownEndJourney = ownStartJourney(redirectUrl);

    if (isTargetPage(appLocation, redirectUrl)) {
      immediatelySelectGuideOrStep(state, guide, firstStep);
      return;
    }

    if (canRedirect(redirectUrl)) {
      return navigateToUrl(redirectUrl);
    }

    ownEndJourney();
    throw new UnableToRedirectError(redirectUrl);
  }

  // handle announcements targeted to any page
  if (isAnnouncementGuide && isTargetedToAnyPage) {
    ownStartJourney();
    immediatelySelectGuideOrStep(state, guide, firstStep);
    return;
  }
}
