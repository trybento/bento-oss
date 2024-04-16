import {
  CheckVersionMessage,
  WysiwygExtensionMessageConfig,
  WysiwygExtensionMessageType,
} from '../../types/wysiwyg';
import { getBrowserName } from '../../utils/browser';
import { memoize } from '../../utils/lodash';
import { genTraceId } from '../../utils/trace';

/**
 * Whether debugging is enabled.
 * For testing purposes, you can enable either enable this manually or
 * the Chrome Extension might enable it for yourself.
 */
let debugEnabled = true;

export const sendMessage = <
  M extends WysiwygExtensionMessageConfig<any>,
  Return = M['response']
>({
  extensionId,
  message,
  onResponse,
}: {
  extensionId: string;
  message: Omit<M, 'response'>;
  onResponse: (response: M['response']) => Promise<Return> | Return;
}): Promise<Return> => {
  return new Promise((resolve, reject) => {
    try {
      if (getBrowserName() === 'chrome') {
        if (typeof chrome.runtime?.sendMessage === 'function') {
          chrome.runtime.sendMessage<Omit<M, 'response'>, M['response']>(
            extensionId,
            message,
            async (response) => {
              const result = await onResponse(response);

              if (debugEnabled) {
                console.debug(
                  `[BENTO] (${message.type}) message received (host:root <- chrome extension):`,
                  { message, response }
                );
              }

              resolve(result);
            }
          );
        } else {
          reject(new Error('chrome.runtime.sendMessage is not available'));
        }
      } else {
        reject(new Error('Browser not supported or extension is missing'));
      }
    } catch (err) {
      // Fail silently for server's context, otherwise error
      if (typeof window !== 'undefined' && debugEnabled) {
        console.error(
          `[BENTO] Error communicating with browser extension`,
          err
        );
      }
      reject(err);
    }
  });
};

/**
 * Allows any origin to detect whether the browser extension is installed.
 * NOTE: If coming from a Bento app, use `checkVersion` instead for increased speed/assertion.
 */
export async function isChromeExtensionInstalled(extensionId: string) {
  try {
    if (getBrowserName() === 'chrome') {
      const response = await fetch(
        `chrome-extension://${extensionId}/resources/test.json`
      );
      return response.status === 200;
    }
    return false;
  } catch (err) {
    return false;
  }
}

/**
 * @todo verify extension version to determine compatibility.
 */
export function checkVersion(extensionId: string) {
  return sendMessage<
    CheckVersionMessage,
    [enabled: boolean, version: string | undefined]
  >({
    extensionId,
    message: { type: WysiwygExtensionMessageType.CheckVersion, payload: {} },
    onResponse: (response) => {
      const version = response.version;
      const debug = response.debug;

      if (version) {
        if (typeof debug !== 'undefined' && debug !== debugEnabled) {
          debugEnabled = debug;
        }
        return [true, version];
      }
      return [false, undefined];
    },
  });
}

export const launchVisualBuilderSession = ({
  url,
  extensionId,
  sessionId,
  accessToken,
  appId,
}: {
  url: string;
  extensionId: string;
  sessionId: string;
  accessToken: string;
  appId: string;
}) => {
  return new Promise((resolve, reject) => {
    try {
      if (getBrowserName() === 'chrome') {
        chrome.runtime.sendMessage(
          extensionId,
          {
            type: 'launchVisualBuilderSession',
            data: {
              url,
              sessionId,
              accessToken,
              appId,
            },
          },
          async (response) => {
            resolve(response);
          }
        );
      } else {
        reject(new Error('Browser not supported or extension is missing'));
      }
    } catch (err) {
      if (typeof window !== 'undefined' && debugEnabled) {
        console.error(
          `[BENTO] Error communicating with browser extension`,
          err
        );
      }
      reject(err);
    }
  });
};

/**
 * Checks if the current session is a visual builder session.
 *
 * NOTE: The result of this function is memoized since whether or not
 * we're in a builder session isn't supposed to change during the runtime.
 *
 * WARNING: Due to `externally_connectable` constraints on Chrome, the messaging between
 * the embed and the extension is being relayed through the CS. Once Chrome releases a version
 * that allows any domains to communicate with the extension, we can remove the relay and
 * communicate directly instead. See the chromium issue for more details.
 *
 * @see https://issues.chromium.org/issues/40500507
 */
export const isVisualBuilderSession = memoize(
  async (
    /**
     * The extension ID of the Chrome extension.
     */
    extensionId: string,
    /**
     * The timeout in milliseconds before we assume that we're NOT in a visual builder session.
     *
     * NOTE: This should only affect users WITH the extension installed, since users WITHOUT the
     * extension will fail the "installed" check sooner. Regardless, this is a safety mechanism
     * to make sure the WYSIWYG experience for Admins will always be consistent but still protect
     * from leaving the promise handing indefinitely.
     *
     * @default 1_000 (1 second)
     */
    timeoutInMs = 1_000
  ) => {
    return new Promise<boolean>((resolve, _reject) => {
      try {
        let isResolvedOrCancelled = false;
        let timeout = 0;

        /**
         * Checks whether the extension is NOT installed.
         * If it's not installed, we can safely assume that we're NOT in a builder session.
         * If it is installed, we'll wait for a response from the extension.
         */
        isChromeExtensionInstalled(extensionId).then((installed) => {
          if (!isResolvedOrCancelled && installed === false) {
            isResolvedOrCancelled = true;
            window.clearTimeout(timeout);
            resolve(false);
          }
        });

        /**
         * Checks whether we're in a visual builder session.
         * If we are, we'll get a response from the extension.
         */
        sendViaRelay({
          action: 'isVisualBuilderSession',
        }).then((confirmed: unknown) => {
          if (!isResolvedOrCancelled) {
            isResolvedOrCancelled = true;
            window.clearTimeout(timeout);
            resolve(confirmed === true);
          }
        });

        /**
         * If we haven't reached a resolution after the timeout period,
         * we'll assume that we're NOT in a visual builder session.
         */
        timeout = window.setTimeout(() => {
          if (!isResolvedOrCancelled) {
            isResolvedOrCancelled = true;
            resolve(false);
            console.error(
              `[BENTO] Visual builder session check timed out after ${timeoutInMs}ms. If you're in a visual builder session, you won't be able to see any previews. Please close this window and restart the builder.`
            );
          }
        }, timeoutInMs);
      } catch (error) {
        resolve(false);
      }
    });
  }
);

export const isSameOrigin = (event: MessageEvent, req: any): req is any =>
  !req.__internal &&
  event.source === globalThis.window &&
  event.data.action === req.action &&
  (req.relayId === undefined || event.data.relayId === req.relayId);

export const sendViaRelay = (req: any) => {
  return new Promise((resolve, _reject) => {
    const instanceId = genTraceId();
    const abortController = new AbortController();

    // @ts-ignore
    window.addEventListener(
      'message',
      (event: MessageEvent<any>) => {
        if (
          isSameOrigin(event, req) &&
          event.data.relayed &&
          event.data.instanceId === instanceId
        ) {
          resolve(event.data.body);
          abortController.abort();
        }
      },
      // @ts-ignore
      { signal: abortController.signal }
    );

    window.postMessage(
      {
        ...req,
        instanceId,
      } as any,
      '*'
    );
  });
};
