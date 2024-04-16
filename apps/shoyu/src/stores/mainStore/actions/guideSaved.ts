import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';

import { guideSelector } from '../helpers/selectors';
import saveGuideForLater from '../mutators/saveGuideForLater';
import { WorkingState } from '../types';
import mainStore from '..';

export default function guideSaved(
  state: WorkingState,
  { guide: guideEntityId }: GlobalStateActionPayloads['guideSaved']
) {
  const guide = guideSelector(guideEntityId, state);
  if (guide) {
    guide.savedAt = new Date();

    if (!guide.isPreview) {
      saveGuideForLater({ guideEntityId });
    } else {
      setTimeout(() => {
        mainStore.getState().dispatch({
          type: 'guideChanged',
          guide: {
            entityId: guideEntityId,
            savedAt: undefined,
          },
        });
      }, 1000);
    }
  }
}
