import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import shallow from 'zustand/shallow';
import mobile from 'is-mobile';
import useDomObserver from 'bento-common/hooks/useDomObserver';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  EmbedTypenames,
  Guide,
  InlineEmbed,
  NpsSurvey,
  TaggedElement,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';
import { EmbedFormFactor, GuideFormFactor } from 'bento-common/types';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import {
  cloneDeep,
  debounce,
  keyBy,
  pick,
  throttle,
} from 'bento-common/utils/lodash';
import { debugMessage } from 'bento-common/utils/debugging';
import { isTargetPage } from 'bento-common/utils/urls';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import { ResponsiveVisibilityBehavior } from 'bento-common/types/shoyuUIState';
import { SidebarAvailability } from 'bento-common/types/shoyuUIState';
import { usePreviousValue } from 'bento-common/hooks/usePrevious';

import withMainStoreData from './stores/mainStore/withMainStore';
import {
  allGuidesSelector,
  allNpsSurveysSelector,
  allTaggedElementsSelector,
  formFactorSelector,
  guideSelector,
  onboardingInlineEmbedSelector,
  stepSelector,
  taggedElementOfStepSelector,
} from './stores/mainStore/helpers/selectors';
import {
  AirTrafficAwareSettings,
  AirTrafficContext,
  AirTrafficControlInput,
  AirTrafficState,
  AirTrafficStore,
  DesiredState,
  EnrichedDesiredState,
  ShouldEndJourneyDecision,
  ShouldEndJourneyInput,
} from './stores/airTrafficStore/types';
import withAirTrafficState from './stores/airTrafficStore/withAirTrafficState';
import {
  activeJourneySelector,
  guidesShownSelector,
} from './stores/airTrafficStore/helpers/selectors';
import { isDebugEnabled } from './lib/debug';
import {
  detectOnboardingInlineEmbed,
  sortByOrderIndexAsc,
} from './stores/mainStore/helpers';
import withSidebarState from './stores/sidebarStore/withSidebarState';
import { SidebarState } from './stores/sidebarStore/types';
import { MAIN_SIDEBAR_STATE_ID } from './stores/sidebarStore/constants';
import { tooltipAirTraffic } from './stores/airTrafficStore/helpers/airTraffic/tooltipAirTraffic';
import { modalAirTraffic } from './stores/airTrafficStore/helpers/airTraffic/modalAirTraffic';
import { surveyAirTraffic } from './stores/airTrafficStore/helpers/airTraffic/surveyAirTraffic';
import { bannerAirTraffic } from './stores/airTrafficStore/helpers/airTraffic/bannerAirTraffic';
import { sidebarAirTraffic } from './stores/airTrafficStore/helpers/airTraffic/sidebarAirTraffic';
import { flowAirTraffic } from './stores/airTrafficStore/helpers/airTraffic/flowAirTraffic';
import { tagsAirTraffic } from './stores/airTrafficStore/helpers/airTraffic/tagsAirTraffic';
import useSessionStore from './stores/sessionStore/hooks/useSessionStore';
import {
  ATC_FAILED_JOURNEY_TIMEOUT,
  ATC_UNLOCK_TIMEOUT,
  STEALTH_MODE_BREAKPOINTS,
} from './constants';
import { MainStoreState } from './stores/mainStore/types';
import getFeatureFlags from './lib/featureFlags';

type OuterProps = {};

/**
 * All the props available right before appending data from the SidebarStore.
 */
type BeforeSidebarStoreDataProps = OuterProps & WithLocationPassedProps;

/**
 * Props returned from the AirTraffic store.
 */
type SidebarStoreData = Pick<SidebarState, 'toggledOffAtLeastOnce'> & {
  sidebarOpen: SidebarState['open'];
};

/**
 * All the props available right before appending data from the AirTrafficStore.
 */
type BeforeAirTrafficStoreDataProps = BeforeSidebarStoreDataProps &
  SidebarStoreData;

/**
 * Props returned from the AirTraffic store.
 */
type AirTrafficStoreData = Pick<AirTrafficControlInput, 'activeJourney'> & {
  /** Action to push up new desired state */
  pushDesiredState: AirTrafficStore['pushDesiredState'];
  /** Action to end any active journey */
  endJourney: AirTrafficStore['endJourney'];
  /** Action to toggle stealth mode */
  toggleStealthMode: AirTrafficStore['toggleStealthMode'];
  /** Action to unlock air traffic state */
  unlock: AirTrafficStore['unlock'];
  /** List of guides currently being shown */
  guidesShown: AirTrafficState['guidesShown'];
  /** Whether stealth mode is enabled */
  stealthMode: AirTrafficState['stealthMode'];
  /** Whether air traffic control is locked */
  locked: Exclude<AirTrafficState['locked'], undefined>;
  /** Whether air traffic control is locked */
  lockedReason: AirTrafficState['lockedReason'];
};

