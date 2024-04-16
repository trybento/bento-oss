import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';
import { InternalTrackEvents } from 'bento-common/types';

import { guideSelector } from '../helpers/selectors';
import trackGuideView from '../mutators/trackGuideView';
import { WorkingState } from '../types';

export default function guideViewed(
  state: WorkingState,
  {
    formFactor,
    eventType,
    guide: guideEntityId,
  }: GlobalStateActionPayloads['guideViewed']
) {
  const guide = guideSelector(guideEntityId, state);
  if (guide) {
    switch (eventType) {
      case InternalTrackEvents.guideViewingStarted:
        guide.isViewed = true;
        break;
    }

    if (!guide.isPreview) {
      trackGuideView({ formFactor, type: eventType, guideEntityId });
    }
  }
}
