import { Op } from 'sequelize';
import promises from 'src/utils/promises';
import { NpsSurveyInstanceState } from 'bento-common/types/netPromoterScore';
import { SelectedModelAttrsPick } from 'bento-common/types';

import { Logger } from 'src/jobsBull/logger';
import { JobHandler } from 'src/jobsBull/handler';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';
import createSurveyInstance from 'src/interactions/netPromoterScore/createSurveyInstances';

/**
 * Considers all date-based NPS Surveys and launches/ends them accordingly.
 *
 * NOTE: If any of the sub-tasks fails, this will throw an error to trigger the retry
 * stategy built-in BullMQ.
 */
const manageNpsSurveys = async (_payload: unknown, logger: Logger) => {
  // Whether any of the sub-tasks failed
  let failures = false;

  try {
    const [succeeded, failed] = await handleScheduledNpsLaunch(logger);
    logger.info(
      `[manageNpsSurveys] Launched ${succeeded} scheduled NPS surveys`
    );

    if (failed > 0) {
      failures = true;
      logger?.warn(
        `[manageNpsSurveys] Failed to launch ${failed} scheduled NPS surveys`
      );
    }
  } catch (e: any) {
    failures = true;
    logger.error(`[manageNpsSurveys] Error launching nps: ${e.message}`, e);
  }

  try {
    const [endedCount] = await handleScheduledNpsEnd();
    logger.info(`[manageNpsSurveys] Ended ${endedCount} scheduled NPS surveys`);
  } catch (e: any) {
    failures = true;
    logger.error(`[manageNpsSurveys] Error ending nps: ${e.message}`, e);
  }

  if (failures) {
    throw new Error(
      'Failed to launch or end NPS Surveys, throwing error to retry'
    );
  }
};

/**
 * Effectively launch all scheduled NPS surveys.
 *
 * @returns Promise number of surveys launched and errors
 */
export const handleScheduledNpsLaunch = async (
  logger?: Logger
): Promise<
  [
    /** Number of surveys successfully launched */
    succeededCount: number,
    /** Number of surveys that failed to launch */
    failedCount: number
  ]
> => {
  /* Looks for NpsSurvey that's ready to launch */
  const targets = (await NpsSurvey.scope(['launchable']).findAll({
    attributes: ['organizationId', 'entityId', 'id', 'startingType'],
    where: {
      // @ts-ignore,
      '$instances.id$': {
        [Op.eq]: null,
      },
    },
    include: [
      {
        model: NpsSurveyInstance.scope('active'),
        attributes: ['id'],
        required: false,
      },
    ],
  })) as Array<
    SelectedModelAttrsPick<
      NpsSurvey,
      'instances' | 'organizationId' | 'entityId' | 'id' | 'startingType'
    >
  >;

  const results = await promises.map(
    targets,
    async (survey) => {
      return createSurveyInstance({ survey: survey as any }).catch(
        (innerError) => {
          logger?.error(
            `[handleScheduledNpsLaunch] Error launching survey #${survey.id}: ${
              (innerError as Error).message
            }`,
            innerError
          );
          return undefined;
        }
      );
    },
    { concurrency: 3 }
  );

  const succeeded = results.filter(Boolean).length;
  const failed = targets.length - succeeded;

  return [succeeded, failed];
};

/**
 * Effectively end all scheduled NPS surveys.
 *
 * @returns Promise the number of affected counts and NpsSurveyInstance rows
 */
export const handleScheduledNpsEnd = async (): Promise<
  [affectedCount: number, affectedRows: NpsSurveyInstance[]]
> => {
  const targets = await NpsSurveyInstance.scope('expirable').findAll({
    attributes: ['id', 'createdFromNpsSurveyId'],
  });

  if (!targets.length) return [0, []];

  const now = new Date();

  return NpsSurveyInstance.update(
    {
      state: NpsSurveyInstanceState.finished,
      endedAt: now,
    },
    {
      where: {
        id: targets.map((i) => i.id),
      },
      returning: true,
    }
  );
};

const handler: JobHandler<unknown> = (job, logger) => {
  return manageNpsSurveys(job, logger);
};

export default handler;
