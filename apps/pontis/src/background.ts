import {
  VisualBuilderSessionState,
  WysiwygEditorState,
} from 'bento-common/types';
import { FullGuide } from 'bento-common/types/globalShoyuState';
import { debounce } from 'lodash';
import { Client, fetchExchange } from 'urql';

import { ExtensionMessage } from '~types';

import {
  UpdateVisualBuilderSessionMutation,
  UpdateVisualBuilderSessionMutationDocument,
  UpdateVisualBuilderSessionMutationVariables,
} from './graphql/mutations/generated/UpdateVisualBuilderSession';
import {
  VisualBuilderSessionQuery,
  VisualBuilderSessionQueryDocument,
  VisualBuilderSessionQueryVariables,
} from './graphql/queries/generated/VisualBuilderSession';
import { getCurrentTab, getHostnameOfTab } from './utils/browser';
import { isDebugEnabled, makeLogger } from './utils/debug';
import { getVersion } from './utils/env';
import { canEnable } from './utils/injection';
import { getSettings, setAppId } from './utils/settings';

const IS_SAVING_CHECK_MS = 100;
const logger = makeLogger('background');
const messagingLogger = makeLogger('background.messaging');

const onMessageReceived = (namespace: string) => {
  return (message: any) => {
    messagingLogger(`[${namespace}] Got a message:`, message);
  };
};

/**
 * Keeps a record of which tabs have been launched with the visual builder.
 * Useful to determine if we're in a visual builder session or not.
 */
const builderTabsMap = new Map<number, boolean>();

/**
 * Keeps a record of which tabs have Bento manually/auto-injected.
 * Useful to handle re-injection on page changes, etc.
 */
const injectionTabsMap = new Map<
  number,
  {
    /** Which hostname is associated with the tab, if any. */
    hostname?: string;
    /**
     * Indicates script injection should be active for the tab.
     * NOTE: This will always be true, otherwise we simply remove the tab from the map.
     */
    state: true;
  }
>();

const getSession = async ({
  client,
  visualBuilderSessionEntityId,
}: {
  client: Client;
  visualBuilderSessionEntityId: string;
}) => {
  const response = await client
    .query<VisualBuilderSessionQuery, VisualBuilderSessionQueryVariables>(
      VisualBuilderSessionQueryDocument,
      {
        visualBuilderSessionEntityId,
      },
    )
    .toPromise();

  if (!response.data) {
    return null;
  }

  return response.data;
};

const saveSession = async ({
  client,
  visualBuilderSessionEntityId,
  progressData,
  previewData,
  state,
}: {
  client: Client;
  visualBuilderSessionEntityId: string;
  progressData?: WysiwygEditorState<unknown>;
  previewData?: FullGuide;
  state?: VisualBuilderSessionState;
}) => {
  const result = await client.mutation<
    UpdateVisualBuilderSessionMutation,
    UpdateVisualBuilderSessionMutationVariables
  >(UpdateVisualBuilderSessionMutationDocument, {
    input: { visualBuilderSessionEntityId, progressData, previewData, state },
  });

  return result;
};

const saveSessionDebounced = debounce(saveSession, 500, { maxWait: 150 });

