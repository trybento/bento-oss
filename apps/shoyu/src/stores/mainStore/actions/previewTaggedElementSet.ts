import { TaggedElement } from 'bento-common/types/globalShoyuState';

import { WorkingState } from '../types';

type SetPreviewTaggedElementPayload = {
  taggedElement: TaggedElement;
};

const previewTaggedElementSet = (
  state: WorkingState,
  { taggedElement }: SetPreviewTaggedElementPayload
) => {
  state.taggedElements[taggedElement.entityId] = {
    ...taggedElement,
    isPreview: true,
  };
};

export default previewTaggedElementSet;
