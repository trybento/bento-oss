import React, { useMemo, useState } from 'react';
import CtaComponent, {
  CtaComponentProps,
} from 'bento-common/components/CtaComponent';

import {
  EmbedTypenames,
  FullGuide,
  GlobalStateActionPayloads,
  Guide,
  Organization,
  Step,
  StepCtaClickedAction,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { StepCtaType, GuideFormFactor } from 'bento-common/types';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  isAnyPageTargetedGuide,
  isPageTargetedGuide,
  parseCtaColors,
} from 'bento-common/data/helpers';
import { isCompleteStep } from 'bento-common/utils/steps';
import { isTargetPage } from 'bento-common/utils/urls';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import { TransitionDirection } from 'bento-common/types/shoyuUIState';
import { ANNOUNCEMENT_ANIMATION_TIME_TAKEN } from 'bento-common/frontend/constants';

import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { MainStoreState } from '../stores/mainStore/types';
import {
  guideSelector,
  isBranchingCompletedByCtaSelector,
  nextUrlOfFlowSelector,
  siblingStepEntityIdsOfStepSelector,
  stepSelector,
} from '../stores/mainStore/helpers/selectors';
import { getFormFactorFlags } from '../lib/formFactors';
import withSidebarContext from '../hocs/withSidebarContext';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import { handleButtonClickUrl } from '../lib/helpers';
import { UIStateContextValue } from '../providers/UIStateProvider';
import withUIState from '../hocs/withUIState';
import catchException from '../lib/catchException';
import withSessionState from '../stores/sessionStore/withSessionState';
import withFormFactor from '../hocs/withFormFactor';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import useAirTrafficJourney from '../stores/airTrafficStore/hooks/useAirTrafficJourney';
import { recordStepCompletion } from '../stores/mainStore/actions/stepCtaClicked';

export type StepCtaUISettings = Pick<
  CustomUIProviderValue,
  | 'primaryColorHex'
  | 'secondaryColorHex'
  | 'fontColorHex'
  | 'additionalColors'
  | 'featureFlags'
  | 'ctasStyle'
>;

/**
 * Enriches the {@link StepCtaClickedAction} type with the actual signature of each interaction
 * handler needed for the associated action handler since most of those types live in the air traffic
 * or main store.
 */
export type EnrichedStepCtaClickedAction = StepCtaClickedAction<
  ReturnType<typeof useAirTrafficJourney>['lockAirTraffic'],
  ReturnType<typeof useAirTrafficJourney>['unlockAirTraffic'],
  ReturnType<typeof useAirTrafficJourney>['startJourney'],
  ReturnType<typeof useAirTrafficJourney>['endJourney'],
  SidebarProviderValue['setIsSidebarExpanded'],
  SidebarProviderValue['setSidebarOpenForLater']
>;

type BeforeSessionStoreDataProps = CtaComponentProps &
  WithLocationPassedProps &
  Pick<FormFactorContextValue, 'embedFormFactor'> &
  StepCtaUISettings &
  Pick<
    SidebarProviderValue,
    'setIsSidebarExpanded' | 'setSidebarOpenForLater'
  > &
  Pick<UIStateContextValue, 'uiActions'>;

type SessionStoreData = {
  organization: Organization;
};

type BeforeMainStoreDataProps = BeforeSessionStoreDataProps & SessionStoreData;

type MainStoreData = {
  guide: Guide | undefined;
  step: Step | undefined;
  nextStep: Step | undefined;
  nextUrlOfFlow: string | undefined;
  dispatch: MainStoreState['dispatch'];
  isBranchingCompletedByCta: boolean;
  stepEntityIdSiblings: ReturnType<typeof siblingStepEntityIdsOfStepSelector>;
  ctaColors: ReturnType<typeof parseCtaColors>;
};

type StepCtaProps = BeforeMainStoreDataProps & MainStoreData;

