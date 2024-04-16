import {
  WysiwygEditorHelperText,
  WysiwygEditorLabels,
  WysiwygEditorMode,
} from 'bento-common/types';
import React, { useCallback, useMemo } from 'react';

import { useSession } from '~src/providers/VisualBuilderSessionProvider';

import WysiwygEditor, {
  WysiwygEditorTab,
  WysiwygSaveButtonLabelGetter,
} from '../WysiwygEditor';
import { FloatingPanelProgress } from '../WysiwygEditor/types';
import InlineCustomizationForm from './InlineCustomizationForm';

export type InlineInjectionEditorModes =
  | WysiwygEditorMode.navigate
  | WysiwygEditorMode.selectElement
  | WysiwygEditorMode.confirmElement
  | WysiwygEditorMode.customize
  | WysiwygEditorMode.preview;

export const inlineInjectionEditorModes: InlineInjectionEditorModes[] = [
  WysiwygEditorMode.navigate,
  WysiwygEditorMode.selectElement,
  WysiwygEditorMode.confirmElement,
  WysiwygEditorMode.customize,
  WysiwygEditorMode.preview,
];

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
      WysiwygEditorMode.customize,
    ].includes(mode),
  isComplete: (_, progress) =>
    progress[WysiwygEditorMode.confirmElement] ||
    progress[WysiwygEditorMode.customize],
  isDisabled: (_, progress) => !progress[WysiwygEditorMode.navigate],
  modeOnClick: WysiwygEditorMode.confirmElement,
};

const previewTab: WysiwygEditorTab = {
  label: 'Preview',
  isActive: (mode) => mode === WysiwygEditorMode.preview,
  isComplete: () => false,
  isDisabled: (_, progress) => !progress[WysiwygEditorMode.selectElement],
  modeOnClick: WysiwygEditorMode.preview,
};

const floatingPanelProgress: FloatingPanelProgress = {
  [WysiwygEditorMode.confirmElement]: 1,
  [WysiwygEditorMode.customize]: 2,
};

const InlineInjectionEditor: React.FC = () => {
  const { previewData } = useSession();

  const isSaveDisabled = useCallback(
    (mode: WysiwygEditorMode) =>
      ![WysiwygEditorMode.navigate, WysiwygEditorMode.preview].includes(mode),
    [],
  );

  const getSaveButtonLabel = useCallback<WysiwygSaveButtonLabelGetter>(
    (mode) => (mode === WysiwygEditorMode.navigate ? 'Start' : 'Save'),
    [],
  );

  const hasContent = previewData?.steps?.length > 0;

  const getModeHelperText = useCallback(
    (mode: WysiwygEditorMode): string | undefined => {
      switch (mode) {
        case WysiwygEditorMode.navigate:
          return WysiwygEditorHelperText.navigate;
        case WysiwygEditorMode.selectElement:
        case WysiwygEditorMode.confirmElement:
        case WysiwygEditorMode.customize:
          return WysiwygEditorHelperText.build;
        case WysiwygEditorMode.preview:
          return WysiwygEditorHelperText.preview;
        default:
          return undefined;
      }
    },
    [],
  );

  const tabs = useMemo<WysiwygEditorTab[]>(
    () => [navigateTab, buildTab, ...(hasContent ? [previewTab] : [])],
    [hasContent],
  );

  return (
    <WysiwygEditor
      title="Embed styling"
      tabs={tabs}
      floatingPanelProgress={floatingPanelProgress}
      isSaveDisabled={isSaveDisabled}
      showFinalSaveButton={hasContent}
      getSaveButtonLabel={getSaveButtonLabel}
      getModeHelperText={getModeHelperText}
      CustomizeForm={InlineCustomizationForm}
    />
  );
};

export default InlineInjectionEditor;
