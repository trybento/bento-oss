import {
  GuideState,
  GuideTypeEnum,
  SelectedModelAttrsPick,
} from 'bento-common/types';
import promises from 'src/utils/promises';
import { Op } from 'sequelize';

import { QueryDatabase, queryRunner } from 'src/data';
import {
  Guide,
  GuideScope,
  isGuideFinished,
} from 'src/data/models/Guide.model';
import { User } from 'src/data/models/User.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import AutoCompleteInteraction from 'src/data/models/AutoCompleteInteraction.model';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { Logger } from 'src/jobsBull/logger';
import { JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import { setStepCompletion } from '../setStepCompletion';
import {
  triggerAvailableGuidesChangedForGuides,
  triggerGuideBaseChangedForSteps,
  triggerGuideChangedForSteps,
} from 'src/data/eventUtils';
import { Template } from 'src/data/models/Template.model';

export type AutoCompleteStepOnGuideCompletionArgs = {
  /** The guide ID that got completed */
  completedGuideId: number;
  /** User ID that completed the guide */
  completedByUserId?: number;
  /** AccountUser ID that completed the guide */
  completedByAccountUserId?: number;
  /** Indicates the last step id already processed */
  lastStepId?: number;
  /** The batch size */
  batchSize?: number;
  /**
   * Determines if the job can be re-queued or queue the next batch
   * @default true
   **/
  canRequeue?: boolean;
};

/**
 * Determines how many Step instances can be queried/completed in each job batch.
 * Each Step completion will still be processed serially.
 *
 * @default 50
 */
const BATCH_SIZE = 50;

export async function autoCompleteStepsOnGuideCompletion(
  args: AutoCompleteStepOnGuideCompletionArgs,
  logger?: Logger
): Promise<void> {
  const {
    completedGuideId,
    completedByUserId,
    completedByAccountUserId,
    lastStepId = 0,
    batchSize = BATCH_SIZE,
    canRequeue = true,
  } = args;

  const [guideCompleted, completedByUser, completedByAccountUser] =
    await Promise.all([
      Guide.scope({
        method: [
          GuideScope.withTemplate,
          {
            required: true,
            attributes: ['type'],
          },
        ],
      }).findByPk(completedGuideId, {
        attributes: [
          'id',
          'organizationId',
          'accountId',
          'createdFromTemplateId',
        ],
      }) as Promise<
        | null
        | (SelectedModelAttrsPick<
            Guide,
            'id' | 'organizationId' | 'accountId' | 'createdFromTemplateId'
          > & {
            createdFromTemplate: SelectedModelAttrsPick<Template, 'type'>;
          })
      >,
      User.findByPk(completedByUserId),
      AccountUser.findByPk(completedByAccountUserId),
    ]);

  if (!guideCompleted) {
    logger?.debug('Skipped due to guide not found.');
    return;
  }

  // find all interactions waiting on this guide's completion
  const autoCompleteInteractions = (await AutoCompleteInteraction.scope([
    { method: ['fromOrg', guideCompleted.organizationId] },
    {
      method: [
        'guideCompletionsOfTemplate',
        guideCompleted.createdFromTemplateId,
      ],
    },
  ]).findAll({
    attributes: ['completableId'],
  })) as Pick<AutoCompleteInteraction, 'completableId'>[];

  if (!autoCompleteInteractions.length) {
    logger?.debug('Skipped due to no auto-complete interactions found.');
    return;
  }

  const affectedStepPrototypeIds = autoCompleteInteractions.map(
    (aui) => aui.completableId
  );

  let affectedStepsIds: { id: number }[];

  switch (guideCompleted.createdFromTemplate.type) {
    /**
     * If the completed guide is an ACCOUNT guide,
     * then it means that all steps of guides launched to the affected account
     * needs to be completed, regardless of the account user.
     *
     * The below query finds all steps dependent on the completed guide
     * that are part of any guide launched in the whole account.
     */
    case GuideTypeEnum.account:
      affectedStepsIds = (await queryRunner({
        sql: `--sql
          select
            distinct s.id
          from core.guides g
            join core.guide_modules gm on gm.guide_id = g.id
            join core.steps s on s.guide_module_id = gm.id
          where
            g.organization_id = :organizationId
            and g.state = :guideState
            and g.account_id = :accountId
            and s.created_from_step_prototype_id IN (:createdFromStepPrototypeIds)
            and s.completed_at is null
            and s.id > :lastStepId
						AND gm.deleted_at IS NULL
          order by
            s.id asc
          limit
            :batchSize
        `,
        replacements: {
          organizationId: guideCompleted.organizationId,
          guideState: GuideState.active,
          accountId: guideCompleted.accountId,
          createdFromStepPrototypeIds: affectedStepPrototypeIds,
          lastStepId,
          batchSize,
        },
        queryDatabase: QueryDatabase.primary,
      })) as { id: number }[];
      break;

    /**
     * If the completed guide is an USER guide,
     * then it means that only the steps of guides launched to the affected account
     * and accountUser needs to be completed.
     *
     * The below query finds all steps dependent on the completed guide
     * that are part of any guide launched to the accountUser.
     */
    case GuideTypeEnum.user:
      affectedStepsIds = (await queryRunner({
        sql: `--sql
          select
            distinct s.id
          from core.guides g
            join core.guide_participants gp
              on (gp.guide_id = g.id and gp.account_user_id = :accountUserId)
            join core.guide_modules gm on gm.guide_id = g.id
            join core.steps s on s.guide_module_id = gm.id
          where
            g.organization_id = :organizationId
            and g.state = :guideState
            and g.account_id = :accountId
            and gp.obsoleted_at is null
            and s.created_from_step_prototype_id IN (:createdFromStepPrototypeIds)
            and s.completed_at is null
						AND gm.deleted_at IS NULL
            and s.id > :lastStepId
          order by
            s.id asc
          limit
            :batchSize
        `,
        replacements: {
          organizationId: guideCompleted.organizationId,
          guideState: GuideState.active,
          accountId: guideCompleted.accountId,
          accountUserId: completedByAccountUser?.id || 0,
          createdFromStepPrototypeIds: affectedStepPrototypeIds,
          lastStepId,
          batchSize,
        },
        queryDatabase: QueryDatabase.primary,
      })) as { id: number }[];
      break;

    default:
      affectedStepsIds = [];
  }

  // nothing to do
  if (!affectedStepsIds.length) {
    logger?.debug('Skipped due no affected steps being found.');
    return;
  }

  // find all affected step instances including the associated guide
  const affectedSteps = await Step.findAll({
    where: { id: { [Op.in]: affectedStepsIds.map((r) => r.id) } },
    include: [
      {
        model: Guide,
        attributes: ['id', 'completedAt', 'doneAt'],
        required: true,
      },
    ],
    order: [['id', 'asc']],
  });

  await promises.mapSeries(affectedSteps, async (step, index) => {
    try {
      await setStepCompletion({
        step,
        isComplete: true,
        completedByType: StepCompletedByType.Auto,
        user: completedByUser || undefined,
        accountUser: completedByAccountUser || undefined,
      });

      // check if the affected guide is now complete
      if (isGuideFinished(step.guide)) {
        // for end-users
        triggerAvailableGuidesChangedForGuides([step.guide]);
      }
      // for end-users
      triggerGuideChangedForSteps([step]);
      // for admins
      triggerGuideBaseChangedForSteps([step]);
    } catch (innerError) {
      // rethrow if we cannot requeue the failed step separately
      if (!canRequeue) {
        logger?.error(`Step #${step.id} failed to complete`);
        throw innerError;
      }

      logger?.warn(`Step #${step.id} failed, re-queueing separately`);

      // separate the failed step into a new job to allow moving forward
      await queueJob({
        jobType: JobType.AutoCompleteStepOnGuideCompletion,
        ...args,
        lastStepId: step[index - 1] || 0, // previous
        batchSize: 1,
        canRequeue: false,
      });
    }
  });

  // if we can't re-queue or we found less data, finish
  if (!canRequeue || affectedStepsIds.length < batchSize) return;

  const nextLastStepId = affectedStepsIds?.[affectedStepsIds.length - 1].id;

  logger?.debug(`Queueing the next batch (${nextLastStepId}:${batchSize})`);

  await queueJob({
    jobType: JobType.AutoCompleteStepOnGuideCompletion,
    ...args,
    lastStepId: nextLastStepId,
  });
}
