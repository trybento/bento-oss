import { insertVoidBlockNode } from '../../helpers';
import { ReactEditor } from 'slate-react';
import { SlateBodyElement } from 'bento-common/types/slate';
import { inlineElementNodesMap } from 'bento-common/utils/bodySlate';

export const insertDivider = (editor: ReactEditor): void => {
  const divider = {
    type: 'divider',
    children: [{ text: '' }],
  };

  insertVoidBlockNode(editor, divider, true);
};

export const withDivider = (editor: ReactEditor) => {
  const { isInline, isVoid } = editor;

  // @ts-ignore
  editor.isInline = (element: SlateBodyElement) => {
    return element.type === 'divider'
      ? !!inlineElementNodesMap[element.type]
      : isInline(element as any);
  };

  // @ts-ignore
  editor.isVoid = (element: SlateBodyElement) => {
    return element.type === 'divider' ? true : isVoid(element as any);
  };

  return editor;
};

export default withDivider;
