import './lib/polyfills';
import './lib/debug';

import { debugMessage } from 'bento-common/utils/debugging';
import { PreviewDataPack } from 'bento-common/types/preview';
import {
  BentoSettings,
  EmbedFormFactor,
  DiagnosticEventNames,
  InjectionPosition,
  BentoInstance,
} from 'bento-common/types';
import assertBentoSettings from 'bento-common/validation/bentoSettings.schema';
import { InlineEmbedEntityId } from 'bento-common/types/globalShoyuState';
import { cloneDeep, isEqual, once } from 'bento-common/utils/lodash';
import { isVisualBuilderSession } from 'bento-common/features/wysiwyg/messaging';

import catchException, { withCatchException } from './lib/catchException';
import mainStoreManager from './stores/mainStore/manager';
import sessionStoreManager from './stores/sessionStore/manager';
import sidebarStoreManager from './stores/sidebarStore/manager';
import resetPersistedValues from './lib/resetPersistedValues';
import BentoWebComponent from './BentoWebComponent';
import BentoAirTrafficElement from './BentoAirTrafficElement';
import BentoSidebarElement from './BentoSidebarElement';
import BentoInlineElement from './BentoInlineElement';
import BentoContextElement from './BentoContextElement';
import BentoModalElement from './BentoModalElement';
import BentoBannerElement from './BentoBannerElement';
import BentoAutoCompleteInteractionsElement from './BentoAutoCompleteInteractions';
import BentoTooltipElement from './BentoTooltipElement';
import BentoVisualTagElement from './BentoVisualTagElement';
import BentoInlineInjectorElement from './BentoInlineInjectorElement';
import { handleIdentify, sendDiagnostics } from './api';
import { WYSIWYG_CHROME_EXTENSION_ID } from './lib/constants';
import sessionStore from './stores/sessionStore';
import sidebarStore from './stores/sidebarStore';
import mainStore from './stores/mainStore';
import { refreshBentoInitID } from './lib/trace';
import sdk from './api/sdk';
import { closeGraphql } from './lib/graphqlClient';
import airTrafficStoreManager from './stores/airTrafficStore/manager';
import airTrafficStore from './stores/airTrafficStore';
import { BENTO_MESSAGE } from './constants';
import { INJECTABLES_CONTAINER_ID } from 'bento-common/utils/constants';
import { autoInjectSidebar } from './stores/sessionStore/helpers';
import {
  cleanupVisualBuilder,
  setupVisualBuilder,
} from './components/VisualBuilder';

