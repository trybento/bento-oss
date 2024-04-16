import React, { useCallback, useEffect } from 'react';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  EmbedTypenames,
  FormFactorStateKey,
  Guide,
  GuideEntityId,
  InlineEmbed,
  InlineEmbedEntityId,
  Module,
  Step,
  StepEntityId,
} from 'bento-common/types/globalShoyuState';
import usePrevious from 'bento-common/hooks/usePrevious';
import {
  isEverboarding,
  isBranchingStep,
  isFinishedGuide,
  allowedGuideTypesSettings,
  isIncompleteGuide,
  isPageTargetedGuide,
} from 'bento-common/data/helpers';
import {
  SidebarVisibility,
  TransitionDirection,
  View,
} from 'bento-common/types/shoyuUIState';
import {
  ChecklistStyle,
  EmbedFormFactor,
  GuideDesignType,
  Theme,
} from 'bento-common/types';
import {
  isInlineEmbed,
  isInlineOrSidebarGuide,
  isSidebarEmbed,
  isSidebarGuide,
} from 'bento-common/utils/formFactor';
import { debounce } from 'bento-common/utils/lodash';
import {
  isActiveGuidesView,
  isKbArticleView,
  isTicketView,
} from 'bento-common/frontend/shoyuStateHelpers';
import { isSkippedStep } from 'bento-common/utils/steps';

import withMainStoreData from '../stores/mainStore/withMainStore';
import withUIState from '../hocs/withUIState';
import {
  everboardingGuideForPageByEntityIdSelector,
  formFactorSelector,
  guideIsHydratedSelector,
  guideSelector,
  lastBranchingGuideSelector,
  newModuleSelector,
  nextIncompleteStepOfGuideSelector,
  onboardingInlineEmbedSelector,
  selectedGuideForFormFactorSelector,
  selectedModuleForFormFactorSelector,
  selectedStepForFormFactorSelector,
} from '../stores/mainStore/helpers/selectors';
import { MainStoreState } from '../stores/mainStore/types';
import { UIStateContextValue } from '../providers/UIStateProvider';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import withSidebarContext from '../hocs/withSidebarContext';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import { getRenderConfig } from '../lib/guideRenderConfig';
import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { HIDE_STEP_DELAY_MS } from '../constants';
import { detectOnboardingInlineEmbed } from '../stores/mainStore/helpers';
import withAirTrafficState from '../stores/airTrafficStore/withAirTrafficState';
import { AirTrafficStore } from '../stores/airTrafficStore/types';
import { guidesToShowSelector } from '../stores/airTrafficStore/helpers/selectors';
import { extractTargetingDetails } from '../lib/helpers';

type OuterProps = { embedId?: InlineEmbedEntityId };

type BeforeAirTrafficDataProps = OuterProps &
  Pick<CustomUIProviderValue, 'sidebarVisibility'> &
  Pick<UIStateContextValue, 'uiActions' | 'view' | 'stepTransitionDirection'> &
  Pick<
    SidebarProviderValue,
    | 'enableSidebarTransitions'
    | 'disableSidebarTransitions'
    | 'setIsSidebarExpanded'
    | 'isSidebarExpanded'
  > &
  Pick<
    FormFactorContextValue,
    'formFactor' | 'renderedFormFactor' | 'embedFormFactor'
  >;

type AirTrafficData = Pick<
  AirTrafficStore,
  | 'activeJourney'
  | 'startJourney'
  | 'endJourney'
  | 'sidebarOpen'
  | 'sidebarAutoFocused'
> & {
  guidesToShow: GuideEntityId[];
  /** @deprecated not being used, might be removed */
  lockAirTraffic: AirTrafficStore['lock'];
  /** @deprecated not being used, might be removed */
  unlockAirTraffic: AirTrafficStore['unlock'];
};

type BeforeMainStoreDataProps = BeforeAirTrafficDataProps & AirTrafficData;

type MainStoreData = {
  /** Active journey's selected guide, if any */
  activeJourneySelectedGuide: Guide | undefined;
  guide: Guide | undefined;
  lastCYOAGuide: Guide | undefined;
  selectedGuideEntityId: GuideEntityId | undefined;
  module: Module | undefined;
  guideIsHydrated: boolean;
  step: Step | undefined;
  newModule: Module | undefined;
  nextStepToComplete: Step | undefined;
  dispatch: MainStoreState['dispatch'];
  isMainStoreInitialized: boolean;
  everboardingGuideForPage: Guide | undefined;
  onboardingInlineEmbed: InlineEmbed | undefined;
};

