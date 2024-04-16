import { roundToPSTHour } from 'bento-common/utils/dates';
import { Op, Sequelize } from 'sequelize';
import { Account } from 'src/data/models/Account.model';
import { checkAndAutoLaunchGuideBaseFromTemplates } from 'src/interactions/targeting/checkAndAutoLaunchGuideBaseFromTemplates';
import { Template } from 'src/data/models/Template.model';
import { TemplateState } from 'src/../../common/types';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, PrelaunchScheduledGuideJob } from 'src/jobsBull/job';
import { Logger } from 'src/jobsBull/logger';
import { queueJob } from 'src/jobsBull/queues';

export const PRELAUNCH_BATCH_SIZE = Number(
  process.env.PRELAUNCHING_BATCH_SIZE || 100
);
export const PRELAUNCH_ACTIVATION_HOUR = Number(
  process.env.PRELAUNCH_ACTIVATION_HOUR || 3
);

/**
 * When the scheduled activation time for a template is met, spawn the necessary
 * guide bases.
 */
export async function prelaunchScheduledGuide(
  job: PrelaunchScheduledGuideJob,
  logger: Logger
) {
  const {
    templatesAndOrgs,
    batchSize = PRELAUNCH_BATCH_SIZE,
    lastAccountId = 0,
  } = job;
  const { templateId, organizationId } = templatesAndOrgs[0] || {};
  // there aren't anymore templates to prelaunch so we're done
  if (!templateId) return;

  const accounts = await Account.findAll({
    where: {
      organizationId,
      id: {
        [Op.gt]: lastAccountId,
        [Op.notIn]: Sequelize.literal(
          `(select gb.account_id from core.guide_bases gb where gb.created_from_template_id = ${templateId})`
        ),
      },
    },
    limit: batchSize,
    order: [['id', 'ASC']],
  });

  logger.debug(
    `[prelaunchScheduledGuide] template id: ${templateId}, eligible accounts: ${accounts.length}`
  );
  if (accounts.length > 0) {
    const launchedGuideBases = await checkAndAutoLaunchGuideBaseFromTemplates({
      templatesAndAccounts: accounts.map((account) => ({
        templateId,
        account,
      })),
      activateAt: roundToPSTHour(PRELAUNCH_ACTIVATION_HOUR),
      organizationId,
    });
    logger.debug(
      `[prelaunchScheduledGuide] template id: ${templateId}, launched guide bases: ${launchedGuideBases.length}`
    );

    /**
     * Fallback to adjust state.
     * Update scheduled should have adjusted already.
     */
    if (launchedGuideBases.length)
      await Template.update(
        {
          state: TemplateState.live,
        },
        {
          where: {
            id: templateId,
            state: { [Op.ne]: TemplateState.live },
          },
        }
      );
  }

  const fullBatch = accounts.length === batchSize;

  await queueJob({
    jobType: JobType.PrelaunchScheduledGuide,
    templatesAndOrgs: fullBatch ? templatesAndOrgs : templatesAndOrgs.slice(1),
    batchSize,
    lastAccountId:
      accounts.length > 0 && fullBatch
        ? accounts[accounts.length - 1].id
        : undefined,
  });
}

const handler: JobHandler<PrelaunchScheduledGuideJob> = async (job, logger) => {
  await prelaunchScheduledGuide(job.data, logger);
};

export default handler;
