import { insertVoidBlockNode } from '../../helpers';
import { ReactEditor } from 'slate-react';
import { SlateBodyElement } from 'bento-common/types/slate';
import { inlineElementNodesMap } from 'bento-common/utils/bodySlate';
import { StepCtaSettings, StepCtaStyle } from 'bento-common/types';

export const insertButton = (
  editor: ReactEditor,
  buttonText: string,
  url: string,
  shouldCollapseSidebar: boolean,
  clickMessage: string,
  settings: StepCtaSettings,
  style: StepCtaStyle
): void => {
  const children = [{ text: '' }];
  const button = {
    type: 'button',
    buttonText,
    url,
    shouldCollapseSidebar,
    clickMessage,
    children,
    settings,
    style,
  };

  insertVoidBlockNode(editor, button);
};

export const withButton = (editor: ReactEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: SlateBodyElement) => {
    return element.type === 'button'
      ? !!inlineElementNodesMap[element.type]
      : isInline(element);
  };

  editor.isVoid = (element: SlateBodyElement) => {
    return element.type === 'button' ? true : isVoid(element);
  };

  return editor;
};

export default withButton;
