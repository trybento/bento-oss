import { finder as getSelector } from '@medv/finder';
import {
  getElementParents,
  isElementVisible,
  px,
} from 'bento-common/utils/dom';

export const DEFAULT_MIN_LENGTH = 1;

// These sort of class prefixes tend to be very generic and can change between builds
const COMMON_PREFIXES = [
  'is-',
  'css-',
  'chakra-',
  // tailwind prefixes
  'h-',
  'w-',
  'bg-',
  'text-',
  'flex-',
  'font-',
  'align-',
  'justify-',
  'items-',
  'shadow-',
  ...['t-', 'b-', 'l-', 'r-', 'x-', 'y-', '-', ''].flatMap((suffix) =>
    ['border-', 'm', '-m', 'p', 'rounded-'].map((prefix) => prefix + suffix),
  ),
];

// Too generic and ephemeral to be reliable
const EPHEMERAL_CLASSES = [
  'active',
  'inactive',
  'enabled',
  'disabled',
  'current',
  'hover',
  // tailwind
  'relative',
  'absolute',
  'flex',
  'block',
  'rounded',
  'shadow',
];

const checkId = (id: string) => {
  // IDs are assumed to be explicit/intentional, so use them irrespective of whether they include common prefix etc.
  return true;
};

const checkClass = (omittedClasses: string[]) => (cls: string) => {
  return (
    !EPHEMERAL_CLASSES.concat(omittedClasses).includes(cls) &&
    !COMMON_PREFIXES.some((prefix) => cls.startsWith(prefix)) &&
    // trying to prevent ephemeral state indicator classes
    !EPHEMERAL_CLASSES.some((t) => cls.endsWith(t))
  );
};

const checkAttr = (name: string, value: string) => {
  // @see https://regex101.com/r/FSfqWZ/1
  const valueContainsUuid = !!value.match(
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
  );

  return (
    (name.startsWith('data-') || ['href', 'role', 'title'].includes(name)) &&
    !valueContainsUuid
  );
};

export const generateHighlightPosition = (elem: HTMLElement) => {
  const dimensions = elem.getBoundingClientRect();

  return {
    left: px(dimensions.left - 4),
    top: px(dimensions.top - 4),
    width: px(dimensions.width + 8),
    height: px(dimensions.height + 8),
  };
};

/**
 * In some cases the root element won't have any inner text so this recurses
 * a few times to try to find something in one of its children.
 */
const getElementText = (element: HTMLElement, level = 0): string => {
  if (level > 2) {
    return '';
  }

  const text = element.innerText;

  if (text) {
    return text;
  }

  for (let i = 0; i < element.children.length; i += 1) {
    const text = getElementText(element.children[i] as HTMLElement, level + 1);
    if (text) {
      return text;
    }
  }

  return '';
};

/**
 * Returns the element with the given selector only if the element is also
 * visible to the user.
 */
export const getVisibleElement = (
  selector: string,
  checkIfMultiple = false,
): HTMLElement | undefined => {
  let elements: NodeListOf<HTMLElement>;
  try {
    elements = document.querySelectorAll<HTMLElement>(selector);
  } catch {
    // this likely means the selector is invalid
    return undefined;
  }

  const visibleElements = [...elements].filter((el) => isElementVisible(el));

  if (checkIfMultiple && visibleElements.length > 1) {
    throw new Error('more than one element matches selector');
  }

  const firstVisibleElementFound = visibleElements[0];

  return firstVisibleElementFound;
};

/**
 * Returns information like the selector, HTML, text, type etc. of the given HTML element.
 */
export const getElementInformation = (
  element: HTMLElement,
  omittedClasses: string[],
  optimizedMinLength: number,
) => {
  const selector = getSelector(element, {
    idName: checkId,
    className: checkClass(omittedClasses),
    attr: checkAttr,
    optimizedMinLength,
  });

  const html = element.outerHTML || '';
  const text = getElementText(element);
  const type = (element.nodeName || 'div').toLowerCase();

  return {
    url: window.location.href,
    wildcardUrl: window.location.href,
    elementSelector: selector,
    elementHtml: html,
    elementType: type,
    elementText: text,
  };
};

/**
 * Determines the effective z-index of the given element by factoring in
 * z-index values set on it's parent elements.
 */
export const getEffectiveZIndex = (element: HTMLElement) => {
  const domPath = getElementParents(element).reverse();
  domPath.push(element);

  let firstSpecificZIndex = 0;

  for (const el of domPath) {
    const elZIndex = Number(
      window.getComputedStyle(el).getPropertyValue('z-index'),
    );

    if (!Number.isNaN(elZIndex)) {
      firstSpecificZIndex = elZIndex;

      break;
    }
  }

  return firstSpecificZIndex + 1;
};
