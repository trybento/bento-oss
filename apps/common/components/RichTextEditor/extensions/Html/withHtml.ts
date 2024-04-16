import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { SlateBodyElement } from 'bento-common/types/slate';
import { inlineElementNodesMap } from 'bento-common/utils/bodySlate';

/*
 * Source example: https://github.com/ianstormtaylor/slate/blob/main/site/examples/paste-html.tsx
 */

interface GDocElement extends HTMLElement {
  role: string;
  dir: string;
}

/**
 * Translate element tags to Slate
 */
const ELEMENT_TAGS = {
  A: (el) => ({ type: 'link', url: el.getAttribute('href') }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  H1: () => ({ type: 'heading-one' }),
  H2: () => ({ type: 'heading-two' }),
  H3: () => ({ type: 'heading-three' }),
  H4: () => ({ type: 'heading-four' }),
  H5: () => ({ type: 'heading-five' }),
  H6: () => ({ type: 'heading-six' }),
  IMG: (el) => ({ type: 'image', url: el.getAttribute('src') }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  P: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
  UL: () => ({ type: 'bulleted-list' }),
  BUTTON: () => ({ type: 'button' }),
};

/**
 * Translate text tags to Slate
 */
const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  B: () => ({ bold: true }),
  U: () => ({ underline: true }),
  SPAN: () => ({}),
};

/** HTML Node type constants */
const NODE_TYPES = {
  ELEMENT: 1,
  ATTRIBUTE: 2,
  TEXT: 3,
};

/**
 * This transforms HTMLElements into Slate element data
 */
export const deserialize = (el: HTMLElement) => {
  const { nodeName, nodeType, textContent, style } = el;

  if (nodeType === NODE_TYPES.TEXT) {
    return textContent.trim();
  } else if (nodeType !== NODE_TYPES.ELEMENT) {
    return '';
  } else if (nodeName === 'BR') {
    return '\n';
  }

  let parent = el;

  if (
    nodeName === 'PRE' &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === 'CODE'
  ) {
    parent = el.childNodes[0] as HTMLElement;
  }
  let children = Array.from(parent.childNodes).map(deserialize).flat();

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  if (nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  let textNodename = nodeName;

  /* For Gdocs styling handling, since they style <span> eles with a style[0] key */
  if (nodeName === 'SPAN' && style && style[0]) {
    const { fontWeight, fontStyle } = style;
    if (fontWeight && +fontWeight > 400) {
      textNodename = 'B';
    } else if (fontStyle === 'italic') {
      textNodename = 'I';
    } else {
      return jsx('fragment', {}, children);
    }
  }

  /* GDoc uses <p> tags to organize elements under <li> tags, but we don't want the \n */
  if (
    ELEMENT_TAGS[nodeName] &&
    !(nodeName === 'P' && (el as GDocElement).role)
  ) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    return jsx('element', attrs, children || '');
  }

  if (TEXT_TAGS[textNodename]) {
    const attrs = TEXT_TAGS[textNodename](el);

    /** In Gdocs <b> is not used as a text decorator */
    if (children && children.length && typeof children[0] !== 'string') {
      return children;
    }

    return children.map((child) => jsx('text', attrs, child));
  }

  return children;
};

const withHtml = (editor: ReactEditor) => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element: SlateBodyElement) => {
    return element.type === 'link'
      ? !!inlineElementNodesMap[element.type]
      : isInline(element);
  };

  editor.isVoid = (element: SlateBodyElement) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const fragment = deserialize(parsed.body);
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};

export default withHtml;