/**
 * All the props available right before appending data from the MainStore.
 */
type BeforeMainStoreDataProps = OuterProps &
  WithLocationPassedProps &
  AirTrafficStoreData;

/**
 * Props returned from the MainStore.
 */
type MainStoreData = Pick<
  AirTrafficControlInput,
  'initialized' | 'sidebarSelectedStep'
> &
  Pick<ShouldEndJourneyInput, 'activeJourneySelectedGuide' | 'guidesShown'> & {
    /** Guide objects available */
    guidesAvailable: Guide[];
    /** Survey objects available */
    npsSurveysAvailable: NpsSurvey[];
    /** Tag objects available */
    tagsAvailable: TaggedElement[];
    /** Onboarding inline embed available */
    onboardingInlineEmbed: InlineEmbed | undefined;
    /** Main store state getter */
    mainStoreStateGetter: () => MainStoreState;
  };

/**
 * All the composed props that will ultimately be passed down to the actual components.
 */
type ComposedProps = BeforeAirTrafficStoreDataProps &
  Omit<BeforeMainStoreDataProps, 'guidesShown'> &
  MainStoreData;

export const initialStateVisibilityIndicators: DesiredState['show' | 'hide'] = {
  [EmbedTypenames.guide]: {},
  [EmbedTypenames.npsSurvey]: {},
};

export const initialState: DesiredState = {
  sidebarOpen: false,
  sidebarAutoFocused: false,
  show: initialStateVisibilityIndicators,
  hide: initialStateVisibilityIndicators,
  tags: [],
};

const guideAirTrafficMapper: {
  [key in Exclude<GuideFormFactor, GuideFormFactor.inline>]: (
    acc: EnrichedDesiredState,
    item: Guide,
    context: AirTrafficContext
  ) => EnrichedDesiredState;
} = {
  [GuideFormFactor.modal]: modalAirTraffic,
  [GuideFormFactor.tooltip]: tooltipAirTraffic,
  [GuideFormFactor.banner]: bannerAirTraffic,
  [GuideFormFactor.flow]: flowAirTraffic,
  [GuideFormFactor.legacy]: sidebarAirTraffic,
  [GuideFormFactor.sidebar]: sidebarAirTraffic,
};

/**
 * Compute ATC state given various inputs
 */
export const airTrafficControl = (
  input: AirTrafficControlInput
): DesiredState => {
  // console.debug('[airTrafficControl] called with', input);

  const { initialized, contentAvailable, sidebarOpen, ...context } = input;

  /** if we haven't initialized or no content is available */
  if (!initialized || !contentAvailable.length) {
    return initialState;
  }

  let enrichedDesiredState = contentAvailable.reduce<EnrichedDesiredState>(
    (acc, item) => {
      let handler:
        | ((
            acc: EnrichedDesiredState,
            item: any,
            context: AirTrafficContext
          ) => EnrichedDesiredState)
        | undefined;

      switch (item.__typename) {
        case EmbedTypenames.guide:
          handler = guideAirTrafficMapper[item.formFactor];
          break;

        case EmbedTypenames.npsSurvey:
          handler = surveyAirTraffic;
          break;

        default:
          if (isDebugEnabled()) {
            // eslint-disable-next-line no-console
            console.error(
              '[BENTO] [airTrafficControl] needs implementation for __typename:',
              (item as any).__typename || 'unknown'
            );
          }
      }

      if (handler) return handler(acc, item, context);

      return acc;
    },
    {
      /**
       * NOTE: We're using cloneDeep instead of the spread operator to avoid having `tags`
       * to not be an extensible object down the road. Not entirely sure why it was happening
       * in specific cases but using cloneDeep seems to fix it.
       */
      ...cloneDeep(initialState),
      sidebarOpen,
      sidebarAutoFocused: false,
      counters: {
        announcementsCounter: 0,
        tooltipsCounter: 0,
        surveysCounter: 0,
      },
      logs: [],
      tagLogs: [],
    }
  );

  /**
   * Here we filter down the list of tagged elements based on the guides that will be shown.
   *
   * What we will do:
   *
   * - Check the TagVisibility setting alongside
   * - Cross-check that with the current sidebar selection (guide/module/step)
   * - Narrow down the list of tags allowed to show up to the step level
   *
   * @todo compute tagged elements list
   */

  enrichedDesiredState = Object.values(
    input.taggedElements
  ).reduce<EnrichedDesiredState>((acc, item) => {
    const [canShow, reason] = tagsAirTraffic(acc, item, context);

    if (canShow) {
      acc.tags.push(item.entityId);
    }

    // push logs
    acc.tagLogs.push({
      outcome: canShow ? 'canShow' : 'cannotShow',
      details: {
        handler: 'tagsAirTraffic',
        entityId: item.entityId,
        reason,
      },
    });

    return acc;
  }, enrichedDesiredState);

  debugMessage(
    '[BENTO] [airTrafficControl] enriched desired state computed',
    enrichedDesiredState
  );

  return pick(enrichedDesiredState, [
    'sidebarOpen',
    'sidebarAutoFocused',
    'show',
    'hide',
    'tags',
  ]);
};

