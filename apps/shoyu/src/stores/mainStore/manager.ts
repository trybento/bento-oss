import shallow from 'zustand/shallow';
import { getEverboardingInlineFormFactor } from 'bento-common/utils/formFactor';
import { debugMessage } from 'bento-common/utils/debugging';
import {
  FormFactorState,
  GuideEntityId,
  InlineEmbed,
} from 'bento-common/types/globalShoyuState';
import { EmbedFormFactor } from 'bento-common/types';
import { isVisualBuilderSession } from 'bento-common/features/wysiwyg/messaging';

import mainStore, { initialState } from '.';
import { getToken } from '../sessionStore/helpers';
import { guideSelector } from './helpers/selectors';
import { noGuideLoadedEvent } from '../../lib/events';
import availableGuidesChangedSub from './subscribers/availableGuidesChanged';
import guideChangedSubscriber from './subscribers/guideChanged';
import inlineEmbedsChangedSubscriber from './subscribers/inlineEmbedsChanged';
import stepAutoCompleteInteractionsChangedSub from './subscribers/stepAutoCompleteInteractionsChanged';
import { handlePollingChecks } from '../../api';
import getFeatureFlags from '../../lib/featureFlags';
import { isComingFromBento } from '../../lib/helpers';
import { WYSIWYG_CHROME_EXTENSION_ID } from '../../lib/constants';

const unsubscribersMap: Record<string, () => void> = {};

function unsubscribe(key: string) {
  unsubscribersMap[key]?.();
  delete unsubscribersMap[key];
}

function markAsInitialized() {
  setTimeout(() => {
    mainStore.setState({ initialized: new Date() }, false, 'storeInitialized');
    // handle the possibility of no available guides
    handleNoGuideLoadedChecks();
  }, 0); // makes this unblocking but still execute asap
}

