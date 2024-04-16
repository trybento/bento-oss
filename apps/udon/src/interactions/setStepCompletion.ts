import {
  GuideDesignType,
  GuideTypeEnum,
  SelectedModelAttrs,
} from 'bento-common/types';
import { Op } from 'sequelize';
import { isFlatTheme } from 'bento-common/data/helpers';
import { withTransaction } from 'src/data';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { updateGuideCompletion } from 'src/interactions/updateGuideCompletion';
import { updateGuideModuleCompletion } from 'src/interactions/updateGuideModuleCompletion';
import recordStepCompletion from './recordEvents/recordStepCompletion';
import { enableStepProgressSyncing } from 'src/utils/features';
import { InputWithAnswer } from 'src/graphql/InputStep/types';
import detachPromise from 'src/utils/detachPromise';
import { User } from 'src/data/models/User.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { StepParticipant } from 'src/data/models/StepParticipant.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { Organization } from 'src/data/models/Organization.model';
import { trackStepPseudoView } from './analytics/trackStepPseudoView';
import { Template } from 'src/data/models/Template.model';
import { updateGuideExpireAt } from './updateGuideExpireAt';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';
import { QueueCompletedNotificationPayload } from 'src/jobsBull/jobs/notifications/types';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

type SetStepCompletionArgs = {
  step: Step;
  isComplete: boolean;
  completedByType?: StepCompletedByType | null;
  user?: User;
  accountUser?: AccountUser;
  /** If we should propagate the completion account-wide */
  shouldApplyToGuideStepBase?: boolean;
  updatedByAttributes?: { [x: string]: string };
  updatedByChoice?: string;
  /** Whether or not the completion is called by a sync */
  isSyncAction?: boolean;
  inputsWithAnswers?: InputWithAnswer[];
};

/** How long before running notif job */
const NOTIF_DELAY = 1000;

