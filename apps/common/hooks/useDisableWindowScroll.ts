import React, { CSSProperties, useCallback, useEffect, useRef } from 'react';

const arrowKeys = new Map([37, 38, 39, 40].map((v) => [v, true]));

type GenericEvent = (
  e: Event & Pick<React.KeyboardEvent<Element>, 'keyCode'>
) => void;

const useDisableWindowScroll = (disableScroll: boolean) => {
  const originalDocumentOverflow = useRef<CSSProperties['overflow']>('');
  const scrollDisabled = useRef<boolean>(false);
  const wheelOptions = useRef<null | boolean | AddEventListenerOptions>(null);
  const wheelEvent = useRef<string | null>(null);
  const preventDefault: GenericEvent = useCallback((e) => {
    e.preventDefault();
  }, []);

  // @ts-ignore-error
  const preventDefaultForScrollKeys: GenericEvent = useCallback((e) => {
    if (arrowKeys.has(e.keyCode)) {
      preventDefault(e);
      return false;
    }
  }, []);

  const handleDisableScroll = useCallback(() => {
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.addEventListener(
      wheelEvent.current,
      preventDefault,
      wheelOptions.current
    );
    window.addEventListener('touchmove', preventDefault, wheelOptions.current);
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    scrollDisabled.current = true;
    originalDocumentOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }, []);

  const reEnableScroll = useCallback(() => {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(
      wheelEvent.current,
      preventDefault,
      wheelOptions.current as boolean
    );
    window.removeEventListener(
      'touchmove',
      preventDefault,
      wheelOptions.current as boolean
    );
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    scrollDisabled.current = false;
    document.body.style.overflow = originalDocumentOverflow.current;
    originalDocumentOverflow.current = '';
  }, []);

  const checkBrowserSupport = useCallback(() => {
    // Check wheel event support.
    if (wheelEvent.current === null) {
      wheelEvent.current =
        'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    }

    // Check if the browser supports passive.
    if (wheelOptions.current === null) {
      wheelOptions.current = false;
      try {
        window.addEventListener(
          'test',
          null,
          Object.defineProperty({}, 'passive', {
            get: function () {
              wheelOptions.current = { passive: false };
            },
          })
        );
      } catch (e) {
        // Noop.
      }
    }
  }, []);

  useEffect(() => {
    if (disableScroll && !scrollDisabled.current) {
      checkBrowserSupport();
      handleDisableScroll();
    }
    return () => {
      if (scrollDisabled.current) reEnableScroll();
    };
  }, [disableScroll]);
};

export default useDisableWindowScroll;
