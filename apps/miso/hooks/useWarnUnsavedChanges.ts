import { MutableRefObject, useEffect, useRef } from 'react';
import Router from 'next/router';

export default function useWarnUnsavedChanges(
  unsavedChanges: boolean,
  /** Handler for if an unsaved state is detected */
  callback: (intendedUrl: string) => void,
  exceptionUrlRegExps: Array<RegExp | string> = [],
  customRef?: MutableRefObject<string>
) {
  const _ref = useRef(Router.asPath);
  const targetRef = customRef || _ref;
  const newIntendedUrl = useRef<string | null>(null);

  useEffect(() => {
    const routeChangeStart = (intendedUrl: string) => {
      if (
        targetRef.current !== intendedUrl &&
        unsavedChanges &&
        (!exceptionUrlRegExps.length ||
          exceptionUrlRegExps.every(
            (regex) => intendedUrl.match(regex) === null
          ))
      ) {
        /**
         * Saves the intended url here to allow going away later.
         */
        newIntendedUrl.current = intendedUrl;
        Router.events.emit('routeChangeError');
        history.pushState(null, document.title, targetRef.current);
        callback(intendedUrl);
        throw 'Abort route change. Please ignore this error.';
      }
    };

    const beforeunload = (event: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        event.preventDefault();
        return (event.returnValue = 'Unsaved changes detected');
      }
    };

    window.addEventListener('beforeunload', beforeunload);
    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
      Router.events.off('routeChangeStart', routeChangeStart);
    };
  }, [unsavedChanges]);

  /**
   * Useful to go away after the user have confirmed they want to leave the page.
   * You still have to flip the `unsavedChanges` to btw.
   */
  const goAwayIfIntended = (): boolean => {
    if (newIntendedUrl.current) {
      Router.push(newIntendedUrl.current);
      return true;
    }

    return false;
  };

  return { goAwayIfIntended };
}
