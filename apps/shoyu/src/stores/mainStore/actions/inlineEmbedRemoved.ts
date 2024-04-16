import { InlineEmbedEntityId } from 'bento-common/types/globalShoyuState';

import { WorkingState } from '../types';

export default function inlineEmbedRemoved(
  state: WorkingState,
  payload: { entityId: InlineEmbedEntityId }
) {
  delete state.inlineEmbeds[payload.entityId];
}
