import promises from 'src/utils/promises';
import { keyBy } from 'lodash';
import { queryRunner } from 'src/data';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { Step } from 'src/data/models/Step.model';
import { User } from 'src/data/models/User.model';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';
import { setStepCompletion } from 'src/interactions/setStepCompletion';
import { logger } from 'src/utils/logger';
import { JobHandler } from 'src/jobsBull/handler';
import { PreCompleteStepsJob } from 'src/jobsBull/job';

/**
 * If the user has already completed a module via another guide
 *   it should start off as completed
 */
export const preCompleteSteps = async (payload: PreCompleteStepsJob) => {
  const stepsChanged: Step[] = [];
  const guide = await Guide.findOne({
    where: {
      id: payload.guideId,
    },
    include: [GuideModule],
  });

  if (!guide || !guide.guideModules) return stepsChanged;

  const sourceModuleIds = guide.guideModules.reduce((a, v) => {
    if (v.createdFromModuleId) a.push(v.createdFromModuleId);
    return a;
  }, [] as number[]);

  /* all the steps in new guide */
  const stepsThatMayNeedSyncing = await Step.findAll({
    where: { guideId: payload.guideId },
  });

  if (!stepsThatMayNeedSyncing || sourceModuleIds.length === 0)
    return stepsChanged;

  const stepsThatMayNeedSyncingByStepProtoId = keyBy(
    stepsThatMayNeedSyncing,
    'createdFromStepPrototypeId'
  );

  /* Get the already-launched steps that came from the same modules and are completed */
  const sql = `--sql
			SELECT s.id FROM core.steps s
			JOIN core.guide_modules gm ON s.guide_module_id = gm.id
			JOIN core.guide_participants gp ON s.guide_id = gp.guide_id
			WHERE s.completed_at IS NOT NULL
				AND gp.account_user_id = :accountUserId
				AND gm.created_from_module_id IN (:sourceModuleIds)
				AND s.guide_id != :guideId
				AND gm.deleted_at IS NULL
		`;

  const stepsAlreadyCompletedRows = (await queryRunner({
    sql,
    replacements: {
      accountUserId: payload.accountUserId,
      sourceModuleIds,
      guideId: payload.guideId,
    },
  })) as { id: number }[];

  if (!stepsAlreadyCompletedRows.length) return stepsChanged;

  /* Load info on existing steps that are completed */
  const stepsAlreadyCompleted = await Step.findAll({
    where: { id: stepsAlreadyCompletedRows.map((r) => r.id) },
  });

  /* For all the related existing completed steps, complete the new one if needed */
  await promises.map(stepsAlreadyCompleted, async (stepAlreadyCompleted) => {
    if (!stepAlreadyCompleted.createdFromStepPrototypeId) return stepsChanged;

    const stepToComplete =
      stepsThatMayNeedSyncingByStepProtoId[
        stepAlreadyCompleted.createdFromStepPrototypeId
      ];

    if (stepToComplete) {
      const accountUser = stepAlreadyCompleted.completedByAccountUserId
        ? (await AccountUser.findOne({
            where: { id: stepAlreadyCompleted.completedByAccountUserId },
          })) || undefined
        : undefined;

      const user = stepAlreadyCompleted.completedByUserId
        ? (await User.findOne({
            where: { id: stepAlreadyCompleted.completedByUserId },
          })) || undefined
        : undefined;

      try {
        await setStepCompletion({
          step: stepToComplete,
          isComplete: true,
          completedByType: stepAlreadyCompleted.completedByType,
          accountUser,
          user,
          isSyncAction: true,
        });
      } catch (e: any) {
        logger.warn(
          `[preCompleteSteps] Could not pre-complete a step: ${e.message}`,
          e
        );

        if (e instanceof InvalidPayloadError) return;
      }

      stepsChanged.push(stepToComplete);
    }
  });

  return stepsChanged;
};

const handler: JobHandler<PreCompleteStepsJob> = async (job, logger) => {
  const payload = job.data;
  const stepsChanged = await preCompleteSteps(payload);
  if (stepsChanged) {
    logger.debug(
      `[preCompleteStepsTask] Pre-completed ${stepsChanged.length} steps`
    );
  }
};

export default handler;
