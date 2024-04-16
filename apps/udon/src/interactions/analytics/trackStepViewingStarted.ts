import { EmbedViewSource } from 'shared/types';
import { analytics } from './analytics';
import { InternalTrackEvents } from 'bento-common/types';

type Args = {
  stepEntityId: string;
  viewedFrom?: EmbedViewSource;
  accountUserEntityId: string;
  organizationEntityId: string;
};

export function trackStepViewingStarted({
  stepEntityId,
  viewedFrom,
  accountUserEntityId,
  organizationEntityId,
}: Args) {
  return analytics.step.newEvent(InternalTrackEvents.stepViewingStarted, {
    viewedFrom,
    stepEntityId,
    accountUserEntityId,
    organizationEntityId,
  });
}
