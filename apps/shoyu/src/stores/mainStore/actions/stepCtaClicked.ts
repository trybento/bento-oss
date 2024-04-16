import { original } from 'immer';
import {
  getButtonClickUrlTarget,
  noopCbWrapper,
} from 'bento-common/data/helpers';
import { StepCtaType } from 'bento-common/types';
import {
  EmbedTypenames,
  Guide,
  Step,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { debugMessage } from 'bento-common/utils/debugging';
import { isCompleteStep, isIncompleteStep } from 'bento-common/utils/steps';

import { getFormFactorFlags } from '../../../lib/formFactors';
import { handleButtonClickUrl } from '../../../lib/helpers';
import { EnrichedStepCtaClickedAction } from '../../../system/StepCta';
import {
  guideSelector,
  nextUrlOfFlowSelector,
  siblingStepEntityIdsOfStepSelector,
  stepSelector,
} from '../helpers/selectors';
import trackCtaClicked from '../mutators/trackCtaClicked';
import { WorkingState } from '../types';
import mainStore from '..';

export type StepCtaClickedHandlerInput = {
  /** Which guide the clicked CTA belongs to */
  guide: Guide;
  /** Which step the clicked CTA belongs to */
  step: Step;
  /** Which step comes after */
  nextStep: Step | undefined;
} & Omit<EnrichedStepCtaClickedAction, 'type' | 'stepEntityId'>;

export type StepCtaClickedHandlerFn = (
  state: WorkingState,
  input: StepCtaClickedHandlerInput
) => void;

/**
 * Handles the click of a Step CTA, regardless of its type.
 *
 * NOTE: Currently, this only supports Link-type CTAs but should be expanded to support other types
 * in the near future, as we migrate logic from the StepCta (apps/shoyu/src/system/StepCta.tsx) component
 * to this action.
 *
 * WARNING: We currently don't cross-check whether the given CTA belongs to the given Step entity id, therefore
 * the caller should guarantee it.
 */
export default function stepCtaClicked(
  state: WorkingState,
  payload: EnrichedStepCtaClickedAction
) {
  const { stepEntityId, cta, ...commonPayload } = payload;

  const step = stepSelector(stepEntityId, state);
  const guide = guideSelector(step?.guide, state);

  if (!step || !guide || !cta) {
    debugMessage('[StepCtaClicked] Step, Guide or CTA not found, skipping...');
    return;
  }

  const stepEntityIdSiblings = siblingStepEntityIdsOfStepSelector(
    state,
    step?.entityId
  );

  const nextStep = stepSelector(stepEntityIdSiblings.next, state);

  /**
   * WARNING: We need the original objects instead of the Proxies since the input
   * will be fed to `recordStepCompletion` after a callback handler is executed,
   * and the proxies might have been revoked by then.
   */
  const handlerInput: StepCtaClickedHandlerInput = {
    guide: original(guide) as Guide,
    step: original(step) as Step,
    nextStep: nextStep ? (original(nextStep) as Step) : undefined,
    cta,
    ...commonPayload,
  };

  switch (cta.type) {
    case StepCtaType.urlComplete:
    case StepCtaType.url:
      linkTypeCtaClicked(state, handlerInput);
      break;

    default:
      throw new Error(
        `Step CTA clicked handler not implemented for type: ${cta.type}`
      );
  }
}

/**
 * Records the completion of a Step, if necessary.
 *
 * @todo move to a separate file for readability
 */
export const recordStepCompletion = (
  /** Context input */
  input: StepCtaClickedHandlerInput,
  /** Whether to update the completion on the server */
  updateCompletionOnServer: boolean,
  /** Callback fn to be fired after completion is recorded */
  onComplete?: () => void
) => {
  const wrapperFn = input.beforeCompletionHandler || noopCbWrapper;

  wrapperFn(() => {
    /**
     * WARNING: We can't receive the state, otherwise by the time this callback is called
     * the proxy would already be revoked. Therefore, we need to get the state directly
     * from the Store.
     */
    const state = mainStore.getState();

    const {
      guide,
      step,
      cta,
      nextStep,
      canIncomplete,
      endJourneyHandler: endJourney,
    } = input;
    const { isModal, isBanner, isTooltip, isFlow } = getFormFactorFlags(
      guide.formFactor
    );

    const nextCompletionState = isIncompleteStep(step.state)
      ? StepState.complete
      : canIncomplete
      ? StepState.incomplete
      : StepState.complete;

    const nextIsComplete = isCompleteStep(nextCompletionState);

    state.dispatch({
      type: 'stepChanged',
      step: {
        entityId: step.entityId,
        isComplete: nextIsComplete,
        state: nextCompletionState,
        completedAt: nextIsComplete ? new Date() : undefined,
        ctaClicked: true,
        ctaEntityId: cta.entityId,
      },
      updateCompletionOnServer,
      onComplete,
    });

    if (
      isModal ||
      isBanner ||
      isTooltip ||
      // we're in a flow and this was the final step
      (isFlow && !nextStep)
    ) {
      // Tell ATC to end the current journey, if it matches this guide
      endJourney({ reason: { dismissSelection: true } });
    }
  })(); // call immediately
};

/**
 * Handles the case of Link-type CTAs, including those that should mark the step as complete.
 */
export const linkTypeCtaClicked: StepCtaClickedHandlerFn = (state, input) => {
  const {
    guide,
    step,
    nextStep,
    cta,
    organizationDomain,
    currentPageUrl,
    openSidebarLaterHandler: openSidebarLater,
    startJourneyHandler: startJourney,
    endJourneyHandler: endJourney,
    lockAirTrafficHandler: lockAirTraffic,
    unlockAirTrafficHandler: unlockAirTraffic,
  } = input;

  /** Whether the Step is currently marked as complete */
  const isStepComplete = isCompleteStep(step?.state);

  const opensInNewTab =
    cta.settings?.opensInNewTab === undefined
      ? getButtonClickUrlTarget(cta.url, organizationDomain) === '_blank'
      : cta.settings?.opensInNewTab;

  /** Whether this should mark the Step as complete */
  const shouldMarkStepAsComplete = cta.type === StepCtaType.urlComplete;

  const { isModal, isInline, isBanner, isTooltip, isFlow } = getFormFactorFlags(
    guide.formFactor
  );

  /**
   * For Flow-type guides that are opening a link that should also mark the step as complete,
   * we should immediately and always advance the user to the next Step of the flow, if one exists.
   */
  if (isFlow && shouldMarkStepAsComplete && nextStep) {
    // Get the next url of the flow
    const nextUrlOfFlow = nextUrlOfFlowSelector(state, { nextStep });

    // Compare CTA vs Next Step URLs
    const nextStepAndCtaHaveTheSameUrl = cta.url === nextUrlOfFlow;

    /**
     * If the CTA link and the next Step of the flow do not share the same URL, then we
     * tentatively open the CTA link in a new tab without caring if it fails, regardless
     * of whether it was set up to "Open in new tab", otherwise this would compete
     * with advancing the user to the next step.
     */
    if (!nextStepAndCtaHaveTheSameUrl) {
      handleButtonClickUrl(cta.url, undefined, true);
    }

    // Start a new journey from the current to the next step
    startJourney({
      type: EmbedTypenames.guide,
      startedFromGuide: step.guide,
      startedFromModule: step.module,
      startedFromStep: step.entityId,
      selectedGuide: nextStep.guide,
      selectedModule: nextStep.module,
      selectedStep: nextStep.entityId,
      selectedPageUrl: nextUrlOfFlow,
      endingCriteria: {
        closeSidebar: false,
        navigateAway: true,
      },
    });

    // Record the step completion and then redirect to the next Step
    recordStepCompletion(input, true, () => {
      if (handleButtonClickUrl(nextUrlOfFlow, currentPageUrl, false) === -1) {
        // Ends the journey if the redirect fails
        endJourney({ reason: { navigateAway: true } });
      }
    });

    return;
  }

  // Determines whether to handle the URL clicked within the mutation callback
  const withCallbackHandler =
    shouldMarkStepAsComplete && cta.url && !opensInNewTab && !isStepComplete;

  /**
   * For Modals, Banners, Tooltips or for Link-type CTAs that complete the step,
   * we should handle the Step completion so that the user can progress to the next step or
   * eventually complete the guide.
   */
  if (isModal || isBanner || isTooltip || isFlow || shouldMarkStepAsComplete) {
    const onComplete = withCallbackHandler
      ? () => {
          void handleButtonClickUrl(cta.url!, currentPageUrl, opensInNewTab);
        }
      : undefined;

    // Only really redirects after finishing the mutation to prevent interrupting
    // the client-request that should make toggle the Step state in the server
    recordStepCompletion(input, true, onComplete);
  } else if (cta.type === StepCtaType.url && isInline) {
    /* Track clicks for cards that don't complete the step */
    trackCtaClicked({
      stepEntityId: step!.entityId,
      ctaEntityId: cta.entityId,
    });
  }

  if (cta.url) {
    // NOTE: this logic is copied between here and the Button renderer
    // (system/RichTextEditor/SlateContentRenderer/Renderers/Button.tsx)
    // so when modifying this you should also modify that
    // Expand sidebar if button was pressed in the inline embed and href is different.
    if (!cta.collapseSidebar && currentPageUrl !== cta.url && step) {
      /**
       * Additionally, announcements, tooltips and flows shouldn't keep selection
       * or set the sidebar to open since the context wouldn't be the same.
       */
      if (!isModal && !isBanner && !isTooltip && !isFlow) {
        openSidebarLater();

        // Determines which step should be used as reference for persisting the selection,
        // the current step or the next step. For "mark as complete" CTAs we should
        // target the next step but have the current as a fallback since a next step
        // might not even exist.
        const refStep =
          cta.type === StepCtaType.urlComplete ? nextStep || step : step;

        // Locks air traffic state to prevent wrongly ending the journey in case
        // the sidebar had been previously closed due to the `closeSidebar` ending
        // criteria set below
        lockAirTraffic('url/Complete-type CTA clicked');

        // starts the journey and
        startJourney({
          type: EmbedTypenames.guide,
          startedFromGuide: step.guide,
          startedFromModule: step.module,
          startedFromStep: step.entityId,
          // NOTE: the selections below use `refStep` to make sure the user will land
          // in the correct step of the guide
          selectedGuide: refStep.guide,
          selectedModule: refStep.module,
          selectedStep: refStep.entityId,
          selectedPageUrl: cta.url,
          endingCriteria: {
            closeSidebar: true,
            navigateAway: true,
          },
        });
      }
    }

    if (!withCallbackHandler) {
      const pageRedirect = handleButtonClickUrl(
        cta.url,
        currentPageUrl,
        opensInNewTab
      );
      // almost immediately unlocks the air traffic state if we're not redirecting the user
      if ([0, -1].includes(pageRedirect || 9)) unlockAirTraffic(100);
    } else {
      // immediately unlocks the air traffic state
      unlockAirTraffic();
    }
  }
};
