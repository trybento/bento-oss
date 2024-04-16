import { useCallback, useState } from 'react';
import { Editor, Transforms, RangeRef } from 'slate';
import { useSlate } from 'slate-react';

import { isBlockActive, insertLink, unwrapLink } from '../../helpers';

type UseLinkTriggerHook = {
  isLinkModalOpen: boolean;
  isLinkSet: boolean;
  onLinkModalClose: () => void;
  onLink: (url: string) => void;
  onTriggerLinkModal: () => void;
};

export default function useEmbedLinkTrigger(): UseLinkTriggerHook {
  const editor = useSlate();
  const isSet = isBlockActive(editor, 'embed-link');
  const [isOpen, setOpen] = useState(false);
  const [selection, setSelection] = useState<RangeRef | null>(null);

  // An alternative would be to "await focus", and then insert the link after
  // focus is obtained.  There's potential races there where additional editor
  // actions could occur in between.  Not sure which is better.
  const restoreSelectAfterFocus = useCallback(() => {
    const currentAnchor = editor.selection?.anchor;
    if (
      currentAnchor == null ||
      !currentAnchor.path.every((index) => index === 0) ||
      currentAnchor.offset !== 0
    ) {
      setTimeout(restoreSelectAfterFocus, 0);
      return;
    }
    Transforms.select(editor, selection?.current);
    Transforms.collapse(editor, { edge: 'end' });
    setSelection(null);
  }, [selection?.current]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, [restoreSelectAfterFocus]);

  const onLink = useCallback(
    (url: string): void => {
      Transforms.select(editor, selection!.current!);
      insertLink(editor, url);
      onClose();
    },
    [onClose, selection?.current]
  );

  const onTriggerLinkModal = useCallback(() => {
    if (isSet) {
      unwrapLink(editor);
    } else {
      setSelection(Editor.rangeRef(editor, editor.selection!));
      setOpen(true);
    }
  }, [isSet]);

  return {
    isLinkModalOpen: isOpen,
    isLinkSet: isSet,
    onLinkModalClose: onClose,
    onLink,
    onTriggerLinkModal,
  };
}
