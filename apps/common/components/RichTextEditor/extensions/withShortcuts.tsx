import { Editor, Range, Transforms, Point, NodeEntry } from 'slate';

import { toggleBlock } from '../helpers';
import {
  EditorNode,
  SlateBodyElement,
  isListType,
} from 'bento-common/types/slate';

const SHORTCUTS = {
  '*': 'bulleted-list',
  '-': 'bulleted-list',
  '>': 'block-quote',
  '1.': 'numbered-list',
};

/* eslint-disable max-len */
/**
 * Plugin for creating blocks using beginning-of-line shortcuts, and removing
 * those blocks on delete.  Code lifted from one of Slate's
 * [examples](https://github.com/ianstormtaylor/slate/blob/93fe25151722343488e9002a0ebd8ed3ba66ee95/site/examples/markdown-shortcuts.js).
 */
/* eslint-enable max-len */
export default function withShortcuts<E extends Editor>(editor: E): E {
  const { deleteBackward, insertText } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.insertText = (text) => {
    const { selection } = editor;

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const type = SHORTCUTS[beforeText];

      if (type != null) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        toggleBlock(editor, type);
        return;
      }
    }

    try {
      insertText(text);
    } catch (e: any) {
      if ((e as Error)?.message?.includes?.("'path' of 'at'")) {
        /* Momentary empty anchor state when doing a replace w/ objects, try insertion again */
        insertText(text);
      } else {
        throw e;
      }
    }
  };

  // eslint-disable-next-line no-param-reassign
  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      }) as NodeEntry<EditorNode>;

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          Transforms.setNodes(editor, {
            type: 'paragraph',
          } as Partial<EditorNode>);

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: (n: EditorNode) =>
                isListType(n.type as SlateBodyElement['type']),
              split: true,
            });
          }

          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
}
