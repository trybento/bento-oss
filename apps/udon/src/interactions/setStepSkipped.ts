import { isSingleStepGuide } from 'bento-common/utils/formFactor';
import { SelectedModelAttrs } from 'bento-common/types';

import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { Organization } from 'src/data/models/Organization.model';
import { Step } from 'src/data/models/Step.model';
import { StepParticipant } from 'src/data/models/StepParticipant.model';
import { Template } from 'src/data/models/Template.model';
import { updateGuideCompletion } from 'src/interactions/updateGuideCompletion';
import { Events, analytics } from './analytics/analytics';
import detachPromise from 'src/utils/detachPromise';
import NoContentError from 'src/errors/NoContentError';

type SetStepSkippedArgs = {
  /** Step entity id */
  entityId: string;
  /** Whether the step is skipped */
  isSkipped: boolean;
  /** Associated account user */
  accountUser: AccountUser;
  /** Associated organization */
  organization: Organization;
};

/**
 * Perform a step skip. Unlike complete, it has less functionality because it doesn't make sense
 * for an admin to skip for a user, and skipping a step should not trigger actions such as branching
 *
 * @returns Promise the affected Step with associated Guide and a partial Template
 */
export async function setStepSkipped({
  entityId,
  isSkipped,
  accountUser,
  organization,
}: SetStepSkippedArgs) {
  /** @todo consider removing this check in favor of TS checks */
  if (!accountUser || !organization) {
    throw new Error('Missing accountUser or organization');
  }

  const step = (await Step.findOne({
    where: {
      entityId,
      organizationId: organization.id,
    },
    include: [
      {
        model: Guide.scope({
          method: [
            'withTemplate',
            { required: true, attributes: ['theme', 'formFactor'] },
          ],
        }),
      },
    ],
  })) as Step & {
    guide: Guide & {
      createdFromTemplate: SelectedModelAttrs<Template, 'theme' | 'formFactor'>;
    };
  };

  if (!step) {
    throw new NoContentError(entityId, 'step');
  }

  const guide = step.guide;

  const [stepParticipant] = await StepParticipant.upsert(
    {
      stepId: step.id,
      accountUserId: accountUser.id,
      organizationId: organization.id,
    },
    { conflictFields: ['step_id', 'account_user_id'] }
  );

  if (!stepParticipant) {
    throw new Error('No step participant found');
  }

  /**
   * Skipping a single-step guide (i.e. modal, banner, tooltip) or a Flow is dismissing it.
   */
  if (
    isSingleStepGuide(
      guide.createdFromTemplate!.theme,
      guide.createdFromTemplate!.formFactor
    )
  )
    detachPromise(
      () =>
        analytics.guide.newEvent(Events.dismissed, {
          guideEntityId: guide.entityId,
          accountUserEntityId: accountUser.entityId,
          organizationEntityId: organization.entityId,
        }),
      'record single-step guide as dismissed'
    );

  const now = new Date();

  await stepParticipant.update({
    skippedAt: isSkipped ? now : null,
  });

  await updateGuideCompletion({
    accountUser,
    guide,
    timestamp: now,
  });

  // WARNING: We must also reload the guide to avoid a potential stale guide
  // in cases where the guide is updated (i.e. skipping a modal)
  await step.reload({
    include: [Guide],
  });

  return step;
}