type ComponentProps = BeforeMainStoreDataProps & MainStoreData;

export type TransitionLogicData = Omit<
  AirTrafficData,
  'sidebarOpen' | 'sidebarAutoFocused' | 'guidesToShow'
> & {
  everboardingGuideForPage: Guide | undefined;
  prevEverboardingGuideForPage: Guide | undefined;
  activeJourneySelectedGuide: Guide | undefined;
  guide: Guide | undefined;
  lastCYOAGuide: Guide | undefined;
  prevGuide: Guide | undefined;
  nextStepToComplete: Step | undefined;
  prevLastCYOAGuide: Guide | undefined;
  selectedGuideEntityId: GuideEntityId | undefined;
  module: Module | undefined;
  prevModule: Module | undefined;
  step: Step | undefined;
  prevStep: Step | undefined;
  guideIsHydrated: boolean;
  newModule: Module | undefined;
  isMainStoreInitialized: boolean;
  view: View;
  prevView: View | undefined;
  sidebarVisibility: SidebarVisibility | undefined;
  formFactor: FormFactorStateKey;
  embedFormFactor: EmbedFormFactor | undefined;
  renderedFormFactor: EmbedFormFactor | undefined;
  prevRenderedFormFactor: EmbedFormFactor | undefined;
  dispatch: MainStoreState['dispatch'];
  guideWasHydrated: boolean | undefined;
  skipModuleViewIfOnlyOne: boolean;
  isSidebarExpanded: boolean;
  onboardingInlineEmbed: InlineEmbed | undefined;
  selectStep: (stepEntityId: StepEntityId | undefined) => void;
  selectGuide: (
    guideEntityId: GuideEntityId | null | undefined,
    expandSidebar?: boolean
  ) => void;
  uiActions: UIStateContextValue['uiActions'];
  animationDelay: (
    cb: () => void,
    options?: { forced?: boolean; delayMs?: number }
  ) => void;
};

/**
 * Based on the current state of guide/step selections
 *   and the desired state derived from factors such as branching or
 *   page navigation, handle selecting or deselecting steps and guides
 *
 * WARNING: As we navigate between pages, `GuideAndStepTransitions` can
 * run before ATC state is recomputed, effectively allowing this logic
 * to base its decisions on state that is about to become stale.
 */
