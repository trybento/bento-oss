import {
  WysiwygEditorHelperText,
  WysiwygEditorLabels,
  WysiwygEditorMode,
} from 'bento-common/types';
import React, { useCallback, useMemo } from 'react';

import WysiwygEditor, {
  WysiwygEditorTab,
  WysiwygSaveButtonDisabledGetter,
  WysiwygSaveButtonLabelGetter,
} from '../WysiwygEditor';

const navigateTab: WysiwygEditorTab = {
  label: WysiwygEditorLabels.navigate,
  isActive: (mode) => mode === WysiwygEditorMode.navigate,
  isComplete: (_, progress) => progress[WysiwygEditorMode.navigate],
  isDisabled: () => false,
  modeOnClick: WysiwygEditorMode.navigate,
};

const buildTab: WysiwygEditorTab = {
  label: WysiwygEditorLabels.build,
  isActive: (mode) =>
    [
      WysiwygEditorMode.selectElement,
      WysiwygEditorMode.confirmElement,
    ].includes(mode),
  isComplete: (_, progress) => progress[WysiwygEditorMode.confirmElement],
  isDisabled: (_, progress) => !progress[WysiwygEditorMode.navigate],
  modeOnClick: WysiwygEditorMode.selectElement,
};

const AutoCompeleteElementEditor: React.FC = () => {
  const editorTabs: WysiwygEditorTab[] = useMemo(
    () => [navigateTab, buildTab],
    [],
  );

  const isSaveDisabled = useCallback<WysiwygSaveButtonDisabledGetter>(
    (mode) => mode === WysiwygEditorMode.selectElement,
    [],
  );

  const getSaveButtonLabel = useCallback<WysiwygSaveButtonLabelGetter>(
    (mode) => (mode === WysiwygEditorMode.navigate ? 'Start' : 'Save'),
    [],
  );

  const getModeHelperText = useCallback(
    (mode: WysiwygEditorMode): string | undefined => {
      switch (mode) {
        case WysiwygEditorMode.navigate:
          return WysiwygEditorHelperText.navigate;
        case WysiwygEditorMode.selectElement:
        case WysiwygEditorMode.confirmElement:
          return WysiwygEditorHelperText.build;
        case WysiwygEditorMode.customize:
        default:
          return undefined;
      }
    },
    [],
  );

  return (
    <WysiwygEditor
      title={'Auto-complete element selector'}
      tabs={editorTabs}
      getModeHelperText={getModeHelperText}
      isSaveDisabled={isSaveDisabled}
      getSaveButtonLabel={getSaveButtonLabel}
    />
  );
};

export default AutoCompeleteElementEditor;
