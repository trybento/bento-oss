import React from 'react';
import { Location, Transforms } from 'slate';
import { useSlate } from 'slate-react';

import { isBlockActive, insertImage } from '../../helpers';
import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';

type UseImageTriggerHook = {
  isImageModalOpen: boolean;
  isImageSet: boolean;
  onImageModalClose: () => void;
  onImage: (url: string, lightboxDisabled: boolean) => void;
  onTriggerImageModal: () => void;
};

const useImageTrigger = (): UseImageTriggerHook => {
  const editor = useSlate();
  const isSet = isBlockActive(editor, 'image');
  const [isOpen, setOpen] = React.useState(false);
  const { persistedSelection, setPersistedSelection } =
    useRichTextEditorProvider();

  const onClose = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onImage = (url: string, lightboxDisabled: boolean): void => {
    if (persistedSelection) {
      Transforms.select(editor, persistedSelection as Location);
    }
    insertImage(editor, url, lightboxDisabled);
    onClose();
  };

  const onTriggerImageModal = (): void => {
    if (typeof setPersistedSelection === 'function')
      setPersistedSelection(editor.selection);
    setOpen(true);
  };

  return {
    isImageModalOpen: isOpen,
    isImageSet: isSet,
    onImageModalClose: onClose,
    onImage,
    onTriggerImageModal,
  };
};

export default useImageTrigger;
