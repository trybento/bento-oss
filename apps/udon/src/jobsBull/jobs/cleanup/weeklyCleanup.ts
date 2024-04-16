import { Op } from 'sequelize';
import { EXT_TEST_ACCOUNTS } from 'bento-common/utils/constants';
import { cleanupLaunchReports } from '../analytics/analytics.helpers';
import { cleanupDetachedInputAnswers } from 'src/interactions/inputFields/helpers';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { logger } from 'src/utils/logger';
import { QueryDatabase, queryRunner } from 'src/data';
import cleanupDetachedGuideBaseStepCtas from 'src/interactions/ctas/cleanupDetachedGuideBaseStepCtas';
import cleanupDetachedTaggedElements from 'src/interactions/taggedElements/cleanupDetachedTaggedElements';
import cleanupDetachedStepGroups from 'src/interactions/cleanupDetachedStepGroups';
import { Guide } from 'src/data/models/Guide.model';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, WeeklyCleanupJob } from 'src/jobsBull/job';
import { CleanupTypes } from './helpers';
import { queueJob } from 'src/jobsBull/queues';
import cleanupDetachedGuideBaseAutoCompleteInteractions from 'src/interactions/autoComplete/cleanupDetachedGuideBaseAutoCompleteInteractions';
import cleanupDetachedStepAutoCompleteInteractions from 'src/interactions/autoComplete/cleanupDetachedStepAutoCompleteInteractions';

/**
 * Weekly cleanup task to remove all sorts of things that shouldn't be left in the database.
 */
const handler: JobHandler<WeeklyCleanupJob> = async (job) => {
  const { type } = job.data;

  switch (type) {
    case CleanupTypes.general:
      /* Clean detached guide bases */
      await queueJob({
        jobType: JobType.DetachedGuideBaseCleanup,
      });

      /** Clean detached step groups */
      await cleanupDetachedStepGroups();

      /** Clean detached guide base step CTA instances */
      await cleanupDetachedGuideBaseStepCtas();

      /** Clean detached tagged elements */
      await cleanupDetachedTaggedElements();

      /** Clean detached input answers */
      await cleanupDetachedInputAnswers();

      /** We only use 30 days worth of these logs, older ones are redundant */
      await cleanupOldAnnouncementDailyActivity();

      /** Clean detached guide base step auto complete interactions */
      await cleanupDetachedGuideBaseAutoCompleteInteractions();

      /** Clean detached step auto complete interactions */
      await cleanupDetachedStepAutoCompleteInteractions();

      break;
    case CleanupTypes.obsolete:
      /** Rollup rows belonging to deleted guides */
      await cleanupObsoleteRollupRows();

      /** Remove some events that belong to orgs that don't exist anymore */
      await trimObsoleteEvents();
      break;
    case CleanupTypes.internalData:
      await cleanupLaunchReports();

      /** Clean extension demo accounts off people's orgs */
      await cleanExtensionDemoAccounts();
      break;
    case CleanupTypes.fallbacks:
      /** Fallback in case we missed any */
      await cleanupSoftDeletedGuides();
      break;
    default:
      /* Default case: queue sub-tasks */
      for (const cleanupType of Object.values(CleanupTypes)) {
        await queueJob({
          jobType: JobType.WeeklyCleanup,
          type: cleanupType,
        });
      }
  }
};

export default handler;

const cleanupSoftDeletedGuides = async () => {
  await Guide.destroy({
    where: {
      deletedAt: { [Op.not]: null },
    },
    force: true,
  });
};

/**
 * Only a fallback now, extension accounts should be removed when we think a snippet is installed
 *   See `deleteExtensionData` job
 */
const cleanExtensionDemoAccounts = async () => {
  const accounts = await Account.findAll({
    where: {
      name: EXT_TEST_ACCOUNTS,
      deletedAt: { [Op.not]: null },
    } as any,
  });

  if (accounts.length === 0) return;

  logger.info(
    `[weeklyCleanup] cleaning up ${accounts.length} archived test accounts`
  );

  const accountIds = accounts.map((a) => a.id);
  await AccountUser.destroy({ where: { accountId: accountIds } });
  await GuideBase.destroy({ where: { accountId: accountIds }, force: true });
  await Account.destroy({ where: { id: accountIds } });
};

const cleanupOldAnnouncementDailyActivity = () =>
  queryRunner({
    sql: `DELETE FROM analytics.announcement_daily_activity ada WHERE ada.date < NOW() - INTERVAL '2 months';`,
    queryDatabase: QueryDatabase.primary,
  });

const cleanupObsoleteRollupRows = () =>
  queryRunner({
    sql: `--sql
		DELETE FROM analytics.guide_daily_rollup WHERE template_id IN (
			SELECT DISTINCT gdr.template_id FROM analytics.guide_daily_rollup gdr
			LEFT JOIN core.templates t ON gdr.template_id = t.id
			WHERE t.id IS NULL
		);
		`,
    queryDatabase: QueryDatabase.primary,
  });

const trimObsoleteEvents = () =>
  queryRunner({
    sql: `--sql
		DELETE FROM analytics.events WHERE id IN (
			SELECT e.id FROM analytics.events e
			LEFT JOIN core.organizations o ON e.organization_entity_id = o.entity_id
			WHERE o.entity_id IS NULL
			LIMIT 2500
		);
	`,
    queryDatabase: QueryDatabase.primary,
  });