export const StepCta: React.FC<StepCtaProps> = ({
  guide,
  step,
  nextStep,
  nextUrlOfFlow,
  dispatch,
  beforeCompletionHandler,
  isBranchingCompletedByCta,
  formFactor,
  ctaColors,
  cta,
  fullWidth,
  strong,
  setIsSidebarExpanded,
  setSidebarOpenForLater,
  appLocation,
  organization,
  ctasStyle,
  uiActions,
  stepEntityIdSiblings,
  canIncomplete,
}) => {
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  const { isTooltip, isBanner, isModal, isFlow, isSidebar } =
    getFormFactorFlags(formFactor);
  const isAnnouncement = isModal || isBanner;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { startJourney, endJourney, lockAirTraffic, unlockAirTraffic } =
    useAirTrafficJourney({
      selectedGuideEntityId: step?.guide,
    });

  /**
   * Handles the completion of the current Step, meant only for compatibility purposes.
   *
   * @todo Support all other CTA types in the below action and remove this handler.
   * @deprecated dispatch a `StepCtaClicked` action instead
   */
  const handleComplete = useCallbackRef(
    ({
      updateCompletionOnServer = true,
      onComplete,
    }: Pick<
      GlobalStateActionPayloads['stepChanged'],
      'updateCompletionOnServer' | 'onComplete'
    > = {}) => {
      if (!guide || !step) return;

      recordStepCompletion(
        {
          guide,
          step,
          cta,
          nextStep,
          organizationDomain: organization.domain,
          currentPageUrl: appLocation.href,
          canIncomplete: Boolean(canIncomplete),
          lockAirTrafficHandler: lockAirTraffic,
          unlockAirTrafficHandler: unlockAirTraffic,
          startJourneyHandler: startJourney,
          endJourneyHandler: endJourney,
          toggleSidebar: setIsSidebarExpanded,
          openSidebarLaterHandler: setSidebarOpenForLater,
          beforeCompletionHandler,
        },
        updateCompletionOnServer,
        onComplete
      );
    },
    [
      guide,
      step,
      cta,
      nextStep,
      organization.domain,
      appLocation.href,
      canIncomplete,
      lockAirTraffic,
      unlockAirTraffic,
      startJourney,
      endJourney,
      setIsSidebarExpanded,
      setSidebarOpenForLater,
      beforeCompletionHandler,
    ]
  );

  const handleCompleteBranching = useCallbackRef(() => {
    dispatch({
      type: 'branchingPathsSubmitted',
      stepEntityId: step?.entityId,
    });
  }, [dispatch, step]);

  const handleSetStepSkipped = useCallbackRef(() => {
    if (!step) return;

    dispatch({
      type: 'stepChanged',
      step: {
        entityId: step.entityId,
        state: StepState.skipped,
        ctaClicked: true,
        ...(cta.entityId ? { ctaEntityId: cta.entityId } : {}),
      },
    });
  }, [dispatch, formFactor, step, cta.entityId]);

  const handleSave = useCallbackRef(() => {
    if (step) {
      /**
       * This locks the air traffic control state during the Modal's animation time with the goal
       * of not short-circuiting it.
       */
      lockAirTraffic('Save-type CTA clicked');

      dispatch({
        type: 'guideSaved',
        guide: step.guide,
      });

      // unlock air traffic state when the animation has finished
      unlockAirTraffic(ANNOUNCEMENT_ANIMATION_TIME_TAKEN);
    }
  }, [step, endJourney]);

  const handleClick = useCallbackRef(() => {
    if (cta.disabled) return;

    // Remove focus from button.
    setTimeout(() => {
      buttonRef?.blur();
    }, 500);

    switch (cta.type) {
      // ----------------
      // Transition types
      // ----------------

      case StepCtaType.next: {
        const target = step?.nextStep || stepEntityIdSiblings.next;
        if (target)
          dispatch({
            type: 'stepSelected',
            formFactor,
            step: target,
          });
        break;
      }

      case StepCtaType.back: {
        const target = step?.previousStep || stepEntityIdSiblings.previous;
        if (target) {
          uiActions.stepTransitionDirectionChanged(TransitionDirection.left);
          dispatch({
            type: 'stepSelected',
            formFactor,
            step: target,
          });
        }
        break;
      }

      // ------------
      // Action types
      // ------------

      /**
       * Handle clicking CTA to complete the Step.
       *
       * If this is a Flow-type guide, then this CTA needs to transition the user to the next Step.
       */
      case StepCtaType.complete: {
        //
        if (isBranchingCompletedByCta) {
          handleCompleteBranching();
          return;
        }

        /**
         * NOTE: Temporarily checking whether this is a flow guide based on the form factor, given the
         * issue on the todo below.
         *
         * @todo isFlow was failing in preview context, need to be fixed
         */
        if (isFlowGuide(formFactor as GuideFormFactor) && nextStep) {
          /**
           * Start a journey from the current Step to the Next, including the before/after page URLs.
           */
          startJourney({
            type: EmbedTypenames.guide,
            startedFromGuide: step?.guide,
            startedFromModule: step?.module,
            startedFromStep: step?.entityId,
            selectedGuide: nextStep.guide,
            selectedModule: nextStep.module,
            selectedStep: nextStep.entityId,
            selectedPageUrl: nextUrlOfFlow,
            endingCriteria: {
              closeSidebar: false,
              navigateAway: true,
            },
          });

          /**
           * Toggle step completion and attempts to redirect the user to the URL of the next Step of the flow.
           *
           * If the redirect failed, we than clean up the journey we just started to prevent
           * leaving the Air Traffic state locked by an "unaccessible" journey.
           */
          handleComplete({
            onComplete: () => {
              if (
                handleButtonClickUrl(nextUrlOfFlow, appLocation.href) === -1
              ) {
                endJourney({ reason: { navigateAway: true } });
              }
            },
          });

          return;
        }

        handleComplete();

        break;
      }

      case StepCtaType.skip:
        handleSetStepSkipped();
        break;

      case StepCtaType.save:
        handleSave();
        break;

      case StepCtaType.urlComplete:
      case StepCtaType.url: {
        dispatch<EnrichedStepCtaClickedAction>({
          type: 'stepCtaClicked',
          stepEntityId: step!.entityId,
          cta,
          organizationDomain: organization.domain,
          currentPageUrl: appLocation.href,
          canIncomplete: Boolean(canIncomplete),
          lockAirTrafficHandler: lockAirTraffic,
          unlockAirTrafficHandler: unlockAirTraffic,
          startJourneyHandler: startJourney,
          endJourneyHandler: endJourney,
          toggleSidebar: setIsSidebarExpanded,
          openSidebarLaterHandler: setSidebarOpenForLater,
          beforeCompletionHandler,
        });

        break;
      }

      case StepCtaType.event: {
        const eventName = cta.eventMessage || cta.settings?.eventName;
        if (eventName) {
          document.dispatchEvent(
            new CustomEvent('bento-buttonClicked', {
              detail: { message: eventName },
            })
          );
          if (cta.collapseSidebar) setIsSidebarExpanded(false);
          if (
            cta.settings?.markComplete &&
            step?.state !== StepState.complete
          ) {
            handleComplete();
          }
        }
        break;
      }

      case StepCtaType.launch: {
        if (!cta.destination || !cta.entityId) {
          catchException(new Error('Unknown CTA or destination'));
          return;
        }

        setIsLoading(true);

        // lock air traffic control until the destination guide is launched
        // to protect against some other guide jumping the line before the flow
        // is started
        lockAirTraffic('Launch-type CTA clicked');

        // dispatch an action to launch the destination
        dispatch({
          type: 'launchCtaClicked',
          stepEntityId: step!.entityId,
          destinationKey: cta.destination.key,
          ctaEntityId: cta.entityId!,
          appLocation: appLocation.href,
          markComplete: !!cta.settings?.markComplete,
          onSuccess: (destinationGuide: FullGuide) => {
            const destinationIs = getFormFactorFlags(
              destinationGuide.formFactor
            );

            if (destinationIs.isSidebar) {
              const destinationIsCurrentPage =
                isAnyPageTargetedGuide(destinationGuide) ||
                (isPageTargetedGuide(destinationGuide) &&
                  isTargetPage(
                    appLocation.href,
                    destinationGuide.pageTargetingUrl
                  ));

              if (destinationIsCurrentPage) {
                setIsSidebarExpanded(true);
              } else {
                setSidebarOpenForLater();
              }
              return;
            }

            // if the destination is not the sidebar,
            // then we must necessarily close it otherwise some form factors
            // (e.g. modals, banners, tooltips) will simply not launch since
            // they are being throttled not to overlap with the sidebar
            setIsSidebarExpanded(false);
          },
          onComplete: () => {
            setIsLoading(false);
            unlockAirTraffic();
          },
        });

        /**
         * The server will automatically handle the actual completion,
         * so we just need to optimistically complete here to make things
         * a little bit snappier for the end-user
         */
        if (
          (isAnnouncement ||
            isTooltip ||
            isFlow ||
            cta.settings?.markComplete) &&
          !isCompleteStep(step?.state)
        ) {
          handleComplete({ updateCompletionOnServer: false });
        }

        break;
      }

      default:
        catchException(new Error(`Unknown CTA type: ${cta.type}`));
    }
  }, [
    step,
    nextStep,
    organization.domain,
    buttonRef,
    isBranchingCompletedByCta,
    cta,
    isAnnouncement,
    isTooltip,
    isFlow,
    isSidebar,
    appLocation.href,
    formFactor,
    uiActions,
    stepEntityIdSiblings,
    canIncomplete,
    handleComplete,
    lockAirTraffic,
    unlockAirTraffic,
    startJourney,
    endJourney,
    setIsSidebarExpanded,
    setSidebarOpenForLater,
    beforeCompletionHandler,
  ]);

  const parentColor = useMemo(
    () =>
      buttonRef?.parentElement
        ? getComputedStyle(buttonRef.parentElement as Element).color
        : undefined,
    [buttonRef]
  );

  if (!cta) return null;

  return (
    <CtaComponent
      ref={setButtonRef}
      formFactor={formFactor}
      cta={cta}
      beforeCompletionHandler={beforeCompletionHandler}
      stepEntityId={step?.entityId}
      fullWidth={fullWidth}
      strong={strong}
      onClick={handleClick}
      parentColor={parentColor}
      ctaColors={ctaColors}
      isLoading={isLoading}
      ctasStyle={ctasStyle}
    />
  );
};

