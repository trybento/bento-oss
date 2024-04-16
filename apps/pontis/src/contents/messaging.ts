import { isSameOrigin } from 'bento-common/features/wysiwyg/messaging';
import type { PlasmoCSConfig } from 'plasmo';

import { makeLogger } from '~src/utils/debug';

const logger = makeLogger('messaging');
const relayLogger = makeLogger('messaging.relayHandler');

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  run_at: 'document_start',
};

/**
 * Helper function to relay messages from the page to the BGSW and back.
 */
export const relay = (
  req: any,
  onMessage: typeof chrome.runtime.sendMessage,
) => {
  const relayHandler = async (event: MessageEvent<any>) => {
    try {
      if (event.data?.action === 'isVisualBuilderSession') {
        relayLogger('Got a message:', event);
      }

      if (isSameOrigin(event, req) && !event.data.relayed) {
        const relayPayload = {
          action: req.action,
          relayId: req.relayId,
          body: event.data.body,
        };

        relayLogger('Relaying to background', relayPayload);

        const backgroundResponse = await onMessage?.(relayPayload);

        relayLogger('Got response from background', backgroundResponse);

        window.postMessage(
          {
            action: req.action,
            relayId: req.relayId,
            instanceId: event.data.instanceId,
            body: backgroundResponse,
            relayed: true,
          },
          '*',
        );
      }
    } catch (error) {
      logger('An error occurred', error);
    }
  };

  window.addEventListener('message', relayHandler);
  return () => window.removeEventListener('message', relayHandler);
};

relay({ action: 'isVisualBuilderSession' }, chrome.runtime.sendMessage);

logger('Messaging is ready');

window.addEventListener('unhandledRejection', (error) => {
  logger('An error occurred', error);
});

window.addEventListener('uncaughtException', (error) => {
  logger('An error occurred', error);
});
