import { EmbedViewSource } from 'shared/types';
import { InternalTrackEvents } from 'bento-common/types';

import { analytics } from './analytics';

type Args = {
  guideEntityId: string;
  viewedFrom?: EmbedViewSource;
  accountUserEntityId: string;
  organizationEntityId: string;
};

export async function trackGuideViewingStarted({
  guideEntityId,
  viewedFrom,
  accountUserEntityId,
  organizationEntityId,
}: Args) {
  return await analytics.guide.newEvent(
    InternalTrackEvents.guideViewingStarted,
    {
      data: {
        viewedFrom,
      },
      guideEntityId,
      accountUserEntityId,
      organizationEntityId,
    }
  );
}
