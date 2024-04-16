import React from 'react';
import { Transforms, Location } from 'slate';
import { useSlate } from 'slate-react';

import { isBlockActive } from '../../helpers';
import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';

import { insertInput } from './withInput';

type UseSelectTriggerHook = {
  isInputModalOpen: boolean;
  isInputSet: boolean;
  onInputModalClose: () => void;
  onInput: (placeholder: string) => void;
  onTriggerInputModal: () => void;
};

/** Deprecated because it basically does nothing */
export default function useSelectTrigger(): UseSelectTriggerHook {
  const editor = useSlate();
  const isSet = isBlockActive(editor, 'input');
  const [isOpen, setOpen] = React.useState(false);
  const { persistedSelection } = useRichTextEditorProvider();

  const onClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onInput = (placeholder: string): void => {
    if (persistedSelection) {
      Transforms.select(editor, persistedSelection as Location);
    }
    insertInput(editor as any, placeholder);
    onClose();
  };

  const onTriggerInputModal = (): void => {
    setOpen(true);
  };

  return {
    isInputModalOpen: isOpen,
    isInputSet: isSet,
    onInputModalClose: onClose,
    onInput,
    onTriggerInputModal,
  };
}
