import { inlineElementNodesMap } from 'bento-common/utils/bodySlate';
import { ReactEditor } from 'slate-react';
import { insertVoidBlockNode } from '../../helpers';
import { SlateBodyElement } from 'bento-common/types/slate';

export const insertInput = (editor: ReactEditor, placeholder: string): void => {
  const input = {
    type: 'input',
    children: [
      {
        type: 'text',
        text: placeholder,
      },
    ],
  };

  insertVoidBlockNode(editor, input);
};

export const withInput = (editor: ReactEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: SlateBodyElement) => {
    return element.type === 'input'
      ? !!inlineElementNodesMap[element.type]
      : isInline(element);
  };

  editor.isVoid = (element: SlateBodyElement) => {
    return element.type === 'input' ? true : isVoid(element);
  };

  return editor;
};

export default withInput;
