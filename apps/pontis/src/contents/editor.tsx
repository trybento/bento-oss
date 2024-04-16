import { extendTheme, useBoolean } from '@chakra-ui/react';
import createCache from '@emotion/cache';
import { ThemeProvider } from 'bento-common/components/ThemeProvider';
import theme from 'bento-common/frontend/theme';
import { VisualBuilderSessionState } from 'bento-common/types';
import styleText from 'data-text:~src/ui/styles/styles.css';
import { once } from 'lodash';
import { PlasmoCSConfig, PlasmoGetShadowHostId, PlasmoGetStyle } from 'plasmo';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import ScriptInjectionErrorModal from '~src/components/ScriptInjectionErrorModal';
import { makeLogger } from '~src/utils/debug';
import { Session } from '~types';

import EditorWrapper from '../components/EditorWrapper';
import { CSUI_ELEMENT_ID, SHADOW_CONTAINER_ELEMENT_ID } from '../constants';

const logger = makeLogger('editor');

const modifiedTheme = extendTheme({
  ...theme,
  styles: {
    global: {
      [`#${SHADOW_CONTAINER_ELEMENT_ID}`]: {
        ...theme.styles.global.body,
        fontFamily: 'body',
      },
    },
  },
});

const styleElement = document.createElement('style');

const styleCache = createCache({
  key: 'plasmo-emotion-cache',
  prepend: true,
  container: styleElement,
});

/**
 * Just once, signals to the BGSW that we're in a WYSIWYG session.
 */
const pingOnce = once(() => {
  // Signals to the background script that we're in a WYSIWYG session
  chrome.runtime.sendMessage({ type: 'wysiwygPing' });
});

const Editor: React.FC = () => {
  const [session, setSession] = useState<Session | undefined>();
  const [failedToLoadScript, setFailedToLoadScript] = useBoolean(false);
  const portalRoot = useMemo<HTMLElement>(
    () =>
      document
        .querySelector(`#${CSUI_ELEMENT_ID}`)
        ?.shadowRoot.querySelector(`#${SHADOW_CONTAINER_ELEMENT_ID}`) ||
      document.body,
    [],
  );

  useEffect(() => {
    try {
      // Sets up an event listener to receive the session
      chrome.runtime.onMessage.addListener(
        (message, _sender, _sendResponse) => {
          if (message?.type === 'session' && message.session) {
            setSession(message.session);
          }
        },
      );

      // Asks for the session
      chrome.runtime.sendMessage({
        action: 'getSession',
      });
    } catch (error) {
      console.error('Unable to retrieve Visual Builder session');
    }
  }, []);

  /**
   * Listens for the Bento script failing to load.
   * When fired, this will show the associated error modal.
   */
  useEffect(() => {
    const cb = async (_event: Event) => {
      logger('Received signal that Bento script failed to load.');
      setFailedToLoadScript.on();
    };
    document.addEventListener('bentoExtension-scriptInjectionFailed', cb);

    return () => {
      document.removeEventListener('bentoExtension-scriptInjectionFailed', cb);
    };
  }, []);

  const cancelAndClose = useCallback(() => {
    void chrome.runtime.sendMessage({
      action: 'closeSession',
      payload: {
        state: VisualBuilderSessionState.Cancelled,
      },
    });
  }, []);

  if (!session) {
    return null;
  }

  // Signals to the background script that we're in a WYSIWYG session
  pingOnce();

  return (
    <ThemeProvider
      cache={styleCache}
      theme={modifiedTheme}
      portalRoot={portalRoot}>
      {!failedToLoadScript && <EditorWrapper session={session} />}
      {failedToLoadScript && (
        <ScriptInjectionErrorModal onClose={cancelAndClose} />
      )}
    </ThemeProvider>
  );
};

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  css: ['../fonts.css'],
};

export const getStyle: PlasmoGetStyle = () => {
  const customStyles = document.createElement('style');

  customStyles.textContent = styleText;
  styleElement.append(customStyles);

  return styleElement;
};

export const getShadowHostId: PlasmoGetShadowHostId = () => CSUI_ELEMENT_ID;

export default Editor;
