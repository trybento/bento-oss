import { once } from 'lodash';

import { makeLogger } from '~src/utils/debug';
import {
  addScript,
  canLoadScript,
  pageAlreadyHasBento,
} from '~src/utils/injection';
import { ExtensionSettings } from '~types';

const EMBED_SRC = process.env.PLASMO_PUBLIC_EMBED_SRC;

const logger = makeLogger('scriptManager');
const messagingLogger = makeLogger('scriptManager.messaging');

function onMessageReceived(namespace: string) {
  return (event: Event) => {
    messagingLogger(`[${namespace}] Got an event:`, event);
  };
}

function signalScriptInjectionFailed(_cause?: Error | Event | string) {
  document.dispatchEvent(
    new CustomEvent('bentoExtension-scriptInjectionFailed'),
  );
}

const dispatchFailedScriptOnce = once(signalScriptInjectionFailed);

/**
 * Keep a record of the embed script element so we can remove it later.
 */
let embedScript: HTMLScriptElement;

/**
 * Checks whether we can/should inject Bento into the page. If successful, this will effectively
 * set `window.bentoSettings` and attach the Bento script to the page, which should automatically
 * initialize itself once loaded.
 *
 * NOTE: We don't validate whether the given bentoSettings are valid, but the actual Bento
 * script should already do that anyway.
 */
async function initializeBento(bentoSettings: any) {
  if (!bentoSettings) {
    logger('Failed to initialize due to missing settings');
    return;
  }

  if (
    window.bentoSettings &&
    !(window.bentoSettings as ExtensionSettings['bentoSettings'])
      .chromeExtension
  ) {
    logger('Existing window.bentoSettings detected, refusing to override');
    return;
  }

  if (!(await canLoadScript(EMBED_SRC))) {
    logger('Potential CSP issue detected. Attempting to load Bento anyway');
    dispatchFailedScriptOnce();
  }

  const scriptId = 'bento-embedScript';
  const isAlreadyLoaded = document.querySelector(`#${scriptId}`);
  const pageUsesBento = pageAlreadyHasBento(EMBED_SRC);

  if (isAlreadyLoaded || pageUsesBento) {
    logger('Refusing to attach Bento since its already there');
    return;
  }

  logger('Attaching Bento');

  // Set bento settings and enable debugging
  window.bentoSettings = bentoSettings;
  window.debugBento = true;

  embedScript = document.createElement('script');
  embedScript.id = scriptId;
  embedScript.src = EMBED_SRC;
  embedScript.onerror = (event, _s, _l, _c, error) => {
    logger('Permanently failed to load the Bento script');
    dispatchFailedScriptOnce(error || event);
  };
  embedScript.onload = () => {
    // tentatively initialize once loaded, otherwise should happen automatically
    window.Bento?.initialize();
  };
  embedScript.type = 'module';
  addScript(embedScript);
}

/**
 * Unset `window.bentoSettings`, reset and remove the Bento script from the page.
 */
function resetBento() {
  logger('Removing Bento');
  // unset bento settings and debugging
  delete window.bentoSettings;
  delete window.debugBento;
  // (async) reset bento and remove the script from the page
  window?.Bento.reset().then(() => {
    embedScript?.remove();
    embedScript = undefined;
  });
}

/**
 * Handle messages meant for the ScriptManager.
 *
 * @todo document all other possible messages so that types/structure is consistent across apps
 */
function handleScriptManagerMessage(event: MessageEvent) {
  try {
    const innerLogger = onMessageReceived('handleScriptManagerMessage');
    switch (event.data?.action) {
      case 'bento.scriptManager.initialize':
        innerLogger(event);
        initializeBento(event.data.bentoSettings);
        break;

      case 'bento.scriptManager.reset':
        innerLogger(event);
        resetBento();
        break;

      default:
        // message is likely not for us, just skip
        break;
    }
  } catch (error) {
    logger('An error occurred', error);
  }
}

window.addEventListener('message', handleScriptManagerMessage);