export function transitionLogic({
  guide,
  lastCYOAGuide,
  selectedGuideEntityId,
  module,
  step,
  guideIsHydrated,
  newModule,
  isMainStoreInitialized,
  view,
  nextStepToComplete,
  prevView,
  formFactor,
  dispatch,
  prevGuide,
  prevLastCYOAGuide,
  prevModule,
  prevStep,
  guideWasHydrated,
  selectStep,
  selectGuide,
  uiActions,
  animationDelay,
  embedFormFactor,
  renderedFormFactor,
  prevRenderedFormFactor,
  sidebarVisibility,
  skipModuleViewIfOnlyOne,
  everboardingGuideForPage,
  prevEverboardingGuideForPage,
  isSidebarExpanded,
  onboardingInlineEmbed,
  activeJourney,
  activeJourneySelectedGuide,
  startJourney,
}: TransitionLogicData) {
  /** Prevent unset form factors from potentially altering other form factors */
  if (!embedFormFactor) return;

  const isInlineRendered = isInlineEmbed(renderedFormFactor!);
  const isEmbeddedInline = isInlineEmbed(embedFormFactor!);
  const isSidebar = isSidebarEmbed(embedFormFactor!);

  const nonGuideView = isTicketView(view) || isKbArticleView(view);
  const viewOpen = isEmbeddedInline || (isSidebarExpanded && isSidebar);

  /** Only run logic if we're dealing with guide content */
  if (nonGuideView && viewOpen) return;

  // Unselect guide if it isn't allowed.
  if (guide && !guide.isPreview) {
    const allowedGuideTypes = allowedGuideTypesSettings(
      sidebarVisibility,
      embedFormFactor
    );

    if (guide.isCyoa && !allowedGuideTypes.cyoa) {
      selectGuide(undefined);
      // suspend other transitions
      return;
    }
  }

  /** Check to prevent selecting the same thing */
  const prevEverboardingIsCurrent =
    everboardingGuideForPage &&
    everboardingGuideForPage.entityId ===
      prevEverboardingGuideForPage?.entityId;

  /** Check to prevent re-selecting the current selection */
  const everboardingIsAlreadySelected =
    everboardingGuideForPage &&
    everboardingGuideForPage.entityId === guide?.entityId;

  /**
   * Selects the correct step of a sidebar guide according to the active journey.
   * This is necessary to make sure we always land the end-user in the correct step according to their
   * active journey after they've clicked a Link-type CTA that also marks the step as completed.
   *
   * @todo unit test
   */
  if (
    isSidebar &&
    activeJourney &&
    activeJourney.type === EmbedTypenames.guide &&
    // matches the current selected guide
    activeJourney.selectedGuide === selectedGuideEntityId &&
    // active journey has a selected step
    activeJourney.selectedStep &&
    // does not match the journey's selected step
    activeJourney.selectedStep !== step?.entityId &&
    // there is no previous guide, meaning we just landed here
    !prevGuide?.entityId
  ) {
    selectStep(activeJourney.selectedStep);
    return;
  }

  /**
   * If Air Traffic has given us an active journey and it matches a guide that can be rendered
   * on the sidebar component, select it.
   *
   * NOTE: In this case we don't care about controlling the sidebar expansion behavior given whoever
   * created the journey is expected to take care of it.
   */
  if (
    // this is the sidebar component
    isSidebar &&
    // there is an active journey
    activeJourney &&
    // active journey is of guide-type
    activeJourney.type === EmbedTypenames.guide &&
    // guide is eligible to the sidebar component
    (isInlineOrSidebarGuide(activeJourneySelectedGuide?.formFactor) ||
      isSidebarGuide(activeJourneySelectedGuide?.formFactor)) &&
    // guide is not yet selected
    selectedGuideEntityId !== activeJourney.selectedGuide
  ) {
    /**
     * Check the inline's presence synchronously to prevent any race condition
     *   auto-opening the sidebar.
     */
    const isInlineEmbedPresent = detectOnboardingInlineEmbed(
      onboardingInlineEmbed
    );

    selectGuide(
      activeJourney.selectedGuide,
      !isInlineEmbedPresent && !activeJourneySelectedGuide?.isViewed
    );
    return;
  }

  /**
   * If we just landed here and there is an everboarding guide page-targeted to the current page,
   * this will either:
   * - start a journey if we're supposed to auto-open the sidebar;
   * - or simply select it leaving the sidebar closed.
   */
  if (
    isSidebar &&
    !activeJourney &&
    everboardingGuideForPage &&
    ((!everboardingIsAlreadySelected && !everboardingGuideForPage.isViewed) ||
      !prevEverboardingIsCurrent)
  ) {
    /**
     * Check the inline's presence synchronously to prevent any race condition
     *   auto-opening the sidebar.
     */
    const isInlineEmbedPresent = detectOnboardingInlineEmbed(
      onboardingInlineEmbed
    );

    /**
     * Wont open the sidebar if inline is present or if the everboarding guide has already been viewed.
     */
    const shouldOpenSidebar =
      !isInlineEmbedPresent && !everboardingGuideForPage.isViewed;

    if (shouldOpenSidebar) {
      startJourney({
        type: EmbedTypenames.guide,
        startedOnPageUrl: window?.location?.href,
        selectedGuide: everboardingGuideForPage.entityId,
        selectedPageUrl: extractTargetingDetails(everboardingGuideForPage).url,
        endingCriteria: {
          closeSidebar: true,
          navigateAway: true,
        },
      });
    }

    selectGuide(everboardingGuideForPage.entityId, shouldOpenSidebar);
    return;
  }

  /**
   * Unselect everboarding guide that targets a different page,
   * but only if guide is not part of an active journey.
   */
  if (
    isSidebar &&
    // a guide is currently selected
    guide &&
    // current guide is not part of active journey
    (!activeJourney ||
      activeJourney?.type !== EmbedTypenames.guide ||
      activeJourney?.selectedGuide !== guide?.entityId) &&
    // current guide is everboarding
    isEverboarding(guide?.designType) &&
    // current guide is page-targeted
    isPageTargetedGuide(guide) &&
    // current guide is not finished
    !isFinishedGuide(guide) &&
    // there is no everboarding guide or is different from current guide
    everboardingGuideForPage?.entityId !== guide?.entityId
  ) {
    selectGuide(undefined, false);
    return;
  }

  if (
    // selected guide changed in some way
    guide?.entityId !== prevGuide?.entityId ||
    (guideIsHydrated && !guideWasHydrated) ||
    prevRenderedFormFactor !== renderedFormFactor
  ) {
    if (guide && !step && (guideIsHydrated || skipModuleViewIfOnlyOne)) {
      selectStep(guide.firstIncompleteStep || guide.steps?.[0]);
    } else if (!guide && !selectedGuideEntityId && !isActiveGuidesView(view)) {
      uiActions.handleShowActiveGuides();
    }
  } else if (
    // step changed in some way and it's still in the current guide
    step &&
    (!module ||
      module.entityId !== step?.module ||
      !prevStep ||
      prevStep.entityId !== step.entityId) &&
    step.guide === guide?.entityId
  ) {
    dispatch({ type: 'stepSelected', formFactor, step: step.entityId });
  } else if (
    // the inline requires having a step selected
    module?.entityId !== prevModule?.entityId &&
    module &&
    (!step || !module.steps?.includes(step.entityId)) &&
    isEmbeddedInline
  ) {
    selectStep(module.firstIncompleteStep || module.steps?.[0]);
  } else if (
    // Module branching (new module added)
    newModule &&
    step?.isComplete
  ) {
    animationDelay(() => {
      dispatch({
        type: 'stepSelected',
        formFactor,
        step: newModule.firstIncompleteStep || newModule.steps?.[0],
      });
    });
  } else if (
    // the guide was finished (either fully complete or has some skipped steps)
    guide?.entityId === prevGuide?.entityId &&
    guide?.designType === GuideDesignType.onboarding &&
    ((isFinishedGuide(guide) && isIncompleteGuide(prevGuide)) ||
      (guide.isComplete && !prevGuide?.isComplete && prevGuide?.isDone) ||
      (guide?.nextGuide && !prevGuide?.nextGuide))
  ) {
    if (isBranchingStep(step?.stepType)) {
      // Branching guide
      selectGuide(guide.nextGuide);
    } else if (isFinishedGuide(guide)) {
      uiActions.showSuccessChanged(true);
      // normal guide completion
      animationDelay(
        () => {
          // select the next guide, if one exists
          if (guide.nextGuide) {
            // immediately hide the success banner before selecting the next guide
            // to protect against showing it at the same time the current guide is going away
            // since this can create a poor rendering/animation experience for users
            // with limited CPU/GPU resources.
            uiActions.showSuccessChanged(false);
            selectGuide(guide.nextGuide);
            return;
          }
          // show active guides
          uiActions.handleShowActiveGuides();
        },
        { forced: true }
      );
    }
  } else if (
    // step was completed or skipped
    step?.entityId === prevStep?.entityId &&
    ((step?.isComplete && !prevStep?.isComplete) ||
      (isSkippedStep(step?.state) && !isSkippedStep(prevStep?.state)))
  ) {
    const hideCompletedStepsEnabled = !!(
      (guide?.formFactorStyle as ChecklistStyle)?.hideCompletedSteps &&
      nextStepToComplete
    );

    animationDelay(
      () => {
        if (hideCompletedStepsEnabled) {
          /** Newly completed step is to be hidden; move to next */
          dispatch({
            type: 'stepSelected',
            formFactor,
            step: nextStepToComplete.entityId,
          });
        } else if (step?.nextStep) {
          // there are still more steps in the guide
          dispatch({
            type: 'stepSelected',
            formFactor,
            step: step.nextStep,
          });
        } else if (module?.nextModule) {
          // no more steps in the current module (or the next step isn't defined
          // on the current step) but there are more modules in the guide
          dispatch({
            type: 'moduleSelected',
            formFactor,
            module: module.nextModule,
          });
        } else if (
          guide?.firstIncompleteStep &&
          guide.firstIncompleteStep !== step?.entityId
        ) {
          // the user has reached the end of the guide but there are still
          // incomplete steps
          dispatch({
            type: 'stepSelected',
            formFactor,
            step: guide.firstIncompleteStep,
          });
        } else {
          /** No steps to transition to; all completed */
          uiActions.handleShowActiveGuides();
        }
      },
      {
        forced: hideCompletedStepsEnabled,
        delayMs: hideCompletedStepsEnabled ? HIDE_STEP_DELAY_MS : undefined,
      }
    );
  } else if (
    // view changed to completed or active guides
    // NOTE: when opening the sidebar by clicking the saved or everboarding
    // guides icons (and maybe some other cases) there may already be a guide
    // selected but to keep the state changes consistent and allow selecting
    // the previously selected guide, it needs to be deselected
    isActiveGuidesView(view) &&
    prevView !== view &&
    guide &&
    prevGuide
  ) {
    selectGuide(undefined);
  } else if (
    // no guide selected
    !guide &&
    !isActiveGuidesView(view) &&
    isMainStoreInitialized
  ) {
    uiActions.viewChanged(View.activeGuides);
  } else if (
    // Serial CYOA in 'available guides'
    !guide &&
    prevLastCYOAGuide &&
    lastCYOAGuide?.nextGuide &&
    prevLastCYOAGuide.nextGuide !== lastCYOAGuide.nextGuide
  ) {
    // Branching guide from serial CYOA
    selectGuide(lastCYOAGuide.nextGuide);
  } else if (guide?.isPreview && step) {
    // If this is a preview guide the step transitions aren't enabled like
    // normal so this forces them to be enabled as if it were a normal guide
    selectStep(step.entityId);
  }

  /**
   * Handle step change transitions, or if no step is selected,
   *   return to a higher-level view.
   */
  if (step?.entityId !== prevStep?.entityId) {
    if (!step) {
      if (guide?.modules?.length === 1 && skipModuleViewIfOnlyOne) {
        uiActions.viewChanged(View.activeGuides);
      } else if (!isInlineRendered) {
        // also handles going back in the Compact layout
        uiActions.viewChanged(View.guide);
      }
    } else if (step) {
      uiActions.viewChanged(View.step);
      uiActions.showSuccessChanged(false);
    }
  }
}

