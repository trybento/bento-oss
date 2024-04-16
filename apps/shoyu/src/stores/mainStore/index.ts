import create, { GetState, Mutate, SetState, StoreApi } from 'zustand/vanilla';
import { subscribeWithSelector, devtools } from 'zustand/middleware';
import produce from 'immer';
import {
  AtLeast,
  ActionHandlersMap,
  EmbedFormFactor,
  ActionHandler,
} from 'bento-common/types';
import {
  FormFactorStateKey,
  FullGuide,
  GlobalState,
  GlobalStateAction,
  GlobalStateActionPayload,
  GuideEntityId,
  InlineEmbed,
  InlineEmbedEntityId,
  StepAutoCompleteInteraction,
  StepEntityId,
  TaggedElement,
} from 'bento-common/types/globalShoyuState';

import { MainStoreState, WorkingState } from './types';
import availableGuidesChanged from './actions/availableGuidesChanged';
import guideChanged from './actions/guideChanged';
import guideSelected from './actions/guideSelected';
import guideSaved from './actions/guideSaved';
import guideViewed from './actions/guideViewed';
import guidesLoaded from './actions/guidesLoaded';
import stepChanged from './actions/stepChanged';
import stepViewed from './actions/stepViewed';
import moduleSelected from './actions/moduleSelected';
import stepSelected from './actions/stepSelected';
import articleSelected from './actions/articleSelected';
import previewGuideSet from './actions/previewGuideSet';
import previewGuideRemoved from './actions/previewGuideRemoved';
import onboardingReset from './actions/onboardingReset';
import branchingPathSelected from './actions/branchingPathSelected';
import tagDismissed from './actions/tagDismissed';
import branchingPathsChanged from './actions/branchingPathsChanged';
import previewTaggedElementSet from './actions/previewTaggedElementSet';
import previewTaggedElementRemoved from './actions/previewTaggedElementRemoved';
import stepAutoCompleteInteractionsChanged from './actions/stepAutoCompleteInteractionsChanged';
import stepAutoCompleteInteractionTriggered from './actions/stepAutoCompleteInteractionTriggered';
import inlineEmbedsChanged from './actions/inlineEmbedsChanged';
import inlineEmbedSet from './actions/inlineEmbedSet';
import inlineEmbedRemoved from './actions/inlineEmbedRemoved';
import modalSeen from './actions/modalSeen';
import launchCtaClicked from './actions/launchCtaClicked';
import stepCtaClicked from './actions/stepCtaClicked';
import destinationGuideLaunched from './actions/destinationGuideLaunched';
import taggedElementFlagSet from './actions/taggedElementFlagSet';
import renderedFormFactorChanged from './actions/renderedFormFactorChanged';
import formFactorCreated from './actions/formFactorCreated';
import formFactorRemoved from './actions/formFactorRemoved';
import formFactorGuidesUpdated from './actions/formFactorGuidesUpdated';
import moduleBranchingReset from './actions/moduleBranchingReset';
import branchingPathsSubmitted from './actions/branchingPathsSubmitted';
import guideHydrationStarted from './actions/guideHydrationStarted';
import guideHydrationFailed from './actions/guideHydrationFailed';
import contextualDismissed from './actions/contextualDismissed';
import npsSurveysChanged from './actions/npsSurveysChanged';
import guideJourneyEnded from './actions/guideJourneyEnded';
import availableGuidesLoader from './loaders/availableGuidesLoader';
import stepAutoCompleteInteractionsLoader from './loaders/stepAutoCompleteInteractionsLoader';
import inlineEmbedsLoader from './loaders/inlineEmbedsLoader';
import npsSurveysLoader from './loaders/npsSurveysLoader';

import {
  reviveDates,
  getPersistenceVersion,
  getVerifierKeyValue,
  sanitizeStateForPersistence,
} from './helpers/persistence';
import { isDevtoolsEnabled } from '../../lib/debug';
import { persist, StorePersist } from '../middleware/persist';
import errorBoundary from '../middleware/errorBoundary';
import { withCatchException } from '../../lib/catchException';
import npsSurveySeen from './actions/npsSurveySeen';
import npsSurveyDismissed from './actions/npsSurveyDismissed';
import npsSurveyAnswered from './actions/npsSurveyAnswered';

/**
 * This will be our initial state before any actions are dispatched.
 */
