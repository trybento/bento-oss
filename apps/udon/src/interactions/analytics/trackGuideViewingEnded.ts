import { EmbedViewSource } from 'shared/types';
import { InternalTrackEvents } from 'bento-common/types';

import { analytics } from './analytics';

type Args = {
  guideEntityId: string;
  viewedFrom?: EmbedViewSource;
  accountUserEntityId: string;
  organizationEntityId: string;
};

export async function trackGuideViewingEnded({
  guideEntityId,
  viewedFrom,
  accountUserEntityId,
  organizationEntityId,
}: Args) {
  if (!guideEntityId) return;

  return await analytics.guide.newEvent(InternalTrackEvents.guideViewingEnded, {
    data: {
      viewedFrom,
    },
    guideEntityId,
    accountUserEntityId,
    organizationEntityId,
  });
}
