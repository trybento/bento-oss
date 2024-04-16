import { AutoGuideBuilderData, WysiwygEditorState } from 'bento-common/types';
import { loadWysiwygEditor } from 'components/WysiwygEditor/editor';
import * as UpdateVisualBuilderSessionMutation from 'mutations/UpdateVisualBuilderSession';
import { VisualBuilderSessionState } from 'bento-common/types';

export async function loadAutoGuideBuilderEditor({
  visualBuilderSessionEntityId,
  initialState,
}: {
  visualBuilderSessionEntityId: string;
  initialState: WysiwygEditorState<AutoGuideBuilderData>;
}) {
  await UpdateVisualBuilderSessionMutation.commit({
    visualBuilderSessionEntityId,
    state: VisualBuilderSessionState.InProgress,
  });

  await loadWysiwygEditor({ visualBuilderSessionEntityId, initialState });
}
