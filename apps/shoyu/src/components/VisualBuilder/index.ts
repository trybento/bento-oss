import {
  WysiwygEditorSpecializationHelpers,
  WysiwygEditorSpecializationInitializer,
} from './types';
import initializeTagEditor from './tagEditor';
import initializeInlineInjectionEditor from './inlineInjectionEditor';
import initializeAutocompleteElementEditor from './autocompleteElementEditor';
import { VisualBuilderSessionType } from 'bento-common/types';
import { debugMessage } from 'bento-common/utils/debugging';

const initializers: Record<
  VisualBuilderSessionType,
  WysiwygEditorSpecializationInitializer<any>
> = {
  [VisualBuilderSessionType.Tag]: initializeTagEditor,
  [VisualBuilderSessionType.Autocomplete]: initializeAutocompleteElementEditor,
  [VisualBuilderSessionType.AutoGuideBuilder]:
    initializeAutocompleteElementEditor,
  [VisualBuilderSessionType.Inline]: initializeInlineInjectionEditor,
};

let specializationHelpers: WysiwygEditorSpecializationHelpers<any> | null;

const handleVisualBuilderMessage = ({
  data: { action, payload },
}: MessageEvent) => {
  switch (action) {
    case 'previewData': {
      if (!specializationHelpers) {
        specializationHelpers = initializers[payload.type]({
          expandEditor: () => {},
          collapseEditor: () => {},
        });
      }

      specializationHelpers?.updatePreview(
        payload.elementSelector,
        payload.wildcardUrl,
        payload
      );

      break;
    }
  }
};

export const setupVisualBuilder = () => {
  debugMessage('[BENTO] Setting up visual builder');

  window.addEventListener('message', handleVisualBuilderMessage);

  /**
   * Notify the visual builder that the embed is now setup to
   * receive preview data, so that we can do an initial sync if
   * needed
   */
  window.postMessage(
    {
      action: 'visualBuilderInitialized',
      payload: {},
    },
    '*'
  );
};

export const cleanupVisualBuilder = () => {
  window.removeEventListener('message', handleVisualBuilderMessage);

  specializationHelpers = null;
};
