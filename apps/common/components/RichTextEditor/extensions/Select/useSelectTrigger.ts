import React from 'react';
import { Transforms, Location } from 'slate';
import { useSlate } from 'slate-react';

import { isBlockActive } from '../../helpers';

import { insertSelect, SelectOption, SelectSettings } from './withSelect';

import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';

type UseSelectTriggerHook = {
  isSelectModalOpen: boolean;
  isSelectSet: boolean;
  onSelectModalClose: () => void;
  onSelect: (settings: SelectSettings) => void;
  onTriggerSelectModal: () => void;
};

export default function useSelectTrigger(): UseSelectTriggerHook {
  const editor = useSlate();
  const isSet = isBlockActive(editor, 'select');
  const [isOpen, setOpen] = React.useState(false);
  const { persistedSelection, setPersistedSelection } =
    useRichTextEditorProvider();

  const onClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onSelect = ({
    placeholder,
    attributeType,
    valueType,
    attributeKey,
    options,
  }: {
    placeholder: string;
    attributeType: string;
    valueType: 'text' | 'number' | 'boolean';
    attributeKey: string;
    options: SelectOption[];
  }): void => {
    const selectOptions = {
      placeholder,
      attributeType,
      valueType,
      attributeKey,
      options,
    };

    if (persistedSelection) {
      Transforms.select(editor, persistedSelection as Location);
    }
    insertSelect(editor as any, selectOptions);
    onClose();
  };

  const onTriggerSelectModal = (): void => {
    setPersistedSelection(editor.selection as Location);
    setOpen(true);
  };

  return {
    isSelectModalOpen: isOpen,
    isSelectSet: isSet,
    onSelectModalClose: onClose,
    onSelect,
    onTriggerSelectModal,
  };
}