export const shouldEndJourney = (
  input: ShouldEndJourneyInput
): ShouldEndJourneyDecision => {
  // console.debug('[shouldEndJourney] called with', input);

  const {
    initializedAt,
    activeJourney,
    activeJourneySelectedGuide,
    currentPageUrl,
    guidesShown,
    sidebarOpen,
    prevSidebarOpen,
  } = input;

  if (!activeJourney) return [false, undefined];

  // ends journey if sidebar gets closed
  if (
    // close sidebar criteria was set
    activeJourney.endingCriteria.closeSidebar &&
    // sidebar was previously open
    !!prevSidebarOpen &&
    // sidebar is currently closed
    !sidebarOpen
  ) {
    return [true, { closeSidebar: true }];
  }

  // ends journey if guide is missing
  if (
    // active journey is of guide-type
    activeJourney.type === EmbedTypenames.guide &&
    // dismiss selection criteria was set
    activeJourney.endingCriteria.dismissSelection &&
    // the selected guide is missing
    !activeJourneySelectedGuide
  ) {
    return [true, { dismissSelection: true }];
  }

  // ends journey after navigating away
  if (
    // navigates away criteria was set
    activeJourney.endingCriteria.navigateAway &&
    // we can tell which URL we're targeting
    activeJourney.selectedPageUrl &&
    // this isn't the page where the journey started
    !isTargetPage(currentPageUrl, activeJourney.startedOnPageUrl) &&
    // this isn't the target page
    !isTargetPage(currentPageUrl, activeJourney.selectedPageUrl) &&
    // active journey is not of guide-type
    (activeJourney.type !== EmbedTypenames.guide ||
      // or the affected guide is currently being shown
      guidesShown.find(
        (g) => g.entityId === activeJourneySelectedGuide?.entityId
      )?.entityId)
  ) {
    return [true, { navigateAway: true }];
  }

  // ends a journey after a certain amount of time has elapsed and guide has not been shown
  if (
    // time elapsed criteria was set
    activeJourney.endingCriteria.timeElapsed &&
    // active journey is of guide-type
    activeJourney.type === EmbedTypenames.guide &&
    // selected guide is not being shown
    !guidesShown.find(
      (g) => g.entityId === activeJourneySelectedGuide?.entityId
    ) &&
    // enough time has elapsed since the start of the journey,
    // or the moment the main store was initialized. The latter is important
    // for cases where we're redirecting the user between pages, given we cannot
    // know how much time it will take to re-initialize afterward
    Date.now() - Math.max(activeJourney.startedAt.getTime(), initializedAt) >=
      ATC_FAILED_JOURNEY_TIMEOUT
  ) {
    return [true, { timeElapsed: true }];
  }

  return [false, undefined];
};

