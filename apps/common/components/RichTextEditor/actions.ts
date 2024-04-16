import {
  Editor,
  Range,
  Node as SlateNode,
  Element as SlateElement,
  Path as SlatePath,
  Transforms,
} from 'slate';
import { EditorNode, TextNode } from 'bento-common/types/slate';
import isEqual from 'lodash/isEqual';
import {
  getContainingListIfFirstAndEmptyItem,
  getContainingTextBlockIfEmptyItem,
  getEmptyParagraph,
  insertBlankNode,
  isBlockActive,
  isChildrenEmpty,
  isEmptyNode,
  isVoidBlockNode,
  safelyRemoveNodes,
  safelyRemoveVoidNodes,
  toggleBlock,
  toggleMark,
  unwrapLink,
} from './helpers';
import { isEmptyBody } from 'bento-common/utils/bodySlate';

type HandlerArgs = {
  editor: Editor;
  event: React.KeyboardEvent<unknown>;
};

export function handleDownArrow({ editor }: HandlerArgs) {
  const isCallout = isBlockActive(editor, 'callout');
  const isQuote = isBlockActive(editor, 'block-quote');

  // Check if there are void blocks inside a paragraph.
  const line = editor?.selection?.focus?.path?.[0];
  const focusedElement = editor?.children?.[line] as EditorNode;
  const focusedLastChild =
    focusedElement?.children?.[(focusedElement?.children?.length || 0) - 1];

  const isVoidBlock =
    (focusedElement && isVoidBlockNode(editor, focusedElement)) ||
    (focusedLastChild && isVoidBlockNode(editor, focusedLastChild));

  if (
    (isCallout || isVoidBlock || isQuote) &&
    isEqual(Editor.end(editor, []).path, editor?.selection?.focus?.path)
  ) {
    Transforms.insertNodes(editor, getEmptyParagraph(), {
      at: [editor.children.length],
    });

    Transforms.move(editor, { distance: 1 });
  }
}

export function handleBackspace({ editor, event }: HandlerArgs) {
  const focusPoint: SlatePath = editor.selection?.focus?.path;
  // Prevent setting the editor into an invalid state.
  const isEmpty = isEmptyBody(editor.children);
  if (isEmpty) {
    event.preventDefault();
    return;
  }

  const list = getContainingListIfFirstAndEmptyItem(editor);
  if (list) {
    toggleBlock(editor, list.type);
    event.preventDefault();
  }

  const textBlock = getContainingTextBlockIfEmptyItem(editor);
  if (textBlock) {
    toggleBlock(editor, textBlock.type);
    event.preventDefault();
  }

  const { selection } = editor;
  if (selection && Range.isCollapsed(selection)) {
    // Fix to allow deleting inline void elements with backspace on Chrome
    const currentNode = SlateNode.parent(
      editor,
      selection.anchor.path
    ) as EditorNode;
    if (SlateElement.isElement(currentNode)) {
      if (editor.isVoid(currentNode as SlateElement)) {
        event.preventDefault();
        /**
         * Delete without leaving an empty line,
         * specially desired in components with length
         * limits.
         */
        safelyRemoveVoidNodes(editor);
      }

      // Allow deleting empty paragraph blocks
      if (currentNode.type === 'paragraph' && isChildrenEmpty(currentNode)) {
        safelyRemoveNodes(editor);
        event.preventDefault();

        if (focusPoint?.[0] < editor.children.length && !isNaN(focusPoint[0])) {
          /* If we deleted the last paragraph in a callout, remove it */
          const currentParentNode = SlateNode.parent(editor, [
            focusPoint[0],
            0,
          ]) as EditorNode;

          if (
            currentParentNode.type === 'callout' &&
            isEmptyNode([currentParentNode])
          ) {
            safelyRemoveNodes(editor, { at: [focusPoint[0]] });
            event.preventDefault();
          }
        }
      } else if (currentNode.type === 'divider' && focusPoint?.[0]) {
        /* Remove can also leak over, so replace the divider instead */
        Transforms.setNodes(editor, getEmptyParagraph(), {
          at: [focusPoint[0]],
        });
      }
    }
  }

  if (focusPoint && focusPoint[0] < editor.children.length) {
    if (
      isBlockActive(editor, 'code-block') ||
      isBlockActive(editor, 'callout')
    ) {
      try {
        const currentParentNode = SlateNode.parent(editor, [
          focusPoint[0],
          0,
        ]) as EditorNode;

        if (
          currentParentNode.type === 'list-item' &&
          editor.selection.anchor.offset == 0
        ) {
          event.preventDefault();
          Transforms.move(editor, { distance: 1, reverse: true });
          editor.deleteForward('character');
        }
      } catch (e) {
        /* Not awesome to just error into the void, but when caught, backspacing into
         *   a blockquote or callout seems to behave as expected. Seems it won't select
         *   properly with the existing focus path inside of those blocks.
         * May need to test for more side effects in different cases extensively
         */
        console.info('[RTE] FocusPoint resolving error:', e);
      }
    }
  }
}

export function handleEnterKey({ event, editor }: HandlerArgs) {
  const focusPoint: SlatePath = editor.selection?.focus?.path;
  if (focusPoint) {
    const currentParentNode = SlateNode.parent(
      editor,
      focusPoint
    ) as EditorNode;

    const nestedFocusPoint = focusPoint[1];
    const currentNode = SlateNode.child(
      currentParentNode,
      nestedFocusPoint < currentParentNode?.children.length
        ? nestedFocusPoint
        : currentParentNode?.children.length - 1
    ) as TextNode;

    if (currentParentNode.type === 'code-block') {
      event.preventDefault();
    } else if (currentParentNode.type === 'callout') {
      Transforms.insertText(editor, '\n');
      event.preventDefault();
    } else if (currentParentNode && editor.isVoid(currentParentNode)) {
      insertBlankNode(editor);
      event.preventDefault();
    } else if (currentParentNode.type === 'link') {
      // Unwrap newline.
      setTimeout(() => unwrapLink(editor), 0);
    } else if (currentNode.h1 || currentNode.h2) {
      toggleMark(editor, currentNode.h1 ? 'h1' : 'h2');
    }
  }

  const list = getContainingListIfFirstAndEmptyItem(editor);
  if (list) {
    toggleBlock(editor, list.type);
    event.preventDefault();
  }

  const textBlock = getContainingTextBlockIfEmptyItem(editor);
  if (textBlock) {
    toggleBlock(editor, textBlock.type);
    event.preventDefault();
  }
}