const launchVisualBuilderSession = (
  {
    sessionId,
    url,
    accessToken,
    appId,
  }: {
    sessionId: string;
    url: string;
    accessToken: string;
    appId: string;
  },
  sender: chrome.runtime.MessageSender,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const client = new Client({
        url: `${process.env.PLASMO_PUBLIC_API_URL}/visual-builder/graphql`,
        exchanges: [fetchExchange],
        requestPolicy: 'network-only',
        fetchOptions: () => {
          return {
            headers: { authorization: `Bearer ${accessToken}` },
          };
        },
      });

      const tab = await chrome.tabs.create({
        url,
      });

      let isSaving = false;

      // Record tab as a visual builder tab
      builderTabsMap.set(tab.id, true);

      // Optimistically set the new appId to the extension
      void setAppId(appId);

      chrome.runtime.onMessage.addListener(
        async (message, _sender, _sendResponse) => {
          try {
            const { action, payload } = message;

            // If message is coming from some other tab, ignore
            if (!_sender.tab.id || !tab.id || _sender.tab.id !== tab.id) {
              return;
            }

            switch (action) {
              case 'getSession': {
                /**
                 * If we're currently saving, periodically recheck
                 * until we're not saving to fetch a session. This solves
                 * for a potential race condition where we're still saving
                 * but trying to read a new session.
                 */
                if (isSaving) {
                  await new Promise<void>((resolve) => {
                    const interval = setInterval(() => {
                      if (!isSaving) {
                        clearInterval(interval);
                        resolve();
                      }
                    }, IS_SAVING_CHECK_MS);
                  });
                }

                const session = await getSession({
                  client,
                  visualBuilderSessionEntityId: sessionId,
                });

                chrome.tabs.sendMessage<ExtensionMessage>(_sender.tab.id, {
                  type: 'session',
                  session: { accessToken, ...session },
                });

                break;
              }
              case 'saveSession': {
                try {
                  isSaving = true;
                  const { progressData, previewData, immediate } = payload;

                  await (immediate ? saveSession : saveSessionDebounced)({
                    client,
                    visualBuilderSessionEntityId: sessionId,
                    progressData,
                    previewData,
                  });
                } finally {
                  isSaving = false;
                }

                break;
              }
              case 'closeSession': {
                const { progressData, previewData, state } = payload;

                await saveSession({
                  client,
                  visualBuilderSessionEntityId: sessionId,
                  progressData,
                  previewData,
                  state,
                });

                // Close the tab
                await chrome.tabs.remove(tab.id);

                break;
              }
            }
          } catch (error) {
            reject(error);
          }
        },
      );

      chrome.tabs.onRemoved.addListener(async (tabId) => {
        try {
          if (tabId === tab.id) {
            resolve({ done: true });

            // Removes the tab from the record
            builderTabsMap.delete(tab.id);

            // Re-activate the Miso tab that originated the recently closed builder tab
            if (sender.tab?.id) {
              await chrome.tabs.update(sender.tab.id, { active: true });
            }
          }
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Toggle states and request snippet injection if needed
 *
 * @todo human friendly error handling
 */
export async function toggleBentoState(
  newState: boolean,
  tabOrId?: chrome.tabs.Tab | number,
) {
  if (!tabOrId) {
    tabOrId = (await getCurrentTab())?.id;
    if (!tabOrId) {
      throw new Error("Couldn't find the current active tab");
    }
  }

  const tab =
    typeof tabOrId === 'number' ? await chrome.tabs.get(tabOrId) : tabOrId;

  if (newState) {
    const settings = await getSettings();

    if (!settings?.bentoSettings?.appId) {
      throw new Error(
        'No appId configured! Please set an appId in the extension options.',
      );
    }

    chrome.tabs.sendMessage<ExtensionMessage>(tab.id, {
      type: 'initialize',
      settings,
    });

    injectionTabsMap.set(tab.id, {
      hostname: getHostnameOfTab(tab),
      state: true,
    });
  } else {
    chrome.tabs.sendMessage(tab.id, { type: 'reset' });
    injectionTabsMap.delete(tab.id);
  }
}

//
// Setup message listeners
//

/**
 * Fired when the extension receives messages from the external world.
 *
 * Useful to allow the Bento App to check which version of the extension is installed
 * or launch the WYSIWYG editor.
 */
chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    try {
      const { type, data } = message;
      let response = {};

      switch (type) {
        case 'launchVisualBuilderSession':
          launchVisualBuilderSession(data, sender).then((response) => {
            sendResponse(response);
          });

          // Indicate that the event handler will respond asynchronously
          return true;

        case 'checkVersion':
          response = { version: getVersion(), debug: isDebugEnabled() };
          break;

        default:
          // message is likely not for us, just skip
          break;
      }

      // If we have a response, send it back
      response && sendResponse(response);
    } catch (error) {
      logger('Error processing external message', error);
    }
  },
);

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
    onMessageReceived('background')(message);

    switch (message?.type || message?.action) {
      /**
       * Indicates the WYSIWYG script has loaded, therefore we should attempt
       * to inject the Bento script in case missing.
       */
      case 'wysiwygPing':
        if (sender.tab && canEnable(sender.tab)) {
          toggleBentoState(true, sender.tab);
        }
        break;

      case 'isVisualBuilderSession': {
        sendResponse(builderTabsMap.has(sender.tab.id));
        break;
      }
    }

    return false;
  } catch (error) {
    logger('An error occurred', error);
  }
});

//
// Setup event listeners
//

/**
 * Fired when the user clicks the extension icon.
 *
 * @todo support Firefox/mv2?
 * @see https://github.com/PlasmoHQ/examples/blob/main/with-background/background.ts
 */
chrome.action.onClicked.addListener(async (tab) => {
  try {
    logger('Clicked. Toggling activation state...');
    const newState = tab?.id ? !injectionTabsMap.has(tab.id) : true;

    if (newState === true && !canEnable(tab)) {
      logger('Refused to activate Bento on blocklisted URL');
      return;
    }

    await toggleBentoState(newState, tab);
  } catch (error) {
    logger('An error occurred', error);
  }
});

/**
 * When a tab gets updated this callback will run multiple
 * times with different `changeInfo` that allows us to "track"
 * what is going on.
 *
 * With that said, we should ONLY re-initialize Bento if
 * the page has finished loading and the extension was active.
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    const previousState = injectionTabsMap.get(tabId);
    const newHostname = getHostnameOfTab(tab);

    if (
      previousState?.hostname &&
      newHostname &&
      previousState.hostname !== newHostname
    ) {
      /* Always disable if we change sites completely */
      logger('Host changed, deactivating Bento');
      await toggleBentoState(false, tab);
    } else if (
      previousState?.state &&
      changeInfo.status === 'complete' &&
      previousState.hostname === newHostname &&
      canEnable(tab)
    ) {
      /* Enable "following" behavior by re-injecting if same host */
      logger('Re-activating Bento after page change');
      await toggleBentoState(true, tab);
    }
  } catch (error) {
    logger('An error occurred', error);
  }
});

/**
 * Fired when a tab is removed/closed.
 */
chrome.tabs.onRemoved.addListener(async (tabId, _removeInfo) => {
  try {
    injectionTabsMap.delete(tabId);
  } catch (error) {
    logger('An error occurred', error);
  }
});

process.on('unhandledRejection', (error) => {
  logger('An error occurred', error);
});

process.on('uncaughtException', (error) => {
  logger('An error occurred', error);
});