const GuideAndStepTransitions: React.FC<
  React.PropsWithChildren<ComponentProps>
> = ({
  guide,
  lastCYOAGuide,
  selectedGuideEntityId,
  module,
  step,
  guideIsHydrated,
  newModule,
  sidebarVisibility,
  nextStepToComplete,
  formFactor,
  embedFormFactor,
  renderedFormFactor,
  isMainStoreInitialized,
  view,
  stepTransitionDirection,
  isSidebarExpanded,
  everboardingGuideForPage,
  onboardingInlineEmbed,
  sidebarAutoFocused,
  sidebarOpen,
  activeJourney,
  activeJourneySelectedGuide,
  uiActions,
  startJourney,
  endJourney,
  lockAirTraffic,
  unlockAirTraffic,
  dispatch,
  disableSidebarTransitions,
  enableSidebarTransitions,
  setIsSidebarExpanded,
  children,
}) => {
  const { skipModuleViewIfOnlyOne = false, showSuccessOnStepComplete } =
    getRenderConfig({
      stepType: step?.stepType,
      theme: guide?.theme || Theme.nested,
      embedFormFactor,
      renderedFormFactor,
      isCyoaGuide: guide?.isCyoa,
      view,
    });

  const prevGuide = usePrevious(embedFormFactor && guide);
  const prevLastCYOAGuide = usePrevious(embedFormFactor && lastCYOAGuide);
  const guideWasHydrated = usePrevious(embedFormFactor && guideIsHydrated);
  const prevModule = usePrevious(embedFormFactor && module);
  const prevStep = usePrevious(embedFormFactor && step);
  const prevView = usePrevious(embedFormFactor && view);
  const prevRenderedFormFactor = usePrevious(
    embedFormFactor && renderedFormFactor
  );
  const prevEverboardingGuideForPage = usePrevious(
    embedFormFactor && everboardingGuideForPage
  );

  /**
   * Delay actions in order to account for certain animations
   */
  const animationDelay = useCallback(
    (
      cb: () => void,
      { forced, delayMs }: { forced?: boolean; delayMs?: number } = {}
    ) =>
      showSuccessOnStepComplete || forced
        ? setTimeout(cb, delayMs ?? 2000)
        : cb(),
    [guide, showSuccessOnStepComplete]
  );

  const enableTransitions = useCallbackRef(
    debounce(() => enableSidebarTransitions(), 500),
    [enableSidebarTransitions]
  );

  const selectStep = useCallback(
    (stepEntityId: StepEntityId | undefined) => {
      disableSidebarTransitions();
      dispatch({
        type: 'stepSelected',
        formFactor,
        step: stepEntityId,
      });
      enableTransitions();
    },
    [formFactor, disableSidebarTransitions, enableTransitions]
  );

  const selectGuide = useCallback(
    (
      guideEntityId: GuideEntityId | null | undefined,
      expandSidebar?: boolean
    ) => {
      dispatch({ type: 'guideSelected', guide: guideEntityId, formFactor });
      /** If already open, or ATC is already attempting to open the sidebar, punt */
      if (expandSidebar && !isSidebarExpanded && !sidebarAutoFocused) {
        setIsSidebarExpanded(true);
      }
    },
    [formFactor, isSidebarExpanded, sidebarAutoFocused]
  );

  useEffect(
    () =>
      transitionLogic({
        animationDelay,
        dispatch,
        embedFormFactor,
        everboardingGuideForPage,
        formFactor,
        guide,
        guideIsHydrated,
        guideWasHydrated,
        isMainStoreInitialized,
        lastCYOAGuide,
        module,
        newModule,
        nextStepToComplete,
        prevEverboardingGuideForPage,
        prevGuide,
        prevLastCYOAGuide,
        prevModule,
        prevRenderedFormFactor,
        prevStep,
        prevView,
        renderedFormFactor,
        selectedGuideEntityId,
        selectGuide,
        selectStep,
        sidebarVisibility,
        skipModuleViewIfOnlyOne,
        step,
        uiActions,
        view,
        isSidebarExpanded,
        onboardingInlineEmbed,
        startJourney,
        endJourney,
        lockAirTraffic,
        unlockAirTraffic,
        activeJourney,
        activeJourneySelectedGuide,
      }),
    [
      animationDelay,
      embedFormFactor,
      everboardingGuideForPage,
      formFactor,
      guide,
      guideIsHydrated,
      isMainStoreInitialized,
      lastCYOAGuide,
      module,
      newModule,
      nextStepToComplete,
      renderedFormFactor,
      selectedGuideEntityId,
      selectGuide,
      selectStep,
      sidebarVisibility,
      skipModuleViewIfOnlyOne,
      step,
      view,
      onboardingInlineEmbed,
      sidebarAutoFocused,
      sidebarOpen,
      activeJourney,
      activeJourneySelectedGuide,
    ]
  );

  useEffect(() => {
    if (stepTransitionDirection !== TransitionDirection.right) {
      setTimeout(() => {
        uiActions.stepTransitionDirectionChanged(TransitionDirection.right);
      }, 500);
    }
  }, [stepTransitionDirection]);

  return <>{children}</>;
};

