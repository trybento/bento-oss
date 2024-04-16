import { inlineElementNodesMap } from 'bento-common/utils/bodySlate';
// @ts-expect-error
import imageExtensions from 'image-extensions';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { SlateBodyElement } from 'bento-common/types/slate';

const isImageUrl = (url: string) => {
  if (!url) return false;
  const urlCopy = url.slice();
  const ext = urlCopy.split('.').pop();
  return imageExtensions.includes(ext);
};

const areFilesImage = (files: FileList) => {
  if (!files) return false;
  if (files.length === 0) return false;

  let areImages = true;

  for (const file of files) {
    if (!areImages) break;
    const [mime] = file.type.split('/');

    areImages = mime === 'image';
  }

  return areImages;
};

const insertImage = (editor: ReactEditor, url: string): void => {
  const image = { type: 'image', url, children: [{ text: '' }] };
  Transforms.insertNodes(editor, image);
};

const withImages = (editor: ReactEditor) => {
  const { insertData, isVoid, isInline } = editor;

  editor.isInline = (element: SlateBodyElement) => {
    return element.type === 'image'
      ? !!inlineElementNodesMap[element.type]
      : isInline(element);
  };

  editor.isVoid = (element: SlateBodyElement) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const files = data?.files;

    if (
      data.effectAllowed === 'uninitialized' &&
      data.types[0] === 'Files' &&
      areFilesImage(files)
    ) {
      // Clipboard.
      const uploaderDOM = document.querySelector(
        'input[accept="image/*"][type="file"]'
      );
      if (uploaderDOM && uploaderDOM instanceof HTMLInputElement) {
        uploaderDOM.files = files;
        uploaderDOM.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } else if (text && isImageUrl(text)) {
      // Image url.
      insertImage(editor, text);
    } else {
      // Drag-n-drop or modal.
      insertData(data);
    }
  };

  return editor;
};

export default withImages;