export const initialState: GlobalState = {
  guides: {},
  modules: {},
  steps: {},
  formFactors: {},
  taggedElements: {},
  stepAutoCompleteInteractions: {},
  branchingPaths: {
    paths: {},
    guides: {},
    modules: {},
    steps: {},
  },
  inlineEmbeds: {},
  npsSurveys: {},
  initialized: undefined,
};

// TODO: add the payload type definition
const actionHandlers: ActionHandlersMap<WorkingState, GlobalStateAction> = {
  availableGuidesChanged,
  guideChanged,
  guideSaved,
  guideSelected,
  guideHydrationStarted,
  guideHydrationFailed,
  guideJourneyEnded,
  guideViewed,
  stepChanged,
  stepViewed,
  stepAutoCompleteInteractionsChanged,
  stepAutoCompleteInteractionTriggered,
  moduleSelected,
  stepSelected,
  articleSelected,
  onboardingReset,
  moduleBranchingReset,
  branchingPathSelected,
  branchingPathsSubmitted,
  tagDismissed,
  branchingPathsChanged,
  inlineEmbedsChanged,
  npsSurveysChanged,
  modalSeen,
  launchCtaClicked,
  stepCtaClicked,
  taggedElementFlagSet,
  renderedFormFactorChanged,
  formFactorCreated,
  formFactorRemoved,
  formFactorGuidesUpdated,
  contextualDismissed,
  guidesLoaded,
  npsSurveyAnswered,
  npsSurveyDismissed,
  npsSurveySeen,
};

// @ts-ignore-error
const mainStore = create<
  MainStoreState,
  SetState<MainStoreState>,
  GetState<MainStoreState>,
  Mutate<
    StoreApi<MainStoreState>,
    [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]]
  > &
    StorePersist<GlobalState>