withCatchException(async function initializeBento() {
  let injectablesContainer: HTMLDivElement | undefined;
  let lastSettings: BentoSettings | undefined;
  const trackDuplicatedSidebarOnce = once(
    () => void trackDiagnostics(DiagnosticEventNames.multipleSidebars)
  );

  const DIAGNOSTICS_SAMPLE_RATE = Number.parseFloat(
    process.env.VITE_PUBLIC_DIAGNOSTICS_SAMPLE_RATE || '0.01'
  );

  class BentoAirTraffic extends BentoWebComponent {
    root = BentoAirTrafficElement;
  }

  class BentoEmbed extends BentoWebComponent {
    root = BentoInlineElement;

    static get observedAttributes() {
      return super.observedAttributes.concat(['embedid']);
    }
  }

  class BentoSidebar extends BentoWebComponent {
    root = BentoSidebarElement;

    static get observedAttributes() {
      return super.observedAttributes.concat(['container']);
    }
  }

  class BentoContext extends BentoWebComponent {
    root = BentoContextElement;
  }
  class BentoVisualTag extends BentoWebComponent {
    root = BentoVisualTagElement;
  }
  class BentoModal extends BentoWebComponent {
    root = BentoModalElement;
  }

  class BentoBanner extends BentoWebComponent {
    root = BentoBannerElement;

    static get observedAttributes(): string[] {
      return super.observedAttributes.concat(['container']);
    }
  }

  class BentoTooltip extends BentoWebComponent {
    root = BentoTooltipElement;
  }

  class BentoAutoCompleteInteractions extends BentoWebComponent {
    root = BentoAutoCompleteInteractionsElement;
  }

  class BentoInlineEmbeds extends BentoWebComponent {
    root = BentoInlineInjectorElement;
  }

  async function trackDiagnostics(event: string, payload: any = {}) {
    if (
      Math.random() <= DIAGNOSTICS_SAMPLE_RATE &&
      window.bentoSettings?.appId
    ) {
      debugMessage(`[BENTO] trackDiagnostics: ${event}`, payload);
      await sendDiagnostics({
        appId: window.bentoSettings.appId,
        event,
        ...payload,
      });
    }
  }

  function validateSettings(
    settings: BentoSettings
  ): asserts settings is BentoSettings {
    if (!settings) {
      throw new Error('No Bento settings found on "window.bentoSettings"');
    }

    // Validate against soft limits and just warn instead of failing
    assertBentoSettings(settings);
  }

  function cleanup() {
    cleanupVisualBuilder();
    resetPersistedValues();
    airTrafficStoreManager.shutdown();
    airTrafficStore.persist.clearStorage();
    sessionStoreManager.shutdown();
    sessionStore.persist.clearStorage();
    sidebarStoreManager.shutdown();
    mainStoreManager.shutdown();
    mainStore.persist.clearStorage();
    closeGraphql();
    injectablesContainer?.remove(); // safely attempts its removal
    injectablesContainer = undefined;
    lastSettings = undefined;
    if (window.Bento) {
      window.Bento.initialized = false;
    }
  }

  async function reset() {
    if (
      /**
       * If Bento was previously initialized and lastSettings are either not set or
       * account/user has changed, then we need to fully cleanup before attempting to
       * re-initialize.
       */
      window.Bento?.initialized &&
      (!lastSettings ||
        window.bentoSettings?.accountUser?.id !==
          lastSettings.accountUser?.id ||
        window.bentoSettings?.account?.id !== lastSettings.account?.id)
    ) {
      debugMessage('[BENTO] Completely resetting...');
      cleanup();
    } else if (
      /**
       * If Bento was previously initialized but the injectables container is not anymore
       * present on the document.body, then we can simply re-inject the components.
       */
      window.Bento?.initialized &&
      !document.getElementById(INJECTABLES_CONTAINER_ID)
    ) {
      debugMessage('[BENTO] Resetting components...');
      injectablesContainer = undefined;
      setupComponents();
      if (sessionStore.getState()?.uiSettings?.injectSidebar) {
        autoInjectSidebar(document.getElementById(INJECTABLES_CONTAINER_ID));
      }
      return true; // prevents a fuller initialization
    } else if (
      /**
       * If Bento was previously initialized, `window.bentoSettings` is still set and
       * account/User ids are the same, then `reset` shouldn't have been called.
       *
       * This means this will behave just like calling `window.Bento.initialize()` and that
       * is probably what the customer should have done.
       */
      window.Bento?.initialized &&
      window.bentoSettings
    ) {
      trackDiagnostics(DiagnosticEventNames.unnecessaryReset);
    }

    return initialize();
  }

  async function identify(
    bentoSettings: BentoSettings,
    autoIdentify?: boolean
  ): Promise<boolean> {
    /**
     * Whether or not we should fully re/initialize stores.
     * This should be set to true for the first initialization or whenever
     * account/User changes.
     */
    let shouldInitializeStores = true;

    try {
      if (lastSettings) {
        if (isEqual(lastSettings, bentoSettings)) {
          // eslint-disable-next-line no-console
          console.warn(
            '[BENTO] Duplicate identify detected. window.Bento.initialize() should only be called once on page load unless the user or account attributes change.'
          );
          trackDiagnostics(DiagnosticEventNames.duplicateIdentify);
          return false;
        } else if (
          lastSettings.account?.id === bentoSettings?.account?.id &&
          lastSettings.accountUser?.id === bentoSettings?.accountUser?.id
        ) {
          // if the account/User are the same, we don't want to re-initialize stores
          shouldInitializeStores = false;
        }
      }

      // save the last settings so we can check for duplicate calls
      // Note: this is cleaned up in `cleanup()` if anything fails so identify
      // can be retried with the same settings later
      lastSettings = cloneDeep(bentoSettings);
      validateSettings(bentoSettings);
      window.bentoSettings = bentoSettings;
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(
        `[BENTO] Could not identify. Invalid bentoSettings: ${e.message}`
      );
      trackDiagnostics(DiagnosticEventNames.validationFailure);
      cleanup();
      return false;
    }

    // Set or refreshes Bento initialization ID since this will result
    // in another identify request being sent to the server and therefore should
    // always be considered a new "instance".
    refreshBentoInitID(window.bentoSettings.accountUser.id);

    // Initialize airTraffic, session & sidebar stores
    if (shouldInitializeStores) {
      sessionStoreManager.initialize();
      airTrafficStoreManager.initialize();
      sidebarStoreManager.initialize();
    }

    try {
      const [identified, cacheHit] = await handleIdentify({
        ...bentoSettings,
        autoIdentify,
      });

      if (!identified) {
        cleanup();
        return false;
      }

      // Initialize the mainStore. This needs to happen as soon after the
      // identify request as possible to ensure the subscriptions are set up
      // before the identify checks job is complete in order to handle the
      // availableGuidesChanged event triggered by that job
      if (shouldInitializeStores) {
        mainStoreManager
          .initialize(
            bentoSettings.account.id,
            bentoSettings.accountUser.id,
            cacheHit
          )
          .then(() => {
            if (window?.Bento) {
              window.Bento.initialized = true;
            }

            /**
             * In case the Chrome extension is installed, this sets Bento up for starting a
             * visual builder session in case one is supposed to happen.
             *
             * NOTE: The mainStore manager is ultimately responsible for special casing Bento's initialization so that
             * we don't leak live guides into the editor session.
             *
             * WARNING: This needs to happen after the mainStore is fully initialized, otherwise we run the risk of
             * receiving preview data before Bento is fully initialized, causing data to be missing.
             *
             * @todo remove timers
             * @todo make conditional after D+30
             */
            setupVisualBuilder();
            // console.time('isVisualBuilderSession');
            // isVisualBuilderSession(WYSIWYG_CHROME_EXTENSION_ID).then(
            //   async (is) => {
            //     console.timeEnd('isVisualBuilderSession');
            //     if (is) setupVisualBuilder();
            //   }
            // );
          })
          .catch((e) => {
            catchException(e as Error, 'MainStore/Initialize');
            cleanup();
          });
      }
    } catch (e) {
      catchException(e as Error, 'Identify');
      cleanup();
      return false;
    }

    return true;
  }

  function setupComponents() {
    debugMessage('[BENTO] Setting up components');

    try {
      if (!window.customElements.get('bento-air-traffic')) {
        window.customElements.define('bento-air-traffic', BentoAirTraffic);
      }

      if (!window.customElements.get('bento-embed')) {
        window.customElements.define('bento-embed', BentoEmbed);
      }

      if (!window.customElements.get('bento-sidebar')) {
        window.customElements.define('bento-sidebar', BentoSidebar);
      }

      if (!window.customElements.get('bento-context')) {
        window.customElements.define('bento-context', BentoContext);
      }

      if (!window.customElements.get('bento-visual-tag')) {
        window.customElements.define('bento-visual-tag', BentoVisualTag);
      }

      if (!window.customElements.get('bento-modal')) {
        window.customElements.define('bento-modal', BentoModal);
      }

      if (!window.customElements.get('bento-banner')) {
        window.customElements.define('bento-banner', BentoBanner);
      }

      if (!window.customElements.get('bento-auto-complete-interactions')) {
        window.customElements.define(
          'bento-auto-complete-interactions',
          BentoAutoCompleteInteractions
        );
      }

      if (!window.customElements.get('bento-tooltip')) {
        window.customElements.define('bento-tooltip', BentoTooltip);
      }

      if (!window.customElements.get('bento-inline-embeds')) {
        window.customElements.define('bento-inline-embeds', BentoInlineEmbeds);
      }

      const sidebarEls = document.getElementsByTagName('bento-sidebar');
      if (sidebarEls.length > 0) {
        const firstSidebarEl = sidebarEls[0];
        let siblingEl = firstSidebarEl.nextSibling;
        while (siblingEl && (siblingEl as any).localName === 'bento-sidebar') {
          const currentEl = siblingEl;
          currentEl.remove();
          siblingEl = firstSidebarEl.nextSibling;
          trackDuplicatedSidebarOnce();
        }
      }
    } catch (e) {
      catchException(e as Error, 'Component Setup');
    }

    // set up container where all context tags, and maybe other things will live
    if (!injectablesContainer) {
      injectablesContainer = document.createElement('div');
      injectablesContainer.setAttribute('id', INJECTABLES_CONTAINER_ID);
      injectablesContainer.innerHTML = `${BENTO_MESSAGE}
<a href="https://www.trybento.co"  class="powered-by-bento" style="visibility: hidden; opacity: 0; display: none;">
  Onboarding powered by Bento!
</a>
      `;
      [
        'position',
        'margin',
        'padding',
        'display',
        'transform',
        'opacity',
        'visibility',
      ].forEach((cssProperty) => {
        injectablesContainer!.style[cssProperty] = 'initial';
      });
      document.body.appendChild(injectablesContainer);
    }

    if (injectablesContainer) {
      [
        'bento-air-traffic',
        'bento-context',
        'bento-modal',
        'bento-banner',
        'bento-auto-complete-interactions',
        'bento-inline-embeds',
      ].forEach((element) => {
        if (!injectablesContainer!.querySelector(element)) {
          debugMessage(`[BENTO] adding ${element} component`);
          const bentoElement = document.createElement(element);
          injectablesContainer!.appendChild(bentoElement);
        }
      });
    }

    debugMessage('[BENTO] Component setup complete');
  }

  const initializeCalls: Date[] = [];
  const RAPID_INITIALIZE_DIAGNOSTIC_COUNT = 5;
  const RAPID_INITIALIZE_DIAGNOSTIC_WINDOW = 10_000; // 10s
  const EXCESSIVE_INITIALIZATION_DIAGNOSTIC_COUNT = 10;

  async function initialize(autoInitialize = false) {
    debugMessage('[BENTO] window.Bento.initialize() called', {
      autoInitialize,
    });

    if (typeof autoInitialize !== 'boolean') {
      // eslint-disable-next-line no-console
      console.warn(
        '[BENTO] Calling `window.Bento.initialize` passing in the `window.bentoSettings` object has been deprecated. Please set `window.bentoSettings` and then call `window.Bento.initialize()` instead as instructed in our docs: https://docs.trybento.co/docs/getting-started/installation'
      );
      autoInitialize = false;
    }

    if (!window.bentoSettings) {
      // eslint-disable-next-line no-console
      console.warn(
        '[BENTO] No "bentoSettings" property found on the global object'
      );
      return false;
    }
    initializeCalls.push(new Date());
    if (
      initializeCalls.length === RAPID_INITIALIZE_DIAGNOSTIC_COUNT &&
      initializeCalls[4].getTime() - initializeCalls[0].getTime() <
        RAPID_INITIALIZE_DIAGNOSTIC_WINDOW
    ) {
      trackDiagnostics(DiagnosticEventNames.rapidInitializations);
    }
    if (initializeCalls.length === EXCESSIVE_INITIALIZATION_DIAGNOSTIC_COUNT) {
      trackDiagnostics(DiagnosticEventNames.excessiveInitializations);
    }

    /**
     * Ahead of time, we dispatch a message to check whether we're in a visual builder session.
     *
     * This is intentionally detached so that by the time we actually need to know, we already have
     * the response back. And since the result of this method is memoized, we can safely call it
     * many times without duplicating the request.
     */
    isVisualBuilderSession(WYSIWYG_CHROME_EXTENSION_ID);

    /**
     * WARNING: This needs to happen before the identify call, otherwise we run the risk of
     * attempting to remove an auto-injected sidebar added right after hydrating the session store
     * from client-side persistence, since that will happen much sooner compared to a fresh start.
     */
    setupComponents();

    const identified = await identify(window.bentoSettings, autoInitialize);

    // this is used by previews to know when everything is finished
    // initializing so it can add the preview data to the main store
    window.dispatchEvent(new CustomEvent('bento-initialized'));

    return identified;
  }

  function ingestPreviewData(
    previewId: string,
    data: PreviewDataPack,
    previewFormFactor: EmbedFormFactor
  ) {
    sessionStore.getState().setPreviewSession(previewId, data);
    if (data.guide) {
      sidebarStore.getState().createSidebarState(previewId, true);
      mainStore
        .getState()
        .setPreviewGuide(
          previewId,
          data.guide,
          data.additionalGuides,
          previewFormFactor
        );
      if (data.injectInlineEmbed) {
        mainStore.getState().setPreviewInlineEmbed({
          entityId: previewId as InlineEmbedEntityId,
          url: '',
          wildcardUrl: '',
          elementSelector: '',
          position: InjectionPosition.after,
          topMargin: 0,
          rightMargin: 0,
          bottomMargin: 0,
          leftMargin: 0,
          guide: data.guide.entityId,
          padding: 4,
          borderRadius: 0,
          previewId,
        });
      }
    }
    if (data.branchingPaths) {
      mainStore.getState().dispatch({
        type: 'branchingPathsChanged',
        branchingPaths: data.branchingPaths,
      });
    }
  }

  function expirePreviewData(previewId: string) {
    sessionStore.getState().removePreviewSession(previewId);
    mainStore.getState().removePreviewGuide(previewId);
    mainStore
      .getState()
      .removePreviewInlineEmbed(previewId as InlineEmbedEntityId);
    sidebarStore.getState().removeSidebarState(previewId);
  }

  if (window) {
    window.Bento = {
      /** @deprecated use `initialize` instead, will be removed on June 1, 2023 */
      identify: (bentoSettings) => {
        // eslint-disable-next-line no-console
        console.warn(
          '[BENTO] `window.Bento.identify()` is deprecated and will be removed on June 1, 2023. Please use `window.Bento.initialize()` instead as instructed in our docs: https://docs.trybento.co/docs/getting-started/installation'
        );
        if (bentoSettings) {
          window.bentoSettings = bentoSettings;
          trackDiagnostics(DiagnosticEventNames.deprecatedIdentifyCall);
        }
        return initialize();
      },
      initialized: false,
      initialize: withCatchException(initialize, 'initialize'),
      reset: withCatchException(reset, 'reset'),
      setPreviewData: withCatchException(ingestPreviewData, 'setPreviewData'),
      removePreviewData: withCatchException(
        expirePreviewData,
        'removePreviewData'
      ),
      sdk,
    } as BentoInstance;

    /**
     * Dispatches a window event to signal that Bento script has finished loading.
     * This is useful for custom implementations that require knowing when Bento becomes available.
     */
    window.dispatchEvent(new CustomEvent('bento-loaded'));

    if (window.bentoSettings) {
      const initialized = await withCatchException(
        () => initialize(true),
        'autoInitialize'
      )();
      if (!initialized) {
        // eslint-disable-next-line no-console
        console.error('[BENTO] Initialization failed');
      }
    }
  }
}, 'JS Load')();
