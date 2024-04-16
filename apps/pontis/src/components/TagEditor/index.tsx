import {
  TagEditorData,
  WysiwygEditorHelperText,
  WysiwygEditorLabels,
  WysiwygEditorMode,
} from 'bento-common/types';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import React, { useCallback, useEffect, useMemo } from 'react';

import { useSession } from '~src/providers/VisualBuilderSessionProvider';

import WysiwygEditor, {
  WysiwygEditorTab,
  WysiwygSaveButtonLabelGetter,
} from '../WysiwygEditor';
import { FloatingPanelProgress } from '../WysiwygEditor/types';
import StepContentForm from './StepContentForm';
import StepsList from './StepsList';
import TagStyleForm from './TagStyleForm';

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
      WysiwygEditorMode.customizeContent,
    ].includes(mode),
  isComplete: (_, progress) =>
    progress[WysiwygEditorMode.confirmElement] ||
    progress[WysiwygEditorMode.customize],
  isDisabled: (_, progress) => !progress[WysiwygEditorMode.navigate],
  modeOnClick: WysiwygEditorMode.confirmElement,
};

const previewTab: WysiwygEditorTab = {
  label: WysiwygEditorLabels.preview,
  isActive: (mode) => mode === WysiwygEditorMode.preview,
  isComplete: () => false,
  isDisabled: (_, progress) => !progress[WysiwygEditorMode.selectElement],
  modeOnClick: WysiwygEditorMode.preview,
};

const TagEditor: React.FC = () => {
  const { progressData, previewData, setPreviewData } =
    useSession<TagEditorData>();

  const isFlow = useMemo(
    () => isFlowGuide(progressData.data.guide.formFactor),
    [progressData],
  );

  const canCustomizeContent = useMemo(
    () => progressData.modes.includes(WysiwygEditorMode.customizeContent),
    [progressData.modes],
  );

  useEffect(() => {
    setPreviewData(progressData.data.guide);
  }, [progressData.data]);

  const floatingPanelProgress = useMemo<FloatingPanelProgress>(
    () => ({
      [WysiwygEditorMode.confirmElement]: 1,
      [WysiwygEditorMode.customize]: 2,
      ...(canCustomizeContent
        ? { [WysiwygEditorMode.customizeContent]: 3 }
        : {}),
    }),
    [canCustomizeContent],
  );

  const getSaveButtonLabel = useCallback<WysiwygSaveButtonLabelGetter>(
    (mode) => (mode === WysiwygEditorMode.navigate ? 'Start design' : 'Save'),
    [],
  );

  const hasContent = previewData?.steps?.length > 0;

  const isSaveDisabled = useCallback(
    (mode: WysiwygEditorMode) =>
      ![WysiwygEditorMode.navigate, WysiwygEditorMode.preview].includes(mode),
    [],
  );

  const tabs = useMemo<WysiwygEditorTab[]>(
    () => [navigateTab, buildTab, ...(hasContent ? [previewTab] : [])],
    [hasContent],
  );

  const getModeHelperText = useCallback(
    (mode: WysiwygEditorMode): string | undefined => {
      switch (mode) {
        case WysiwygEditorMode.navigate:
          return WysiwygEditorHelperText.navigate;
        case WysiwygEditorMode.selectElement:
        case WysiwygEditorMode.confirmElement:
        case WysiwygEditorMode.customize:
        case WysiwygEditorMode.customizeContent:
          return WysiwygEditorHelperText.buildWithContent;
        case WysiwygEditorMode.preview:
          return WysiwygEditorHelperText.preview;
        default:
          return undefined;
      }
    },
    [],
  );

  return (
    <WysiwygEditor
      title={isFlow ? 'Flow builder' : 'Visual builder'}
      tabs={tabs}
      showFinalSaveButton={hasContent}
      floatingPanelProgress={floatingPanelProgress}
      getSaveButtonLabel={getSaveButtonLabel}
      getModeHelperText={getModeHelperText}
      isSaveDisabled={isSaveDisabled}
      StepsList={isFlow ? StepsList : undefined}
      CustomizeForm={TagStyleForm}
      StepContentForm={canCustomizeContent ? StepContentForm : undefined}
    />
  );
};

export default TagEditor;
