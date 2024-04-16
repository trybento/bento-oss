import React, { useEffect } from 'react';
import pick from 'lodash/pick';
import {
  WysiwygEditorType,
  WysiwygEditorMode,
  StepAutoCompleteInteractionInput,
} from 'bento-common/types';

import {
  autocompleteElementEditorModes,
  loadAutocompleteElementEditor,
} from './editor';

export default function EditAutocompleteElement({
  autoCompleteInteraction,
  visualBuilderSessionEntityId,
}: React.PropsWithChildren<{
  autoCompleteInteraction: StepAutoCompleteInteractionInput;
  visualBuilderSessionEntityId: string;
}>) {
  useEffect(() => {
    if (!autoCompleteInteraction) return;

    loadAutocompleteElementEditor({
      visualBuilderSessionEntityId,
      initialState: {
        data: {
          type: autoCompleteInteraction.type,
        },
        ...pick(autoCompleteInteraction, [
          'url',
          'wildcardUrl',
          'elementSelector',
          'elementText',
          'elementHtml',
        ]),
        mode: WysiwygEditorMode.confirmElement,
        modes: autocompleteElementEditorModes,
        type: WysiwygEditorType.autocompleteElementEditor,
      },
    });
  }, [autoCompleteInteraction]);

  return null;
}
