import React from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Location, Transforms } from 'slate';

import { isBlockActive } from '../../helpers';

import { insertButton } from './withButton';

import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';
import { StepCtaSettings, StepCtaStyle } from 'bento-common/types';

export type UseButtonTriggerHook = {
  isButtonModalOpen: boolean;
  isButtonSet: boolean;
  onButtonModalClose: () => void;
  onButton: (
    buttonText: string,
    url: string,
    shouldCollapseSidebar: boolean,
    clickMessage: string,
    settings: StepCtaSettings,
    style: StepCtaStyle
  ) => void;
  onTriggerButtonModal: () => void;
};

export default function useButtonTrigger(): UseButtonTriggerHook {
  const editor = useSlate();
  const { persistedSelection, setPersistedSelection } =
    useRichTextEditorProvider();

  const isSet = isBlockActive(editor, 'button');
  const [isOpen, setOpen] = React.useState(false);

  const onClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onButton = (
    buttonText: string,
    url: string,
    shouldCollapseSidebar: boolean,
    clickMessage: string,
    settings: StepCtaSettings,
    style: StepCtaStyle
  ): void => {
    if (persistedSelection) {
      Transforms.select(editor, persistedSelection as Location);
    }
    insertButton(
      editor as ReactEditor,
      buttonText,
      url,
      shouldCollapseSidebar,
      clickMessage,
      settings,
      style
    );
    onClose();
  };

  const onTriggerButtonModal = (): void => {
    if (typeof setPersistedSelection === 'function')
      setPersistedSelection(editor.selection as Location);
    setOpen(true);
  };

  return {
    isButtonModalOpen: isOpen,
    isButtonSet: isSet,
    onButtonModalClose: onClose,
    onButton,
    onTriggerButtonModal,
  };
}
