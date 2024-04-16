import { WysiwygEditorState } from 'bento-common/types';
import { prefixUrl, sanitizeUrl } from './utils';
import * as UpdateVisualBuilderSessionMutation from 'mutations/UpdateVisualBuilderSession';

export async function loadWysiwygEditor<D>({
  visualBuilderSessionEntityId,
  initialState,
}: {
  visualBuilderSessionEntityId: string;
  initialState: WysiwygEditorState<D>;
}) {
  await UpdateVisualBuilderSessionMutation.commit({
    visualBuilderSessionEntityId,
    progressData: {
      ...initialState,
      initialLoad: true,
    },
  });

  window.location.href = prefixUrl(sanitizeUrl(initialState.url));
}
