import { inlineElementNodesMap } from 'bento-common/utils/bodySlate';
import { ReactEditor } from 'slate-react';
import { insertVoidBlockNode } from '../../helpers';
import { SlateBodyElement } from 'bento-common/types/slate';

export interface SelectOption {
  label: string;
  value: string | string[];
  [key: string]: any;
}

const DEFAULT_PLACEHOLDER = 'Select an option';

export type SelectSettings = {
  placeholder: string;
  attributeType: string;
  valueType: 'text' | 'number' | 'boolean';
  attributeKey: string;
  options: SelectOption[];
};

export const insertSelect = (
  editor: ReactEditor,
  selectSettings: SelectSettings
): void => {
  const { placeholder, attributeType, valueType, attributeKey, options } =
    selectSettings;

  const select = {
    type: 'select',
    placeholder: placeholder || DEFAULT_PLACEHOLDER,
    attributeType,
    valueType,
    attributeKey,
    options,
    children: [
      {
        text: '',
      },
    ],
  };

  insertVoidBlockNode(editor, select);
};

export const withSelect = (editor: ReactEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: SlateBodyElement) => {
    return element.type === 'select'
      ? !!inlineElementNodesMap[element.type]
      : isInline(element);
  };

  editor.isVoid = (element: SlateBodyElement) => {
    return element.type === 'select' ? true : isVoid(element);
  };

  return editor;
};

export default withSelect;
