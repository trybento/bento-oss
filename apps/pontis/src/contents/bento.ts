import { PlasmoCSConfig } from 'plasmo';
import MANAGER_SRC from 'url:~../resources/manager.ts';

import { makeLogger } from '~src/utils/debug';
import { addScript } from '~src/utils/injection';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

const logger = makeLogger('content');
const messagingLogger = makeLogger('content.messaging');

const EMBED_SRC = process.env.PLASMO_PUBLIC_EMBED_SRC;

if (!EMBED_SRC) {
  throw new Error('Missing embed script URL');
}

/**
 * Indicates whether or not the current page has loaded, starts as false.
 *
 * This is used to determine whether we can already inject Bento on the page,
 * or if we should still wait a bit more to prevent overriding an existing Bento instance
 * that is still loading.
 */
let hasPageLoaded: boolean = false;

let managerScript: HTMLScriptElement;

/** Inject the embed script helper */
function attachManager() {
  if (managerScript) return;

  logger('Attaching script manager');

  const scriptId = 'bento-managerScript';
  managerScript = document.createElement('script');
  managerScript.id = scriptId;
  managerScript.src = MANAGER_SRC;
  managerScript.onerror = (event, _s, _l, _c, error) => {
    logger('Failed to load the script manager', error || event);
  };
  managerScript.type = 'module';
  addScript(managerScript);
}

function handleMessage(
  message: any,
  sender: chrome.runtime.MessageSender,
  _sendResponse: (response: any) => void,
) {
  messagingLogger('Got a message:', { message, sender });

  try {
    switch (message?.type) {
      case 'initialize':
        const cb = () => {
          window.postMessage(
            {
              action: 'bento.scriptManager.initialize',
              bentoSettings: message.settings.bentoSettings,
            },
            '*',
          );
        };

        if (hasPageLoaded) cb();
        else window.addEventListener('load', cb, false);

        break;

      case 'reset':
        window.postMessage({ action: 'bento.scriptManager.reset' }, '*');
        break;
    }
  } catch (error) {
    logger('An error occurred', error);
  }
}

/**
 * @todo conditionally attach Bento, only when needed
 */
const init = () => {
  try {
    attachManager();
    // Attach the message listener

    chrome.runtime.onMessage.addListener(handleMessage);
  } catch (error) {
    logger('An error occurred', error);
  }
};

window.addEventListener(
  'load',
  () => {
    logger('Page has loaded');
    hasPageLoaded = true;
  },
  false,
);

init();
