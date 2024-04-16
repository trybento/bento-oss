import {
  AutocompleteElementEditorData,
  WysiwygEditorMode,
  WysiwygEditorState,
} from 'bento-common/types';
import { loadWysiwygEditor } from 'components/WysiwygEditor/editor';
import * as UpdateVisualBuilderSessionMutation from 'mutations/UpdateVisualBuilderSession';
import { VisualBuilderSessionState } from 'bento-common/types';

export const autocompleteElementEditorModes: WysiwygEditorMode[] = [
  WysiwygEditorMode.navigate,
  WysiwygEditorMode.selectElement,
  WysiwygEditorMode.confirmElement,
];

export async function loadAutocompleteElementEditor({
  visualBuilderSessionEntityId,
  initialState,
}: {
  visualBuilderSessionEntityId: string;
  initialState: WysiwygEditorState<AutocompleteElementEditorData>;
}) {
  await UpdateVisualBuilderSessionMutation.commit({
    visualBuilderSessionEntityId,
    state: VisualBuilderSessionState.InProgress,
  });

  loadWysiwygEditor({ visualBuilderSessionEntityId, initialState });
}
