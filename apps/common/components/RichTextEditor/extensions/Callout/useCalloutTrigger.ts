import React from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Location, Transforms } from 'slate';

import { CalloutTypes } from 'bento-common/types/slate';

import { isBlockActive } from '../../helpers';
import { insertCallout } from './withCallout';
import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';

type UseButtonTriggerHook = {
  isCalloutModalOpen: boolean;
  isCalloutSet: boolean;
  onCalloutModalClose: () => void;
  onCallout: (calloutType: CalloutTypes) => void;
  onTriggerCalloutModal: () => void;
};

export default function useButtonTrigger(): UseButtonTriggerHook {
  const editor = useSlate();
  const { persistedSelection, setPersistedSelection } =
    useRichTextEditorProvider();

  const isSet = isBlockActive(editor, 'callout');
  const [isOpen, setOpen] = React.useState(false);

  const onClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onCallout = (calloutType: CalloutTypes): void => {
    if (persistedSelection) {
      Transforms.select(editor, persistedSelection as Location);
    }
    insertCallout(editor as ReactEditor, calloutType);
    onClose();
  };

  const onTriggerCalloutModal = (): void => {
    if (typeof setPersistedSelection === 'function')
      setPersistedSelection(editor.selection as Location);
    setOpen(true);
  };

  return {
    isCalloutModalOpen: isOpen,
    isCalloutSet: isSet,
    onCalloutModalClose: onClose,
    onCallout,
    onTriggerCalloutModal,
  };
}