export default composeComponent<React.PropsWithChildren<OuterProps>>([
  withFormFactor,
  withUIState,
  withCustomUIContext,
  withSidebarContext,
  withAirTrafficState<BeforeAirTrafficDataProps, AirTrafficData>(
    (state, { embedFormFactor }): AirTrafficData => ({
      startJourney: state.startJourney,
      endJourney: state.endJourney,
      lockAirTraffic: state.lock,
      unlockAirTraffic: state.unlock,
      guidesToShow: guidesToShowSelector(state, embedFormFactor),
      activeJourney: state.activeJourney,
      sidebarAutoFocused: state.sidebarAutoFocused,
      sidebarOpen: state.sidebarOpen,
    })
  ),
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { formFactor, guidesToShow, activeJourney }): MainStoreData => {
      const guide = selectedGuideForFormFactorSelector(state, formFactor);

      const activeJourneySelectedGuide =
        activeJourney?.type === EmbedTypenames.guide
          ? guideSelector(activeJourney.selectedGuide, state)
          : undefined;

      const lastBranchingGuide = lastBranchingGuideSelector(state, formFactor);
      const lastCYOAGuide = lastBranchingGuide?.isCyoa
        ? lastBranchingGuide
        : undefined;

      return {
        activeJourneySelectedGuide,
        guide,
        lastCYOAGuide,
        selectedGuideEntityId: formFactorSelector(state, formFactor)
          ?.selectedGuide,
        module: selectedModuleForFormFactorSelector(state, formFactor),
        step: selectedStepForFormFactorSelector(state, formFactor),
        guideIsHydrated: guideIsHydratedSelector(state, guide?.entityId),
        newModule: newModuleSelector(state, formFactor),
        nextStepToComplete: nextIncompleteStepOfGuideSelector(
          state,
          formFactor
        ),
        dispatch: state.dispatch,
        isMainStoreInitialized: !!state.initialized,
        /**
         * WARNING: We now select based on ATC allowance to prevent a disconnect between GuideAndStepTransitions
         * and ATC, which could cause GSP to not properly select the everboarding guide targeted to the page.
         */
        everboardingGuideForPage: everboardingGuideForPageByEntityIdSelector(
          state,
          guidesToShow
        ),
        onboardingInlineEmbed: onboardingInlineEmbedSelector(state),
      };
    }
  ),
])(GuideAndStepTransitions);