const initialize = async (
  /** Account external id */
  accountId: string,
  /** Account user external id */
  accountUserId: string,
  /** Whether launching cache was hit on the server */
  cacheHit = false
) => {
  /**
   * Protect against re-initializing the store with a different account/User,
   * effectively performing a shutdown before anything else.
   */
  if (mainStore.getState().initialized) {
    shutdown();
  }

  debugMessage('[BENTO] Initializing main store', {
    accountId,
    accountUserId,
  });

  if (!getToken()) {
    debugMessage('[BENTO] No token found, skipping main store initialization');
    return;
  }

  const { isNpsSurveysEnabled, isForcedAvailableGuidesHydrationEnabled } =
    getFeatureFlags(undefined);

  let pollingSuccess = false;
  let hydratedFromPersistence = false;

  /**
   * Determines if we're in a visual builder session session.
   * If we're, then we need to skip the normal initialization process to not run the risk
   * of leaking real guides into the visual builder session.
   */
  const fromBento =
    // If coming from Bento but not currently in Bento
    (isComingFromBento() &&
      !window.location.href.startsWith(
        process.env.VITE_PUBLIC_CLIENT_URL_BASE!
      )) ||
    // Or if this is a visual builder session
    (await isVisualBuilderSession(WYSIWYG_CHROME_EXTENSION_ID));

  if (!fromBento) {
    // Start watching for the availableGuidesChanged subscription as soon as possible
    unsubscribersMap['availableGuidesChangedSub'] = availableGuidesChangedSub();

    // Start watching for the stepAutoCompleteInteractionsChanged subscription
    unsubscribersMap['stepAutoCompleteInteractionsChangedSub'] =
      stepAutoCompleteInteractionsChangedSub();

    // Start watching for the inline embeds subscription
    unsubscribersMap['inlineEmbedsChangedSub'] =
      inlineEmbedsChangedSubscriber();

    unsubscribersMap['inlineContextGuideEmbeds'] = mainStore.subscribe(
      (state) =>
        Object.values<InlineEmbed>(state.inlineEmbeds).filter(
          (embed) =>
            !embed.previewId && embed.guide && guideSelector(embed.guide, state)
        ),
      (inlineEmbeds, prevInlineEmbeds) => {
        for (const embed of inlineEmbeds) {
          const guide = guideSelector(embed.guide, mainStore.getState());
          if (guide) {
            mainStore.getState().dispatch({
              type: 'formFactorGuidesUpdated',
              formFactorStateKey: getEverboardingInlineFormFactor(
                embed.entityId
              ),
              formFactor: EmbedFormFactor.inline,
            });
          }
        }
        const inlineEmbedIds = inlineEmbeds.map((embed) => embed.entityId);
        prevInlineEmbeds
          .filter((prevEmbed) => !inlineEmbedIds.includes(prevEmbed.entityId))
          .forEach((prevEmbed) => {
            mainStore.getState().dispatch({
              type: 'formFactorRemoved',
              id: getEverboardingInlineFormFactor(prevEmbed.entityId),
            });
          });
      },
      { equalityFn: shallow }
    );

    // Observe state.guides changes to handle guideChanged subscriptions
    unsubscribersMap['stateGuides'] = mainStore.subscribe(
      (state) =>
        [
          ...new Set(
            Object.values<FormFactorState>(state.formFactors)
              .map((ff) => ff.selectedGuide)
              .filter(
                (guide) =>
                  guide && state.guides[guide] && !state.guides[guide].isPreview
              )
          ),
        ] as GuideEntityId[],
      (guides: GuideEntityId[]) => {
        const subscriptionKeys = guides.map(
          (guideEntityId) => `guideChanged-${guideEntityId}`
        );
        guides.forEach((guideEntityId, i) => {
          const cacheKey = subscriptionKeys[i];
          if (!unsubscribersMap[cacheKey]) {
            mainStore.getState().hydrateGuide(guideEntityId);
            unsubscribersMap[cacheKey] = guideChangedSubscriber(guideEntityId);
          }
        });
        // clean up guides which are no longer active
        Object.keys(unsubscribersMap).forEach((cacheKey) => {
          if (
            cacheKey.startsWith('guideChanged-') &&
            !subscriptionKeys.includes(cacheKey)
          ) {
            unsubscribe(cacheKey);
          }
        });
      },
      { equalityFn: shallow }
    );

    // Observe state.guides changes to dispatch `bento-onGuideLoad` event
    unsubscribersMap['guideLoaded'] = mainStore.subscribe(
      (state) => Object.keys(state.guides) as GuideEntityId[],
      (current, previous) => {
        const guides = current.filter(
          (guideEntityId) => !previous.includes(guideEntityId)
        );
        mainStore.getState().dispatch({ type: 'guidesLoaded', guides });
      },
      { equalityFn: shallow }
    );

    // Attempts client-side persistence hydration
    hydratedFromPersistence = hydrateCSP();

    // If there was a cache miss, it then means we need to long poll the identify checks
    // to know when to query for updated data
    if (!cacheHit) {
      pollingSuccess = await handlePollingChecks();
      debugMessage('[BENTO] Hydrating after long polling...');
    }

    // NOTE: We need to support two initialization flows:
    //
    // 1. If we hydrated from persistence and hit cache, we can skip available guides and conditionally
    // run all the rest of hydrators
    // 2. Otherwise, we must unconditionally hydrate available guides and all other hydrators

    const firstOrderHydrators: Promise<void>[] = [];
    const secondOrderHydrators: Promise<void>[] = [];

    // Since some objects might have suffered a content/settings update, we need to
    // re-hydrate conditionally as a way to optimize for unnecessary hydrations that would otherwise
    // happen on every Bento initialization.
    const conditional = hydratedFromPersistence && cacheHit;

    // If not hydrated from persistence or cache was missed, then we need to re-/hydrate available guides
    if (
      !hydratedFromPersistence ||
      !cacheHit ||
      isForcedAvailableGuidesHydrationEnabled
    ) {
      // hydrates the store with initial available guides
      firstOrderHydrators.push(mainStore.getState().hydrateAvailableGuides());
    }

    // Conditionally hydrate inline embeds
    if (
      !conditional ||
      Object.keys(mainStore.getState().inlineEmbeds).length > 0
    ) {
      // hydrates the store with the inline embeds
      firstOrderHydrators.push(mainStore.getState().hydrateInlineEmbeds());
    }

    // Conditionally hydrate NPS surveys based on the feature flag
    if (isNpsSurveysEnabled) {
      firstOrderHydrators.push(mainStore.getState().hydrateNpsSurveys());
    }

    // Consider the store initialized as soon as the first order hydrators are done
    Promise.all(firstOrderHydrators).then(() => {
      markAsInitialized();
    });

    // Conditionally hydrate step auto-complete interactions
    if (
      !conditional ||
      Object.keys(mainStore.getState().stepAutoCompleteInteractions).length > 0
    ) {
      secondOrderHydrators.push(
        mainStore.getState().hydrateStepAutoCompleteInteractions()
      );
    }
  } else {
    debugMessage(
      '[BENTO] User came from Bento or WYSIWYG mode, skipping normal initialization'
    );
    markAsInitialized();
  }
};

const hydrateCSP = (): boolean => {
  mainStore.persist.hydrate();
  return mainStore.persist.hasHydrated() && !!mainStore.getState().initialized;
};

// Called after initialization in order to determine if we should keep the
// subscriptions open
const handleNoGuideLoadedChecks = () => {
  if (Object.keys(mainStore.getState().guides).length === 0) {
    debugMessage('[BENTO] No guides found, closing subscriptions...');
    unsubscribe('availableGuidesChangedSub');
    unsubscribe('stepAutoCompleteInteractionsChangedSub');
    unsubscribe('inlineEmbedsChangedSub');
    noGuideLoadedEvent();
  }
};

const shutdown = () => {
  debugMessage('[BENTO] Shutting down the main store');

  /**
   * NOTE: It seems that destroying the store every time window.Bento.reset() is
   * called messes up rendering. It's enough to just unsubscribe from any
   * subscriptions.
   */

  // Unsubscribe from all
  Object.keys(unsubscribersMap).forEach(unsubscribe);

  // reset state by replacing it with initial state
  mainStore.setState(initialState);
};

export default {
  initialize,
  shutdown,
};
