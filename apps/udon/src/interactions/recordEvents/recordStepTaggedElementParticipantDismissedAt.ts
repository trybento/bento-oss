import { AccountUser } from 'src/data/models/AccountUser.model';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { StepTaggedElementParticipant } from 'src/data/models/StepTaggedElementParticipant.model';

type Args = {
  tag: StepTaggedElement;
  accountUser: AccountUser;
  organizationId: number;
};

export async function recordStepTaggedElementParticipantDismissedAt({
  tag,
  accountUser,
  organizationId,
}: Args) {
  const now = new Date();
  const [stepTaggedElementParticipant] =
    await StepTaggedElementParticipant.findOrCreate({
      where: {
        organizationId,
        stepTaggedElementId: tag.id,
        accountUserId: accountUser.id,
      },
    });

  return stepTaggedElementParticipant.update({ dismissedAt: now });
}
