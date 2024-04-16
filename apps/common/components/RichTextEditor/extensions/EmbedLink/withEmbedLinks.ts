import { ReactEditor } from 'slate-react';
import { SlateBodyElement } from 'bento-common/types/slate';

import { wrapEmbedLink } from '../../helpers';
import { getEmbedLinkSource } from 'bento-common/utils/embedSlate';

const withEmbedLinks = (editor: ReactEditor) => {
  const { insertData, insertText, isInline, isVoid } = editor;

  editor.isInline = (element: SlateBodyElement) =>
    element.type === 'embed-link' ? false : isInline(element);

  editor.insertText = (text) => {
    const embedLinkSource = getEmbedLinkSource(text);
    if (text && embedLinkSource) {
      wrapEmbedLink(editor, text, embedLinkSource);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    const embedLinkSource = getEmbedLinkSource(text);
    if (text && embedLinkSource) {
      wrapEmbedLink(editor, text, embedLinkSource);
    } else {
      insertData(data);
    }
  };

  editor.isVoid = (element: SlateBodyElement) =>
    element.type === 'embed-link' || isVoid(element);

  return editor;
};

export default withEmbedLinks;
