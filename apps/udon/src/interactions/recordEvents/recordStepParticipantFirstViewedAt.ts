import { SelectedModelAttrsPick } from 'bento-common/types';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Step } from 'src/data/models/Step.model';
import { StepParticipant } from 'src/data/models/StepParticipant.model';

type Args = {
  step: SelectedModelAttrsPick<Step, 'id'>;
  accountUser: SelectedModelAttrsPick<AccountUser, 'id'>;
  organizationId: number;
};

/**
 * Also update view count
 * @returns If it's the first time viewing
 */
export async function recordStepParticipantFirstViewedAt({
  step,
  accountUser,
  organizationId,
}: Args) {
  const now = new Date();
  const [stepParticipant] = await StepParticipant.findOrCreate({
    where: {
      organizationId,
      stepId: step.id,
      accountUserId: accountUser.id,
    },
  });

  if (!stepParticipant) return false;

  let firstView = false;
  const updateQuery = {
    viewCount: stepParticipant.viewCount + 1,
  };

  if (!stepParticipant.firstViewedAt) {
    updateQuery['firstViewedAt'] = now;
    firstView = true;
  }

  await stepParticipant.update(updateQuery);
  return firstView;
}
