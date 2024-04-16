import { AutocompleteElementEditorData } from 'bento-common/types';
import { WysiwygEditorSpecializationHelpers } from './types';

// The auto-complete editor doesn't need any specialization
const initialize =
  (): WysiwygEditorSpecializationHelpers<AutocompleteElementEditorData> => ({
    updatePreview: () => {},
    cleanupPreview: () => {},
  });

export default initialize;
