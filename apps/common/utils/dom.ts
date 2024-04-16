import React from 'react';

import { Cancelable } from '../types';
import { debugMessage } from './debugging';

/**
 * Recursively search up the dom from the given element to tell if the element
 * is in the dom but is hidden to the user in some way.
 */
export function isElementVisible(element: HTMLElement | null): boolean {
  if (!element || ['BODY', 'HTML'].includes(element.tagName)) return true;
  const computedStyle = getComputedStyle(element);
  if (
    computedStyle.display === 'none' ||
    computedStyle.visibility === 'hidden' ||
    ['0', '0%'].includes(computedStyle.opacity)
  ) {
    return false;
  }
  return isElementVisible(element.parentElement);
}

/**
 * Returns the element with the given selector only if the element is also
 * visible to the user.
 */
export function getVisibleElement(
  selector: string,
  checkIfMultiple = false
): HTMLElement | undefined {
  let elements: NodeListOf<HTMLElement>;
  try {
    elements = document.querySelectorAll<HTMLElement>(selector);
  } catch {
    debugMessage('[BENTO] (Injector) Failed to get element by selector', {
      selector,
    });
    // this likely means the selector is invalid
    return undefined;
  }
  // @ts-ignore-error
  const visibleElements = [...elements].filter((el) => isElementVisible(el));
  if (checkIfMultiple && visibleElements.length > 1) {
    throw new Error('more than one element matches selector');
  }

  const firstVisibleElementFound = visibleElements[0];
  if (!firstVisibleElementFound) {
    debugMessage(
      '[BENTO] (Injector) Target element was not found or is not visible',
      {
        selector,
        elements,
      }
    );
  }

  return firstVisibleElementFound;
}

export function doesElementMatchSelector(
  element: HTMLElement,
  selector: string
) {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  // @ts-ignore-error
  return [...elements].some((el) => el === element);
}

type MutationObserverOptions = {
  element?: HTMLElement | null;
  observerOpts?: MutationObserverInit;
  observeStylingAttributes?: boolean;
};

export type MutationObserverReturn = MutationObserver & { cancel: () => void };

export const OBSERVE_TARGET_ELEMENT_ONLY: MutationObserverInit = {
  childList: true,
  attributes: true,
};

const OBSERVE_ELEMENT_MUTATIONS_AND_STYLING_ATTRIBUTES: MutationObserverInit = {
  subtree: true,
  childList: true,
  attributes: true,
  /** We limit to attributes that are most likely to impact visibility */
  attributeFilter: ['id', 'class', 'style'],
};

const OBSERVE_ELEMENT_MUTATIONS_ONLY: MutationObserverInit = {
  subtree: true,
  childList: true,
};

const OBSERVE_ALL_MUTATIONS: MutationObserverInit = {
  subtree: true,
  childList: true,
  attributes: true,
};

export function createMutationObserver(
  cb: Cancelable<MutationCallback>,
  {
    element,
    observerOpts: argObserverOpts,
    observeStylingAttributes,
  }: MutationObserverOptions = {}
): MutationObserverReturn {
  if (element === null) return undefined;

  const useDocument = element === undefined;

  /**
   * Do not observe ALL attribute changes by default if the target is the whole
   * document since it will be expensive to process.
   *
   * In this instance, we will only observe attributes used to determine element
   * visibility.
   */
  const observerOpts =
    useDocument && !argObserverOpts
      ? observeStylingAttributes
        ? OBSERVE_ELEMENT_MUTATIONS_AND_STYLING_ATTRIBUTES
        : OBSERVE_ELEMENT_MUTATIONS_ONLY
      : argObserverOpts ?? OBSERVE_ALL_MUTATIONS;

  const domObserver = new MutationObserver(cb);
  domObserver.observe(useDocument ? document.body : element, observerOpts);

  (domObserver as MutationObserverReturn).cancel = () => {
    domObserver.disconnect();
    cb.cancel?.();
  };
  return domObserver as MutationObserverReturn;
}

type ResizeObserverOptions = {
  element?: HTMLElement | null;
  observerOpts?: MutationObserverInit;
};

type ResizeObserverReturn = ResizeObserver & { cancel: () => void };

export function createResizeObserver(
  cb: Cancelable<ResizeObserverCallback>,
  { element }: ResizeObserverOptions = {}
): ResizeObserverReturn {
  if (element === null) return undefined;

  const resizeObserver = new ResizeObserver((...args) => {
    window.requestAnimationFrame(() => {
      cb(...args);
    });
  });
  resizeObserver.observe(element === undefined ? document.body : element);

  (resizeObserver as ResizeObserverReturn).cancel = () => {
    resizeObserver.disconnect();
    cb.cancel?.();
  };
  return resizeObserver as ResizeObserverReturn;
}

// Note: Use with caution since it disables default behavior
// for children of the element using it.
export function stopEvent(ev: React.SyntheticEvent | Event) {
  ev.preventDefault();
  ev.stopPropagation();
}

/**
 * Stops HTMLEvent propagation and default element click behaviors
 */
export function withStopEvent(
  cb: (ev: React.SyntheticEvent | Event, ...a: any[]) => any
) {
  return (ev: React.SyntheticEvent | Event, ...args: any[]) => {
    stopEvent(ev);
    return cb(ev, ...args);
  };
}

export function px(value?: undefined): undefined;
export function px(value?: number | string): string;
export function px(value?: number | string): string | undefined {
  if (typeof value === 'undefined') return undefined;
  if (typeof value === 'string' && value.endsWith('px')) return value;
  // WARNING: value 0 should return 0px, otherwise this might break CSS rules (i.e. when used within `calc`)
  return `${value}px`;
}

export function rem(value: number): string {
  return `${value}rem`;
}

/**
 * pixel size based on tailwind base size (4px)
 */
export function twSize(value: number): string {
  return `${value * 4}px`;
}

export function isInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Recursively finds all parent elements of a target element,
 * climbing up the DOM tree.
 */
export function getElementParents(target: HTMLElement): HTMLElement[] {
  const parents = [];
  let el = target;
  while (el.parentElement) {
    parents.push(el.parentElement);
    el = el.parentElement;
  }
  return parents;
}

const positionsToCheck = new Map(['sticky', 'fixed'].map((v) => [v, true]));

export function getPositionFlags(node: HTMLElement | null): {
  fixed: boolean;
  sticky: boolean;
} {
  let currentNode = node;
  const result = { fixed: false, sticky: false };

  while (currentNode && currentNode.nodeName.toLowerCase() !== 'body') {
    const position = window
      .getComputedStyle(currentNode)
      .getPropertyValue('position')
      .toLowerCase();
    if (positionsToCheck.has(position)) {
      return { ...result, [position]: true };
    }
    currentNode = currentNode.parentElement;
  }

  return result;
}
