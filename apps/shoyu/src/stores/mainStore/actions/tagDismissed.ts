import { GlobalStateActionPayload } from 'bento-common/types/globalShoyuState';

import { taggedElementSelector } from '../helpers/selectors';
import dismissTag from '../mutators/dismissTag';
import { WorkingState } from '../types';
import mainStore from '..';

const tagDismissed = (
  state: WorkingState,
  payload: GlobalStateActionPayload<'tagDismissed'>
) => {
  const tag = taggedElementSelector(payload.tag, state);

  if (!tag) return;

  /** If in preview mode and told to revert, resets the tag as not dismissed. */
  if (tag.isPreview && payload.revert) {
    tag.dismissedAt = null;
    return;
  }

  tag.dismissedAt = new Date();

  if (tag.isPreview) {
    /**
     * Caching the tagEntityId and re-selecting the dispatch method
     * is needed because the proxy of the working state will be revoked
     * by the time the setTimeout callback function actually runs.
     */
    const cachedTagEntityId = tag.entityId;
    setTimeout(() => {
      mainStore.getState().dispatch({
        type: 'tagDismissed',
        tag: cachedTagEntityId,
        revert: true,
      });
    }, 3000);
  } else {
    dismissTag({ tagEntityId: payload.tag });
  }
};
export default tagDismissed;
