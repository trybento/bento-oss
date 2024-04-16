import { NodeTypeEnum } from '../types';
import { BENTO_COMPONENTS } from '../utils/constants';
import { px } from '../utils/dom';

export const getSelfText = (reference: HTMLElement) => {
  if (!reference) return '';

  return [].reduce.call(
    reference.childNodes,
    (a, b: any) => {
      return a + (b.nodeType === NodeTypeEnum.text ? b.textContent : '');
    },
    ''
  ) as string;
};

/**
 * Determine if a visual tag's reference should be allowed to check for innerText.
 *
 * @param {String} innerText Reference innerText.
 * @param {HTMLElement['tagName']} tagName Reference tag name.
 *
 */
export const getAllowedInnerText = (
  innerText: string,
  tagName: HTMLElement['tagName']
) => {
  if (!innerText || !tagName) return false;

  switch (tagName) {
    case 'DIV':
    case 'SPAN':
    case 'P':
    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
    case 'A':
    case 'LI':
      return true;

    default:
      return false;
  }
};

/**
 * Handy helper to cast px strings to number.
 *
 * @param {String} px The text to be casted.
 *
 */
export const pxToNumber = (px: string) => {
  if (!px) return 0;
  return typeof px === 'string' ? Number(px.replace('px', '')) : 0;
};

export const getComputedPaddings = (reference: HTMLElement | null) => {
  if (!reference)
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

  const { paddingTop, paddingBottom, paddingLeft, paddingRight } =
    window.getComputedStyle(reference);

  return {
    top: pxToNumber(paddingTop),
    bottom: pxToNumber(paddingBottom),
    left: pxToNumber(paddingLeft),
    right: pxToNumber(paddingRight),
  };
};

const getCssStyle = (element, prop): string => {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
};

export const getCanvasFontSize = (el: HTMLElement): string => {
  if (!el) return '';

  const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
  const fontSize = getCssStyle(el, 'font-size') || '16px';
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

  return `${fontWeight} ${fontSize} ${fontFamily}`;
};

let _canvas: HTMLCanvasElement | null = null;

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 */
export const getTextWidth = (text, font): number => {
  if (!font || !text) return 0;

  // re-use canvas object for better performance
  const canvas = _canvas || (_canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');

  if (!context) return 0;

  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

export const getElementTextWidth = (el: HTMLElement): number => {
  if (!el?.childNodes?.length) return 0;

  const maxWidth = el.getBoundingClientRect().width;
  const textCanvasStyle = getCanvasFontSize(el);

  let contentWidth = 0;
  el.childNodes.forEach((node) => {
    try {
      switch (node.nodeType) {
        case NodeTypeEnum.text: {
          contentWidth += getTextWidth(node.textContent, textCanvasStyle);
          break;
        }

        case NodeTypeEnum.attributes:
        case NodeTypeEnum.comment:
          break;

        // other
        default: {
          const { width, marginLeft, marginRight } = window.getComputedStyle(
            node as HTMLElement
          );

          contentWidth +=
            pxToNumber(width) +
            pxToNumber(marginLeft) +
            pxToNumber(marginRight);
          break;
        }
      }
    } catch (e) {
      // 'node' is not type Element
    }
  });

  return contentWidth > maxWidth ? maxWidth : contentWidth;
};

export const setEndOfContenteditable = (contentEditableElement) => {
  try {
    if (document.createRange) {
      // Firefox, Chrome, Opera, Safari
      const range = document.createRange();
      range.selectNodeContents(contentEditableElement);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      // @ts-ignore - IE 8 and lower
    } else if (document.selection) {
      // @ts-ignore
      const range = document.body.createTextRange();
      range.moveToElementText(contentEditableElement);
      range.collapse(false);
      range.select();
    }
  } catch (e) {
    // Do nothing.
  }
};

const MOVED_FIXED_ELEMENT_ATTR = 'fixedelementmoved';
/**
 * Experimental. Move fixed elements in the page.
 * This is an intensive operation since it scans the whole DOM.
 * Alternatively, 'transform' could be used in document.body
 * which will move all fixed elements.
 */
export const moveFixedElements = (
  side: 'top' | 'bottom' | 'right' | 'left',
  valuePx: number,
  reset: boolean
) => {
  for (const el of [
    // @ts-ignore-error
    ...document.body.querySelectorAll(
      reset
        ? `[${MOVED_FIXED_ELEMENT_ATTR}]`
        : // Prevent Bento components from being selected.
          `*${BENTO_COMPONENTS.reduce(
            (acc, component) => acc + `:not(${component})`,
            `:not([${MOVED_FIXED_ELEMENT_ATTR}])`
          )}`
    ),
  ] as HTMLElement[]) {
    const elComputedStyles = getComputedStyle(el, null);
    if (elComputedStyles.getPropertyValue('position') === 'fixed') {
      const computedValue = Number(elComputedStyles[side].split('px')[0]);
      if (!Number.isNaN(computedValue)) {
        if (reset) {
          el.style[side] = px(computedValue - valuePx);
          el.removeAttribute(MOVED_FIXED_ELEMENT_ATTR);
        } else {
          el.style[side] = px(computedValue + valuePx);
          el.setAttribute(MOVED_FIXED_ELEMENT_ATTR, 'true');
        }
      }
    }
  }
};

export enum ClipboardEvents {
  copy = 'copy',
  cut = 'cut',
  paste = 'paste',
  delete = 'delete',
  undo = 'undo',
  redo = 'redo',
}

// @ts-ignore-error
export const handleClipboardKeys = (
  e: React.KeyboardEvent<unknown>,
  /** Empty list will skip checks */
  allowList: ClipboardEvents[] = []
) => {
  const allowAll = allowList.length === 0;
  if (allowAll || typeof e.key !== 'string') return 0;

  const ctrlKey = e.ctrlKey || e.metaKey;
  const key = e.key.toLowerCase();

  if (
    ctrlKey &&
    ((key === 'y' && allowList.includes(ClipboardEvents.redo)) ||
      (key === 'z' && allowList.includes(ClipboardEvents.undo)) ||
      (key === 'x' && allowList.includes(ClipboardEvents.cut)) ||
      (key === 'v' && allowList.includes(ClipboardEvents.paste)) ||
      (key === 'c' && allowList.includes(ClipboardEvents.copy)) ||
      key === 'a')
  ) {
    return 0;
  }
  const theEvent: any = e || window.event;
  /* eslint-disable no-empty-character-class */
  const regex = /[]|\./;
  if (!regex.test(key)) {
    theEvent.returnValue = false;
    theEvent.preventDefault();
  }
};