const BentoAirTrafficElement: React.FC<ComposedProps> = ({
  initialized,
  activeJourney,
  guidesAvailable,
  tagsAvailable,
  npsSurveysAvailable,
  guidesShown,
  appLocation,
  pushDesiredState,
  endJourney,
  toggleStealthMode,
  unlock,
  activeJourneySelectedGuide,
  /** Refers to the "main" sidebar specifically */
  sidebarOpen,
  sidebarSelectedStep,
  stealthMode,
  onboardingInlineEmbed,
  locked,
  lockedReason,
  toggledOffAtLeastOnce,
  mainStoreStateGetter,
}) => {
  const { observeStylingAttributes } = getFeatureFlags(undefined);

  /** Whether the inline component for onboarding guides is present in the page */
  const [inlineEmbedPresent, setInlineEmbedPresent] = useState(false);

  /**
   * Moment where we detected the main store had been initialized for the first time.
   *
   * This is useful to help determine whether we can automatically end journeys based
   * on time elapsed while still considering the case of page refreshes, which can add
   * significant delay to Bento startup and guide selection logic. That is why we don't
   * rely on the time the main store was initialized.
   */
  const initializationDetectedAt = useRef<number>();

  /**
   * Keeps track of the previous sidebar open state.
   */
  const prevSidebarOpen = usePreviousValue(sidebarOpen);

  /** The URL of the current page */
  const currentPageUrl = appLocation.href;

  /** All content available, combined and sorted */
  const contentAvailable = useMemo(
    () =>
      [...guidesAvailable, ...npsSurveysAvailable].sort(sortByOrderIndexAsc),
    [guidesAvailable, npsSurveysAvailable]
  );

  /**
   * All the tagged elements available keyed by entityId.
   * This is useful when we have to find a specific tag that belongs to a guide and is mainly
   * used to help determine whether targeting criteria matches.
   */
  const taggedElements = useMemo<Record<TaggedElementEntityId, TaggedElement>>(
    () => keyBy(tagsAvailable, 'entityId'),
    [tagsAvailable]
  );

  const settings = useSessionStore(({ uiSettings }) => {
    const airTrafficAwareSettings: AirTrafficAwareSettings = {
      /** Determines the tag visibility behavior */
      tagVisibility: uiSettings?.tagVisibility,
      /** Whether sidebar auto-open should be prevented */
      preventAutoOpens:
        uiSettings?.sidebarAvailability === SidebarAvailability.hide ||
        uiSettings?.sidebarAvailability === SidebarAvailability.neverOpen ||
        /**
         * This is for full animation only. When/if we include the smaller
         *   auto focus this property may need to be considered separately.
         */
        !!uiSettings?.isSidebarAutoOpenOnFirstViewDisabled,
    };
    return {
      /** Whether the stealth mode feature is enabled and can hide components */
      stealthModeCanHide:
        uiSettings?.responsiveVisibility?.all ===
        ResponsiveVisibilityBehavior.hide,
      /** Settings relevant to the air traffic control algorithm */
      airTrafficAwareSettings,
    };
  }, shallow);

  const isMobile = useMemo(() => mobile(), []);

  /**
   * NOTE: Doesn't need to be part of the deps array given its "dependencies" already are (i.e. content available).
   */
  const ownGuideSelector = useCallback<AirTrafficControlInput['guideSelector']>(
    (guideEntityId) => guideSelector(guideEntityId, mainStoreStateGetter()),
    [mainStoreStateGetter]
  );

  /**
   * NOTE: Doesn't need to be part of the deps array given its "dependencies" already are (i.e. content available).
   */
  const ownStepSelector = useCallback<AirTrafficControlInput['stepSelector']>(
    (stepEntityId) => stepSelector(stepEntityId, mainStoreStateGetter()),
    [mainStoreStateGetter]
  );

  /**
   * NOTE: Doesn't need to be part of the deps array given its "dependencies" already are (i.e. content available).
   */
  const ownTaggedElementOfStepSelector = useCallback<
    AirTrafficControlInput['taggedElementOfStepSelector']
  >(
    (guideEntityId, stepEntityId) =>
      taggedElementOfStepSelector(
        mainStoreStateGetter(),
        guideEntityId,
        stepEntityId
      ),
    [mainStoreStateGetter]
  );

  const airTrafficDepsArray = [
    initialized,
    activeJourney,
    contentAvailable,
    taggedElements,
    currentPageUrl,
    sidebarOpen,
    sidebarSelectedStep,
    stealthMode,
    isMobile,
    inlineEmbedPresent,
    settings.airTrafficAwareSettings,
    toggledOffAtLeastOnce,
    locked,
  ];

  /**
   * Computes the new air traffic state and pushes the new desired state.
   *
   * Need to react to a few different things:
   * - DOM Changes
   * - Guides availability and targeting criteria (incl. previews)
   * - Start/end of a Journey
   *
   * NOTE: Given preview sessions are focused (only content that is supposed to show is ever set to the store), we're
   * currently handling Live vs. Preview content alongside each other. If this premise ever changes, then we would
   * have to fully separate the data selection & ATC state to create two separate contexts in which the same ATC logic
   * would run and determine which content is allowed to show.
   */
  const airTrafficHandler = useCallbackRef(
    /** @todo cross-check if throttling makes sense and with which options */
    throttle(
      () => {
        /** If locked, skip computing new desired state */
        if (locked) return;

        const newDesiredState = airTrafficControl({
          initialized,
          activeJourney,
          contentAvailable,
          taggedElements,
          currentPageUrl,
          sidebarOpen,
          sidebarSelectedStep,
          stealthMode,
          isMobile,
          inlineEmbedPresent,
          settings: settings.airTrafficAwareSettings,
          toggledOffAtLeastOnce,
          guideSelector: ownGuideSelector,
          stepSelector: ownStepSelector,
          taggedElementOfStepSelector: ownTaggedElementOfStepSelector,
        });

        pushDesiredState({ value: newDesiredState });
      },
      70,
      { leading: false, trailing: true }
    ),
    airTrafficDepsArray,
    { callOnDepsChange: true, callOnLoad: false }
  );

  const inlineEmbedObserver = useCallbackRef(
    throttle(
      () => {
        const newValue = onboardingInlineEmbed
          ? detectOnboardingInlineEmbed(onboardingInlineEmbed)
          : false;
        setInlineEmbedPresent(newValue);
      },
      500,
      { leading: false, trailing: true }
    ),
    [onboardingInlineEmbed],
    { callOnDepsChange: true, callOnLoad: false }
  );

  /**
   * Determines whether to enable to DOM observer.
   * Wont be enabled if store is not initialized or if no available content justifies observing the DOM.
   */
  const enableDOMObserver = useMemo(
    () =>
      initialized &&
      guidesAvailable.length +
        tagsAvailable.length +
        npsSurveysAvailable.length >
        0,
    [
      initialized,
      guidesAvailable.length,
      tagsAvailable.length,
      npsSurveysAvailable.length,
    ]
  );

  useDomObserver(
    () => {
      debugMessage('[BENTO] [airTrafficControl] DOM changes detected');

      // re-computes a new desired state
      airTrafficHandler();
      // re-attempts to detect the onboarding inline embed presence
      inlineEmbedObserver();
    },
    { disabled: enableDOMObserver === false, observeStylingAttributes }
  );

  /**
   * Dispatches an action to the mainStore signaling the journey ended for a guide/survey.
   * This is useful to perform actions like recording automatic dismissal.
   */
  const dismissActiveJourney = useCallback(
    (reason: Exclude<ShouldEndJourneyDecision[1], undefined>) => {
      // Skip if active journey is missing
      if (!activeJourney) return;

      switch (activeJourney?.type) {
        case EmbedTypenames.guide:
          mainStoreStateGetter().dispatch({
            type: 'guideJourneyEnded',
            guide: activeJourney.selectedGuide,
            module: activeJourney.selectedModule,
            step: activeJourney.selectedStep,
            navigatedAway: !!reason.navigateAway,
          });
          break;

        case EmbedTypenames.npsSurvey:
          mainStoreStateGetter().dispatch({
            type: 'npsSurveyDismissed',
            entityId: activeJourney.selectedSurvey,
          });
          break;

        default:
          break;
      }
    },
    [activeJourney]
  );

  const shouldEndFlowDepsArray = [
    initialized, // moment the main store was initialized, if any
    activeJourney, // journey can change
    activeJourneySelectedGuide, // guide details can change
    currentPageUrl, // current page url can change
    guidesShown, // guides currently shown
    sidebarOpen, // main sidebar can be toggled
    locked, // whether air traffic is locked
  ];

  const shouldEndJourneyHandler = () => {
    /**
     * Records the moment when we detected the main store was initialized for the first time.
     */
    if (initialized && !initializationDetectedAt.current) {
      initializationDetectedAt.current = Date.now();
    }

    /**
     * If state is locked or mainStore has not been fully initialized yet,
     * skip computing whether a journey should end.
     *
     * NOTE: This is important to not short-circuit journeys when data is not fully ready yet
     * (i.e. page got refreshed, etc).
     */
    if (!initialized || locked) return;

    const [shouldEnd, reason] = shouldEndJourney({
      initializedAt: initializationDetectedAt.current!,
      activeJourney,
      activeJourneySelectedGuide,
      currentPageUrl,
      guidesShown,
      sidebarOpen,
      prevSidebarOpen: !!prevSidebarOpen,
    });

    if (shouldEnd) {
      dismissActiveJourney(reason);
      endJourney({ reason });
    }
  };

  /**
   * Runs the callback to evaluate whether we should end a journey every time the deps array changes.
   * This is useful to automatically end journeys for most of supported cases.
   */
  useEffect(() => {
    void shouldEndJourneyHandler();
  }, [shouldEndFlowDepsArray]);

  /**
   * Manages a time interval that gets created/destroyed every time the deps array changes,
   * and will re-run the callback constantly.
   * This is useful to automatically end journeys when associated guides are not shown.
   */
  useEffect(() => {
    const interval = window.setInterval(
      () => void shouldEndJourneyHandler(),
      1000 // every 1s
    );
    return () => void clearInterval(interval);
  }, [shouldEndFlowDepsArray]);

  const stealthModeObserver = useCallback(
    debounce(
      () => {
        const newValue = settings.stealthModeCanHide
          ? window.innerWidth < STEALTH_MODE_BREAKPOINTS['width'] ||
            window.innerHeight < STEALTH_MODE_BREAKPOINTS['height']
          : false;

        if (newValue !== stealthMode) {
          toggleStealthMode({ value: newValue });
        }
      },
      100,
      { maxWait: 150 }
    ),
    [stealthMode, settings.stealthModeCanHide]
  );

  useResizeObserver(
    () => {
      stealthModeObserver();
      inlineEmbedObserver();
    },
    {
      // wont be enabled if store is not initialized
      disabled: !initialized,
    }
  );

  const previouslyLocked = useRef<boolean>(false);
  const unlockTimeout = useRef<number | undefined>(undefined);

  /**
   * Safeguard observer responsible for managing a timeout to automatically unlock
   * the air traffic state in case it exceeds the allowed time and continues to be locked.
   */
  useEffect(() => {
    if (locked && !unlockTimeout.current) {
      unlockTimeout.current = window.setTimeout(() => {
        void unlock();
        debugMessage(
          '[BENTO] Air traffic lock released after timeout has elapsed',
          {
            locked,
            lockedReason,
            activeJourney,
            // manually adds the page url because some cases seem to not have one
            urlInfo: {
              referrer: document.referrer,
              current: window.location.href,
            },
          }
        );
      }, ATC_UNLOCK_TIMEOUT);
    } else if (previouslyLocked.current) {
      clearTimeout(unlockTimeout.current);
      unlockTimeout.current = undefined;
    }
    previouslyLocked.current = locked;
  }, [locked]);

  /**
   * Couple related to-dos:
   *
   * @todo consider moving useGuideViews here (at least for side quests)
   */

  // wont render anything
  return null;
};

