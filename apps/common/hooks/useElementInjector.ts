import { useCallback, useEffect, useMemo, useRef } from 'react';

import useLocation from './useLocation';
import usePrevious from './usePrevious';
import { isTargetPage } from '../utils/urls';
import useDomObserver from './useDomObserver';
import { getVisibleElement, isElementVisible } from '../utils/dom';
import { debounceWithExtraCall } from '../utils/functions';
import useCallbackRef from './useCallbackRef';
import { debugMessage } from '../utils/debugging';
import { difference, keyBy } from '../utils/lodash';
import { sanitizeAttributesForPreview } from '../data/helpers';

export type ElementInjectorData<D> = {
  url: string;
  selector: string;
  isPreview: boolean | undefined;
  data: D;
};

export type ElementInjectorCallback<D> = (
  el: HTMLElement,
  data: D
) => HTMLElement;
export type ElementRemovalCallback<D> = (el: HTMLElement, data: D) => void;

type ElementRef<D> = {
  element: HTMLElement;
  data: ElementInjectorData<D>;
  target: HTMLElement;
};

type ElementRefs<D> = Record<string, ElementRef<D>>;

/**
 * Delays invoking the func above until after "wait" milliseconds have elapsed since the last time the debounced function was invoked.
 */
const WAIT_DELAY = 100;

/**
 * The maximum time func is allowed to be delayed before it's invoked.
 */
const MAX_WAIT_DELAY = 200;

/**
 * How much time to "wait" before calling the func once again after its last execution.
 */
const EXTRA_CALL_DELAY = 500;

function generateId<D>(locator: ElementInjectorData<D>) {
  return JSON.stringify(locator);
}

/**
 * Hook to handle listening for page changes (url or dom) and trigger the
 * injection and removal callbacks as necessary.
 *
 * Note: actually injecting/removing the element or otherwise reacting to the
 * target element being on the page or not is up to the caller. This is only
 * the logic to know when to do those things.
 */
export default function useElementsInjector<D>(
  locators: ElementInjectorData<D>[],
  injectCb: ElementInjectorCallback<D>,
  removeCb: ElementRemovalCallback<D>,
  additionalUpdateDeps: any[] = [],
  observeStylingAttributes = false
) {
  const appLocation = useLocation();

  const elementRefs = useRef<ElementRefs<D>>({});

  const locatorsById = useMemo(() => keyBy(locators, generateId), [locators]);
  const prevLocatorsById = usePrevious(locatorsById);
  const prevLocatorIds = usePrevious(Object.keys(locatorsById));

  const inject = useCallback(
    (id: string, locator: ElementInjectorData<D>) => {
      if (!elementRefs.current[id]) {
        // add the object to essentially create a lock so this doesn't trigger
        // multiple injection attempts in succession while this injection is
        // still running
        const targetElement = getVisibleElement(locator.selector);
        elementRefs.current[id] = {
          element: null,
          data: locator,
          target: targetElement,
        };
        if (targetElement) {
          elementRefs.current[id].element = injectCb(
            targetElement as HTMLElement,
            locator.data
          );
          debugMessage('[BENTO] (Injector) Element injected', locator);
        } else {
          // if the element isn't found yet, clean up the reference so this
          // can try again when something on the page changes
          delete elementRefs.current[id];
        }
      }
    },
    [injectCb]
  );

  const remove = useCallback(
    (id: string, element: HTMLElement, data: D) => {
      if (element) {
        removeCb(element, data);
      }
      delete elementRefs.current[id];
    },
    [removeCb]
  );

  const updateInjectedElements = useCallbackRef(
    debounceWithExtraCall(
      () => {
        if (prevLocatorIds) {
          // first remove any "locators" which no longer exist in the list
          const missingLocatorIds = difference(
            prevLocatorIds,
            Object.keys(locatorsById)
          );
          for (const id of missingLocatorIds) {
            const { element } = elementRefs.current[id] || {};
            if (element) {
              remove(id, element, prevLocatorsById[id].data as D);
            }
          }
        }

        // next remove any elments when:
        // 1. page url changed and no longer matches
        // 2. element is no longer on the page
        // 4. element is on the page but is no longer visible
        for (const [id, { element, data, target }] of Object.entries(
          elementRefs.current
        ) as [string, ElementRef<D>][]) {
          const newTarget = getVisibleElement(data.selector);
          const isSameTarget = target === newTarget;
          const sanitizedUrl = data.isPreview
            ? sanitizeAttributesForPreview(data.url)
            : data.url;
          const pageMatches = isTargetPage(appLocation.href, sanitizedUrl);
          const targetStillInBody = document.body.contains(target);
          const isTargetStillVisible = isElementVisible(target);

          const targetStillMatches =
            isSameTarget || (targetStillInBody && isTargetStillVisible);

          // url matching should be mandatory and result in
          // element removal if no longer matching regardless of any
          // other conditions
          if (!pageMatches || !targetStillMatches) {
            remove(id, element, data.data);

            if (!pageMatches) {
              debugMessage(
                '[BENTO] (Injector) Injected element removed due to page not matching',
                { id, element, appUrl: appLocation.href, targetUrl: data.url }
              );
            } else if (!targetStillMatches) {
              debugMessage(
                '[BENTO] (Injector) Injected element removed due to element not matching',
                {
                  id,
                  element,
                  selector: data.selector,
                  newTarget,
                  target,
                  elementStillInBody: targetStillInBody,
                }
              );
            }
          }
        }

        // inject new things which are
        (Object.entries(locatorsById) as [string, ElementInjectorData<D>][])
          .filter(([, l]) => {
            const sanitizedUrl = l.isPreview
              ? sanitizeAttributesForPreview(l.url)
              : l.url;

            return isTargetPage(appLocation.href, sanitizedUrl);
          })
          .forEach((l) => inject(...l));
      },
      {
        debounceArgs: [
          WAIT_DELAY,
          { leading: true, trailing: true, maxWait: MAX_WAIT_DELAY },
        ],
        extraCallDelay: EXTRA_CALL_DELAY,
      }
    ),
    [locatorsById, appLocation.href, inject, remove, ...additionalUpdateDeps],
    { callOnDepsChange: true }
  );

  useDomObserver(updateInjectedElements, {
    disabled: locators.length === 0,
    observeStylingAttributes,
  });

  useEffect(
    () => () =>
      (
        Object.entries(elementRefs.current) as [string, ElementRef<D>][]
      ).forEach(([id, { element, data }]) => remove(id, element, data.data)),
    [inject, remove]
  );
}
