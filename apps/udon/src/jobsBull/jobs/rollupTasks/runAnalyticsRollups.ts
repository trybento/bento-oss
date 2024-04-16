import { QueryDatabase, queryRunner } from 'src/data';
import { enableUpdateAccountUserData } from 'src/utils/internalFeatures/internalFeatures';
import { runFollowerQueryPair } from 'src/jobsBull/workerBull.helpers';
import {
  parsePayloadDate,
  RollupQueryPayload,
  RollupTypeEnum,
  setLastRunTime,
} from './rollup.helpers';
import { logger } from 'src/utils/logger';
import { queueAccountUserDataRollup } from 'src/jobsBull/jobs/analytics/analytics.helpers';
import { USE_AU_EVENTS_TABLE } from 'src/interactions/analytics/trackAccountUserAppActivity';
import { JobHandler } from 'src/jobsBull/handler';
import { RunAnalyticsRollupsJob } from 'src/jobsBull/job';

const getAppActivityQuery = (payload: RollupQueryPayload) => `
WITH latest_activity AS (
	SELECT DISTINCT ON (aue.account_user_entity_id) aue.account_user_entity_id, aue.created_at
	FROM analytics.account_user_events aue
	WHERE aue.event_name = 'account_user_app_activity'
		AND aue.created_at ${
      payload.lookback
        ? '>= NOW() - INTERVAL :lookback'
        : 'between :date ::date and :date ::date + 1'
    }
	ORDER BY aue.account_user_entity_id, aue.created_at DESC
)
SELECT au.id AS "accountUserId", la.created_at AS "lastActiveInApp", au.organization_id AS "organizationId"
FROM latest_activity la
JOIN core.account_users au ON au.entity_id = la.account_user_entity_id;
`;

/**
 * Run rollup task for analytics
 */
const handler: JobHandler<RunAnalyticsRollupsJob> = async (job, logger) => {
  const payload = job.data;

  await parsePayloadDate(payload, RollupTypeEnum.AnalyticRollups);

  logger.debug(
    `Running backfill for ${payload.date}${
      payload.lookback ? `w/ lookback of ${payload.lookback}` : ''
    }`
  );

  if (USE_AU_EVENTS_TABLE) await runAccountUserActivityRollup(payload);

  const audEnabled = await enableUpdateAccountUserData.enabled();

  if (audEnabled) await runAccountUserDataRollup(payload);

  await setLastRunTime(RollupTypeEnum.AnalyticRollups);
};

/** Update account user "last active" based on login event rows */
const runAccountUserActivityRollup = async (payload: RollupQueryPayload) => {
  const sql = `
			INSERT INTO analytics.account_user_data(account_user_id, last_active_in_app, organization_id)
				VALUES (:accountUserId, :lastActiveInApp, :organizationId)
			ON CONFLICT (account_user_id, organization_id) DO UPDATE
				SET last_active_in_app = EXCLUDED.last_active_in_app;
		`;

  await runFollowerQueryPair({
    readSql: getAppActivityQuery(payload),
    writeSql: sql,
    payload,
  });
};

/** Update account user data rows for everyone with activity in selected period */
const runAccountUserDataRollup = async (payload: RollupQueryPayload) => {
  const sql = `
		SELECT DISTINCT
			se.account_user_entity_id AS "accountUserEntityId",
			se.organization_entity_id AS "organizationEntityId"
		FROM analytics.step_events se
		WHERE se.created_at ${
      payload.lookback
        ? '>= NOW() - INTERVAL :lookback'
        : 'between :date ::date and :date ::date + 1'
    };
	`;

  /**
   * Strategy
   * Every (n) minutes that the analytics rollup occurs, look for all
   *   the users with step events in that last period (+some additional spillover)
   * Then queue the list to be processed
   */

  const rows = (await queryRunner({
    sql,
    replacements: { ...payload },
    queryDatabase: QueryDatabase.follower,
  })) as { accountUserEntityId: string; organizationEntityId: string }[];

  if (rows.length === 0) return;

  logger.debug(
    `[audRollup] Starting job with ${rows.length} matching event users`
  );

  await queueAccountUserDataRollup(rows.map((r) => r.accountUserEntityId));

  logger.debug('[audRollup] Complete');
};

export default handler;
