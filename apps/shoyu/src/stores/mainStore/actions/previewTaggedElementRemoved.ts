import { TaggedElement } from 'bento-common/types/globalShoyuState';
import { AtLeast } from 'bento-common/types';

import { WorkingState } from '../types';

type RemovePreviewTaggedElementPayload = {
  taggedElement: AtLeast<TaggedElement, 'entityId'>;
};

const previewTaggedElementRemoved = (
  state: WorkingState,
  { taggedElement }: RemovePreviewTaggedElementPayload
) => {
  delete state.taggedElements[taggedElement.entityId];
};

export default previewTaggedElementRemoved;