export default composeComponent<Omit<CtaComponentProps, 'ctasStyle'>>([
  withLocation,
  withUIState,
  withFormFactor,
  withCustomUIContext,
  withSidebarContext,
  withSessionState<BeforeSessionStoreDataProps, SessionStoreData>(
    (state): SessionStoreData => ({
      organization: state.organization!,
    })
  ),
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (
      state,
      {
        embedFormFactor,
        stepEntityId,
        cta,
        primaryColorHex,
        secondaryColorHex,
        additionalColors,
        fontColorHex,
      }
    ): MainStoreData => {
      const step = stepSelector(stepEntityId, state);
      const stepEntityIdSiblings = siblingStepEntityIdsOfStepSelector(
        state,
        step?.entityId
      );
      const nextStep = stepSelector(stepEntityIdSiblings.next, state);
      const guide = guideSelector(step?.guide, state);
      const nextUrlOfFlow = isFlowGuide(guide?.formFactor)
        ? nextUrlOfFlowSelector(state, { nextStep: nextStep })
        : undefined;

      return {
        guide,
        step,
        nextStep,
        nextUrlOfFlow,
        dispatch: state.dispatch,
        isBranchingCompletedByCta: isBranchingCompletedByCtaSelector(
          state,
          stepEntityId
        ),
        stepEntityIdSiblings,
        ctaColors: parseCtaColors(
          cta,
          embedFormFactor as any as GuideFormFactor,
          guide?.formFactorStyle,
          {
            primaryColorHex,
            additionalColors,
            secondaryColorHex,
            fontColorHex,
          }
        ),
      };
    }
  ),
])(StepCta);
