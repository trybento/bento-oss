import { InternalTrackEvents } from 'bento-common/types';
import { analytics } from './analytics';
import { EmbedViewSource } from 'shared/types';
import { Step } from 'src/data/models/Step.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { recordStepParticipantFirstViewedAt } from '../recordEvents/recordStepParticipantFirstViewedAt';

type Args = {
  step: Step;
  accountUser: AccountUser;
};

/**
 * For use with fake step views where a user completes a step manually
 *   but hasn't actually tracked a view for it
 */
export async function trackStepPseudoView({ step, accountUser }: Args) {
  const organization = await accountUser.$get('organization', {
    attributes: ['id', 'entityId'],
  });

  await recordStepParticipantFirstViewedAt({
    step,
    accountUser,
    organizationId: organization!.id,
  });

  await analytics.step.newEvent(InternalTrackEvents.stepViewingStarted, {
    viewedFrom: EmbedViewSource.none,
    stepEntityId: step.entityId,
    accountUserEntityId: accountUser.entityId,
    organizationEntityId: organization!.entityId,
  });
}
