import isUrl from 'is-url';
import { ReactEditor } from 'slate-react';
import { SlateBodyElement } from 'bento-common/types/slate';

import { wrapLink } from '../../helpers';
import { inlineElementNodesMap } from 'bento-common/utils/bodySlate';

const withLinks = (editor: ReactEditor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element: SlateBodyElement) => {
    return element.type === 'link'
      ? !!inlineElementNodesMap[element.type]
      : isInline(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export default withLinks;
