import {
  InlineInjectionEditorData,
  WysiwygEditorMode,
  WysiwygEditorState,
} from 'bento-common/types';
import { FullGuide } from 'bento-common/types/globalShoyuState';
import { loadWysiwygEditor } from 'components/WysiwygEditor/editor';
import * as UpdateVisualBuilderSessionMutation from 'mutations/UpdateVisualBuilderSession';
import { VisualBuilderSessionState } from 'bento-common/types';

export const inlineInjectionEditorModes: WysiwygEditorMode[] = [
  WysiwygEditorMode.navigate,
  WysiwygEditorMode.selectElement,
  WysiwygEditorMode.confirmElement,
  WysiwygEditorMode.customize,
  WysiwygEditorMode.preview,
];

export async function loadInlineInjectionEditor({
  visualBuilderSessionEntityId,
  initialState,
  guide,
}: {
  visualBuilderSessionEntityId: string;
  initialState: WysiwygEditorState<
    InlineInjectionEditorData,
    WysiwygEditorMode
  >;
  guide: FullGuide;
}) {
  await UpdateVisualBuilderSessionMutation.commit({
    visualBuilderSessionEntityId,
    previewData: guide,
    state: VisualBuilderSessionState.InProgress,
  });

  await loadWysiwygEditor({ visualBuilderSessionEntityId, initialState });
}
