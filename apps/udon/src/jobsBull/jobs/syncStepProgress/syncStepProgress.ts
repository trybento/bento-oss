import promises from 'src/utils/promises';
import { queryRunner } from 'src/data';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { setStepCompletion } from 'src/interactions/setStepCompletion';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { User } from 'src/data/models/User.model';
import {
  triggerGuideBaseChangedForSteps,
  triggerGuideChangedForSteps,
} from 'src/data/eventUtils';
import { JobHandler } from 'src/jobsBull/handler';
import { SyncStepProgressJob } from 'src/jobsBull/job';

/**
 * When a step's completion is toggled, check if the user has another instance of that step
 *   in another guide and sync changes to it
 * @returns Steps synced
 */
export const syncStepProgress = async (payload: SyncStepProgressJob) => {
  const sourceStep = await Step.findOne({
    where: {
      id: payload.stepId,
    },
  });

  if (!sourceStep || !sourceStep.createdFromStepPrototypeId) return [];

  const isSourceCompleted = !!sourceStep.completedAt;
  let otherStepIds: { id: number }[] = [];
  let accountUser: AccountUser | undefined;
  let user: User | undefined;
  let completedByType = StepCompletedByType.AccountUser;

  if (payload.accountUserId) {
    /* Account user toggles a step state */
    accountUser =
      (await AccountUser.findOne({
        where: {
          id: payload.accountUserId,
        },
      })) || undefined;

    if (!accountUser) return [];

    const sql = `--sql
				SELECT s.id FROM core.steps s
				JOIN core.guides g ON s.guide_id = g.id
				JOIN core.guide_participants gp ON gp.guide_id = g.id
				WHERE s.created_from_step_prototype_id = :stepPrototypeId
					AND gp.account_user_id = :accountUserId
					AND s.completed_at IS ${isSourceCompleted ? 'NULL' : 'NOT NULL'}
					AND s.id != :stepId
					AND g.deleted_at IS NULL
			`;

    /* Find the same step for same user that have different completion states */
    otherStepIds = (await queryRunner({
      sql,
      replacements: {
        stepPrototypeId: sourceStep.createdFromStepPrototypeId,
        accountUserId: payload.accountUserId,
        stepId: payload.stepId,
      },
    })) as { id: number }[];
  } else if (payload.userId) {
    /* Org user completes an account guide step */
    user =
      (await User.findOne({
        where: {
          id: payload.userId,
        },
      })) || undefined;

    if (!user) return [];

    completedByType = StepCompletedByType.User;

    const sql = `--sql
				SELECT s.id FROM core.steps s
				JOIN core.guides g ON s.guide_id = g.id
				JOIN core.guide_bases gb ON gb.id = g.created_from_guide_base_id
				WHERE s.created_from_step_prototype_id = :stepPrototypeId
					AND gb.account_id = (
						SELECT gb.account_id FROM core.steps s
						JOIN core.guides g ON s.guide_id = g.id
							AND g.deleted_at IS NULL
						JOIN core.guide_bases gb ON g.created_from_guide_base_id = gb.id
						WHERE s.id = :stepId
					)
					AND s.completed_at IS ${isSourceCompleted ? 'NULL' : 'NOT NULL'}
					AND s.id != :stepId
					AND g.deleted_at IS NULL
			`;

    /* Find the same step for same user that have different completion states */
    otherStepIds = (await queryRunner({
      sql,
      replacements: {
        stepPrototypeId: sourceStep.createdFromStepPrototypeId,
        stepId: payload.stepId,
      },
    })) as { id: number }[];
  }

  /* No steps to check, or user attached */
  if (!otherStepIds.length || (!accountUser && !user)) return [];

  const stepsToSync = await Step.findAll({
    where: {
      id: otherStepIds.map((row) => row.id),
    },
  });

  /* Sync the completion state to the mismatched steps that have been found */
  await promises.map(stepsToSync, async (step) => {
    await setStepCompletion({
      step,
      isComplete: isSourceCompleted,
      isSyncAction: true,
      completedByType,
      accountUser,
      user,
    });
  });

  return stepsToSync;
};

const handler: JobHandler<SyncStepProgressJob> = async (job, logger) => {
  const payload = job.data;
  const stepsSynced = await syncStepProgress(payload);

  if (stepsSynced) {
    logger.debug(
      `[syncStepProgressTask] Synced progress to ${stepsSynced.length} steps`
    );

    triggerGuideChangedForSteps(stepsSynced);
    triggerGuideBaseChangedForSteps(stepsSynced);
  }
};

export default handler;