export default composeComponent<OuterProps>([
  withLocation,
  withSidebarState<BeforeSidebarStoreDataProps, SidebarStoreData>(
    (state, _props): SidebarStoreData => {
      const sidebar = state.sidebars[MAIN_SIDEBAR_STATE_ID];
      return {
        sidebarOpen: sidebar.open,
        toggledOffAtLeastOnce: sidebar.toggledOffAtLeastOnce,
      };
    }
  ),
  withAirTrafficState<BeforeAirTrafficStoreDataProps, AirTrafficStoreData>(
    (state, _props): AirTrafficStoreData => ({
      pushDesiredState: state.pushDesiredState,
      endJourney: state.endJourney,
      toggleStealthMode: state.toggleStealthMode,
      unlock: state.unlock,
      activeJourney: activeJourneySelector(state),
      guidesShown: guidesShownSelector(state),
      stealthMode: state.stealthMode,
      locked: !!state.locked,
      lockedReason: state.lockedReason,
    })
  ),
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { guidesShown, activeJourney }): MainStoreData => {
      const activeJourneySelectedGuide =
        activeJourney?.type === EmbedTypenames.guide
          ? guideSelector(activeJourney?.selectedGuide, state)
          : undefined;

      return {
        initialized: !!state.initialized,
        guidesAvailable: allGuidesSelector(state),
        npsSurveysAvailable: allNpsSurveysSelector(state),
        tagsAvailable: allTaggedElementsSelector(state),
        guidesShown: guidesShown
          .map((geId) => guideSelector(geId, state))
          .filter(Boolean) as Guide[],
        onboardingInlineEmbed: onboardingInlineEmbedSelector(state),
        activeJourneySelectedGuide,
        sidebarSelectedStep: formFactorSelector(state, EmbedFormFactor.sidebar)
          ?.selectedStep,
        mainStoreStateGetter: () => state,
      };
    }
  ),
])(BentoAirTrafficElement);