>(
  // @ts-ignore-error
  errorBoundary(
    (isDevtoolsEnabled() ? devtools : (a: any) => a)(
      // selector middleware
      subscribeWithSelector(
        /** @todo fix types and remove the `@ts-ignore` below */
        // @ts-ignore
        persist(
          (set) => ({
            ...initialState,
            hydrateAvailableGuides: async () => {
              const payload = await availableGuidesLoader<
                Pick<
                  GlobalStateActionPayload<'availableGuidesChanged'>,
                  'availableGuides'
                >
              >();
              if (payload) {
                set(
                  produce<MainStoreState>((state) =>
                    availableGuidesChanged(state, payload)
                  ),
                  false,
                  // @ts-ignore
                  {
                    type: 'hydrateAvailableGuides',
                    ...payload,
                  }
                );
              }
            },
            hydrateStepAutoCompleteInteractions: async () => {
              const { stepAutoCompleteInteractions } =
                (await stepAutoCompleteInteractionsLoader<
                  GlobalStateActionPayload<'stepAutoCompleteInteractionsChanged'>
                >()) || {
                  stepAutoCompleteInteractions: [],
                };
              return set(
                produce<MainStoreState>((state) =>
                  stepAutoCompleteInteractionsChanged(state, {
                    stepAutoCompleteInteractions,
                  })
                ),
                false,
                // @ts-ignore
                { type: 'hydrateStepAutoCompleteInteractions' }
              );
            },
            hydrateInlineEmbeds: async () => {
              const { inlineEmbeds } = (await inlineEmbedsLoader<
                GlobalStateActionPayload<'inlineEmbedsChanged'>
              >()) || {
                inlineEmbeds: [],
              };
              return set(
                produce<MainStoreState>((state) =>
                  inlineEmbedsChanged(state, { inlineEmbeds })
                ),
                false,
                // @ts-ignore
                { type: 'hydrateInlineEmbeds' }
              );
            },
            hydrateGuide: (guide: GuideEntityId) =>
              set(
                produce<MainStoreState>((state) =>
                  guideHydrationStarted(state, { guide })
                ),
                false,
                // @ts-ignore
                { type: 'hydrateGuide', guide }
              ),
            hydrateNpsSurveys: async () => {
              const { npsSurveys } = (await npsSurveysLoader<
                GlobalStateActionPayload<'npsSurveysChanged'>
              >()) || {
                npsSurveys: [],
              };

              return set(
                produce<MainStoreState>((state) =>
                  npsSurveysChanged(state, { npsSurveys })
                ),
                false,
                // @ts-ignore
                { type: 'hydrateNpsSurveys' }
              );
            },
            setPreviewGuide: (
              previewId: string,
              guide: FullGuide,
              additionalGuides: FullGuide[] | undefined,
              formFactor: EmbedFormFactor
            ) =>
              set(
                produce<MainStoreState>((state) =>
                  previewGuideSet(state, {
                    previewId,
                    guide,
                    additionalGuides,
                    formFactor,
                  })
                ),
                false,
                // @ts-ignore
                { type: 'setPreviewGuide', previewId, guide }
              ),
            removePreviewGuide: (previewId: string) =>
              set(
                produce<MainStoreState>((state) => {
                  previewGuideRemoved(state, { previewId });
                }),
                false,
                // @ts-ignore
                { type: 'removePreviewGuide', previewId }
              ),
            setPreviewTaggedElement: (taggedElement: TaggedElement) =>
              set(
                produce<MainStoreState>((state) =>
                  previewTaggedElementSet(state, { taggedElement })
                ),
                false,
                // @ts-ignore
                { type: 'setPreviewTaggedElement', taggedElement }
              ),
            removePreviewTaggedElement: (
              taggedElement: AtLeast<TaggedElement, 'entityId'>
            ) =>
              set(
                produce<MainStoreState>((state) =>
                  previewTaggedElementRemoved(state, { taggedElement })
                ),
                false,
                // @ts-ignore
                { type: 'removePreviewTaggedElement', taggedElement }
              ),
            setPreviewInlineEmbed: (inlineEmbed: InlineEmbed) =>
              set(
                produce<MainStoreState>((state) =>
                  inlineEmbedSet(state, { inlineEmbed })
                ),
                false,
                // @ts-ignore
                { type: 'setPreviewInlineEmbed', inlineEmbed }
              ),
            removePreviewInlineEmbed: (entityId: InlineEmbedEntityId) =>
              set(
                produce<MainStoreState>((state) =>
                  inlineEmbedRemoved(state, { entityId })
                ),
                false,
                // @ts-ignore
                { type: 'removePreviewInlineEmbed', entityId }
              ),
            launchDestinationGuide: (
              startedFromStepEntityId: StepEntityId,
              guide: FullGuide,
              stepAutoCompleteInteractions: StepAutoCompleteInteraction[],
              appLocation: string | undefined
            ) =>
              set(
                produce<MainStoreState>((state) =>
                  destinationGuideLaunched(state, {
                    startedFromStepEntityId,
                    guide,
                    stepAutoCompleteInteractions,
                    appLocation,
                  })
                ),
                false,
                // @ts-ignore
                {
                  type: 'launchDestinationGuide',
                  startedFromStepEntityId,
                  guide,
                  appLocation,
                }
              ),
            dispatch: ({ type, ...payload }: GlobalStateAction) =>
              set(
                produce<MainStoreState>((state) => {
                  const actionHandler = actionHandlers[type] as ActionHandler<
                    WorkingState,
                    GlobalStateAction,
                    typeof type
                  >;
                  if (!actionHandler) {
                    throw new Error(`Unknown action type: ${type}`);
                  }
                  withCatchException(
                    () =>
                      actionHandler(
                        state,
                        payload as GlobalStateActionPayload<typeof type>
                      ),
                    `mainStore: dispatch: ${type}`
                  )();
                }),
                false,
                // @ts-ignore
                { type, ...payload }
              ),
          }),
          {
            /**
             * Under which name the state will be persisted within in the storage.
             */
            name: 'bento-mainStore',
            /**
             * Persisted state time-to-live, in seconds.
             */
            ttl: 86400, // 24h
            /**
             * Which client-side storage to use.
             */
            getStorage: () => localStorage,
            /**
             * Signs the persisted state with AppID, accountId, accountUserId to later
             * determine data ownership and whether or not we should hydrate from it,
             * thus protecting from data leakage.
             */
            getSignature: () => window.btoa(getVerifierKeyValue()),
            /**
             * Sets a version based on the COMMIT_SHA to avoid hydrating potentially
             * incompatible data (i.e. different app version introduces a breaking change).
             */
            version: getPersistenceVersion(),
            /**
             * Prevent that some parts of the state gets persisted.
             */
            serialize: (state) => sanitizeStateForPersistence(state),
            /**
             * Custom deserialization method used to revive Date objects.
             */
            deserialize: (str) => JSON.parse(str, reviveDates),
          }
        )
      ),
      // @ts-ignore-error
      {
        name: `Bento Main Store - ${window.location.host} - ${document.title}`,
        /**
         * To enable tracing and silence TS errors, uncomment the lines below.
         * This is needed because Zustand's devtools args signature does not contain `trace` within
         * the supported options, although it works.
         */
        // trace: true,
      } // as unknown as any
    ),
    'mainStore'
  )
);

export default mainStore;
