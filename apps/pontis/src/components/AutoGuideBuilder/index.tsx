import {
  WysiwygEditorHelperText,
  WysiwygEditorLabels,
  WysiwygEditorMode,
} from 'bento-common/types';
import React, { useCallback, useMemo } from 'react';

import { useSession } from '~src/providers/VisualBuilderSessionProvider';

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

const recordTab: WysiwygEditorTab = {
  label: WysiwygEditorLabels.record,
  isActive: (mode) =>
    [
      WysiwygEditorMode.selectElement,
      WysiwygEditorMode.confirmElement,
      WysiwygEditorMode.recordInfo,
    ].includes(mode),
  isComplete: (_, progress) => progress[WysiwygEditorMode.confirmElement],
  isDisabled: (_, progress) => !progress[WysiwygEditorMode.navigate],
  modeOnClick: WysiwygEditorMode.selectElement,
};

const editTab: WysiwygEditorTab = {
  label: WysiwygEditorLabels.edit,
  isActive: (mode) => mode === WysiwygEditorMode.customize,
  isComplete: (_, progress) => progress[WysiwygEditorMode.customize],
  isDisabled: (_, progress) => !progress[WysiwygEditorMode.selectElement],
  modeOnClick: WysiwygEditorMode.customize,
};

const AutoGuideBuilder: React.FC = () => {
  const { progressData } = useSession();
  const editorTabs = useMemo(() => [navigateTab, recordTab, editTab], []);

  const isSaveDisabled = useCallback<WysiwygSaveButtonDisabledGetter>(
    (mode) =>
      mode !== WysiwygEditorMode.navigate &&
      mode !== WysiwygEditorMode.recordInfo &&
      !progressData.recordedActions.length,
    [progressData.recordedActions],
  );

  const getSaveButtonLabel = useCallback<WysiwygSaveButtonLabelGetter>(
    (mode) =>
      mode === WysiwygEditorMode.navigate
        ? 'Next'
        : mode === WysiwygEditorMode.recordInfo
        ? 'Start recording'
        : [
            WysiwygEditorMode.selectElement,
            WysiwygEditorMode.confirmElement,
          ].includes(mode)
        ? 'Stop recording'
        : 'Rerecord',
    [],
  );

  const getModeHelperText = useCallback(
    (mode: WysiwygEditorMode): string | undefined => {
      switch (mode) {
        case WysiwygEditorMode.navigate:
          return WysiwygEditorHelperText.navigate;
        case WysiwygEditorMode.selectElement:
        case WysiwygEditorMode.confirmElement:
        case WysiwygEditorMode.recordInfo:
          return WysiwygEditorHelperText.record;
        case WysiwygEditorMode.customize:
          return WysiwygEditorHelperText.recordEdit;
        default:
          return undefined;
      }
    },
    [],
  );

  return (
    <WysiwygEditor
      title="AI builder"
      tabs={editorTabs}
      getModeHelperText={getModeHelperText}
      isSaveDisabled={isSaveDisabled}
      getSaveButtonLabel={getSaveButtonLabel}
    />
  );
};

export default AutoGuideBuilder;