export async function setStepCompletion({
  step,
  isComplete,
  completedByType,
  user,
  accountUser,
  shouldApplyToGuideStepBase,
  updatedByAttributes,
  updatedByChoice,
  isSyncAction,
  inputsWithAnswers,
}: SetStepCompletionArgs) {
  const now = new Date();
  if (isComplete && !completedByType) {
    throw new Error("Must specify 'completedByType' if completing step");
  }
  let guide = (await Guide.findOne({
    where: {
      id: step.guideId,
    },
    include: [
      { model: Organization, attributes: ['entityId'] },
      {
        model: Template,
        attributes: [
          'entityId',
          'name',
          'isSideQuest',
          'formFactor',
          'theme',
          'type',
        ],
      },
    ],
  })) as Guide & {
    organization: SelectedModelAttrs<Organization, 'entityId'>;
    createdFromTemplate: SelectedModelAttrs<
      Template,
      'entityId' | 'name' | 'isSideQuest' | 'formFactor' | 'theme' | 'type'
    >;
  };

  if (!guide) {
    throw new Error('No guide found');
  }

  const template = guide.createdFromTemplate!;

  /* If no accountUser provided and we have a user guide, we can look up the user */
  if (!accountUser && template.type === GuideTypeEnum.user) {
    const gp = await GuideParticipant.findOne({
      where: {
        guideId: guide.id,
      },
      include: [AccountUser],
    });

    if (gp) accountUser = gp.accountUser;
  }

  await withTransaction(async () => {
    if (accountUser) {
      const stepParticipant = await StepParticipant.findOne({
        where: {
          stepId: step.id,
          accountUserId: accountUser.id,
        },
      });

      if (stepParticipant && stepParticipant.skippedAt) {
        await stepParticipant.update({
          skippedAt: null,
        });
      } else if (
        !stepParticipant &&
        completedByType !== StepCompletedByType.Auto
      ) {
        /* Likely completed without viewing. Record a view for analytics purposes */
        detachPromise(
          () =>
            trackStepPseudoView({
              step,
              accountUser: accountUser!,
            }),
          'record phantom step view'
        );
      }
    }

    if (!isComplete) {
      await step.update({
        isComplete: false,
        completedAt: null,
        completedByType: null,
        completedByUserId: null,
        completedByAccountUserId: null,
      });

      if (step.guideModuleId) {
        const guideModule = await GuideModule.findOne({
          where: {
            id: step.guideModuleId,
          },
        });

        if (guideModule) {
          await updateGuideModuleCompletion({
            guideModule,
            timestamp: now,
          });
        }
      }

      await updateGuideCompletion({
        accountUser,
        guide: guide!,
        timestamp: now,
      });

      await updateGuideExpireAt({ guide: guide!, lastActivityAt: now });

      return step;
    }

    let completedByAttrs: {
      completedByType: StepCompletedByType;
      completedByUserId?: number | null;
      completedByAccountUserId?: number;
    };

    if (completedByType === StepCompletedByType.User) {
      if (!user) {
        throw new InvalidPayloadError(
          'Step specified as completed by user but no user was given.'
        );
      }

      if (user.organizationId !== step.organizationId) {
        if (user.isSuperadmin) {
          // TODO: Do something about super-admins modifying user data
          completedByAttrs = {
            completedByType: StepCompletedByType.User,
            completedByUserId: null,
          };
        } else {
          throw new Error('Unauthorized');
        }
      } else {
        completedByAttrs = {
          completedByType: StepCompletedByType.User,
          completedByUserId: user!.id,
        };
      }
    } else if (completedByType === StepCompletedByType.AccountUser) {
      if (!accountUser) {
        throw new InvalidPayloadError(
          'Step specified as completed by account user but no account user was given.'
        );
      }

      completedByAttrs = {
        completedByType: StepCompletedByType.AccountUser,
        completedByAccountUserId: accountUser!.id,
      };
    } else {
      completedByAttrs = {
        completedByType: StepCompletedByType.Auto,
        completedByAccountUserId: accountUser!.id,
      };
    }

    await step.update({
      isComplete: true,
      completedAt: now,
      ...(completedByAttrs ?? {
        completedByType: StepCompletedByType.AccountUser,
        ...(accountUser ? { completedByAccountUserId: accountUser!.id } : {}),
      }),
    });

    await updateGuideExpireAt({ guide: guide!, lastActivityAt: now });

    detachPromise(
      async () =>
        guide &&
        recordStepCompletion({
          accountUser,
          step,
          guide,
          user,
          inputsWithAnswers,
          updatedByChoice,
        }),
      'setStepCompletion: recordStepCompletion'
    );

    if (step.guideModuleId) {
      const guideModule = await GuideModule.findOne({
        where: {
          id: step.guideModuleId,
        },
      });

      if (guideModule) {
        await updateGuideModuleCompletion({
          guideModule,
          timestamp: now,
        });
      }
    }

    if (shouldApplyToGuideStepBase && step.createdFromGuideStepBaseId) {
      await Step.update(
        {
          isComplete: isComplete,
          completedAt: isComplete ? now : null,
          completedByType: isComplete ? StepCompletedByType.Auto : null,
          ...(accountUser && isComplete
            ? {
                completedByAccountUserId: accountUser.id,
              }
            : {}),
        },
        {
          where: {
            createdFromGuideStepBaseId: step.createdFromGuideStepBaseId,
            id: {
              [Op.not]: step.id,
            },
          },
        }
      );
    }

    guide = await updateGuideCompletion({
      accountUser,
      guide: guide!,
      timestamp: now,
      user,
    });

    if (!guide) throw new Error('Missing completed guide');

    if (template.designType !== GuideDesignType.announcement && !isSyncAction) {
      const params: QueueCompletedNotificationPayload = {
        ...completedByAttrs,
        updatedByAttributes,
        updatedByChoice,
        stepEntityId: step.entityId,
        inputsWithAnswers,
      };

      await queueJob(
        { jobType: JobType.HandleStepCompletedNotifications, ...params },
        {
          delayInMs: NOTIF_DELAY,
        }
      );

      const useStepSync = await enableStepProgressSyncing.enabled(
        step.organizationId
      );

      if (
        (accountUser || user) &&
        !isFlatTheme(template.theme) &&
        useStepSync
      ) {
        await queueJob(
          {
            jobType: JobType.SyncStepProgress,
            stepId: step.id,
            ...(accountUser && { accountUserId: accountUser.id }),
            ...(user && { userId: user.id }),
          },
          {
            delayInMs: 15000,
          }
        );
      }
    }

    return step;
  });

  await step.reload();

  return step;
}
