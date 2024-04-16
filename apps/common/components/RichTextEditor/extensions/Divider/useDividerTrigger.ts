import { ReactEditor, useSlate } from 'slate-react';
import { Location, Transforms } from 'slate';
import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';

import { isBlockActive } from '../../helpers';

import { insertDivider } from './withDivider';

type UseDividerTriggerHook = {
  isDividerSet: boolean;
  onDivider: () => void;
};

export default function useDividerTrigger(): UseDividerTriggerHook {
  const editor = useSlate();
  const { persistedSelection } = useRichTextEditorProvider();

  const isSet = isBlockActive(editor, 'divider');

  const onDivider = (): void => {
    if (persistedSelection)
      Transforms.select(editor, persistedSelection as Location);

    insertDivider(editor as ReactEditor);
  };

  return {
    isDividerSet: isSet,
    onDivider,
  };
}
