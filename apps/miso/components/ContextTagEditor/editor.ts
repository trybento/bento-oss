import { TagEditorData, WysiwygEditorState } from 'bento-common/types';
import { loadWysiwygEditor } from 'components/WysiwygEditor/editor';
import * as UpdateVisualBuilderSessionMutation from 'mutations/UpdateVisualBuilderSession';
import { VisualBuilderSessionState } from 'bento-common/types';

export async function loadTagEditor({
  visualBuilderSessionEntityId,
  initialState,
}: {
  visualBuilderSessionEntityId: string;
  initialState: WysiwygEditorState<TagEditorData>;
}) {
  await UpdateVisualBuilderSessionMutation.commit({
    visualBuilderSessionEntityId,
    previewData: initialState.data.guide,
    state: VisualBuilderSessionState.InProgress,
  });

  await loadWysiwygEditor({ visualBuilderSessionEntityId, initialState });
}
