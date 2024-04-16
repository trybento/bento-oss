import { keyBy } from 'lodash';

import { QueryDatabase, queryRunner } from 'src/data';
import { AccountUserData } from 'src/data/models/Analytics/AccountUserData.model';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, UpdateAccountUserDataJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import promises from 'src/utils/promises';

const CHUNK_SIZE = process.env.UPDATE_ACCOUNT_USER_DATA_CHUNK_SIZE
  ? Number(process.env.UPDATE_ACCOUNT_USER_DATA_CHUNK_SIZE)
  : 250;

const readSql = `--sql
  WITH selected_users AS (
    select au.id as account_user_id
    , au.entity_id as account_user_entity_id
    , au.full_name
    , au.created_in_organization_at
    , au.organization_id
    from core.account_users au
    join core.accounts a on (a.id = au.account_id)
    WHERE au.entity_id IN (:accountUserEntityIds)
      AND a.deleted_at IS NULL
  ),
  last_viewed_step as (
    select distinct on (su.account_user_id) su.account_user_id
      , e.step_entity_id
      , e.last_viewed_at
      , s.id as step_id
      , COALESCE(gsb.name, sp.name, t.name) as step_name
    from selected_users su
    join (
      select account_user_entity_id, step_entity_id, max(e.created_at) as last_viewed_at
      from analytics.step_events e
      where e.event_name = 'step_viewing_started' AND account_user_entity_id IN (:accountUserEntityIds)
      group by account_user_entity_id, step_entity_id
    ) e using (account_user_entity_id)
    join core.guide_participants gp using (account_user_id)
    join core.steps s on (gp.guide_id = s.guide_id and s.entity_id = e.step_entity_id)
    join core.guide_step_bases gsb
			on gsb.id = s.created_from_guide_step_base_id
			AND gsb.deleted_at IS NULL
    join core.step_prototypes sp on sp.id = s.created_from_step_prototype_id
    join core.guides g ON s.guide_id = g.id
    join core.templates t ON t.id = g.created_from_template_id
    order by su.account_user_id, e.last_viewed_at desc
  ),
  stats as (
    SELECT su.account_user_id
    , count(distinct sc.id) as steps_viewed
    , count(distinct s.id) as steps_completed
    FROM
      selected_users su
    left join
      core.steps s on (s.completed_at is not null and s.completed_by_account_user_id = su.account_user_id)
    left join
      analytics.step_events se on (se.account_user_entity_id = su.account_user_entity_id AND se.event_name = 'step_viewing_started')
    left join core.steps sc ON se.step_entity_id = sc.entity_id
    group by su.account_user_id
  )
  SELECT account_user_id AS "accountUserId"
    , stats.steps_viewed AS "stepsViewed"
    , stats.steps_completed AS "stepsCompleted"
    , last_viewed_step.step_id AS "currentStepId"
    , last_viewed_step.last_viewed_at as "stepLastSeen"
    , su.organization_id as "organizationId"
  FROM
    selected_users su
  JOIN
    stats using (account_user_id)
  LEFT JOIN
    last_viewed_step using (account_user_id);
`;

const updateAccountUserData: JobHandler<UpdateAccountUserDataJob> = async (
  job,
  logger
) => {
  const { accountUserEntityIds } = job.data;

  if (!accountUserEntityIds?.length) return;

  const chunk = accountUserEntityIds.splice(0, CHUNK_SIZE);

  const rows = (await queryRunner({
    sql: readSql,
    replacements: { accountUserEntityIds: chunk },
    queryDatabase: QueryDatabase.follower,
  })) as {
    accountUserId: number;
    stepsViewed: number;
    stepsCompleted: number;
    currentStepId: number | null;
    stepLastSeen: string | null;
    organizationId: number;
  }[];

  const accountUsersData = await AccountUserData.findAll({
    where: { accountUserId: rows.map((r) => r.accountUserId) },
    attributes: ['entityId', 'accountUserId'],
  });

  const dataIdByAccountUserId = keyBy(accountUsersData, 'accountUserId');

  const updateData = rows.map((r) => ({
    ...r,
    ...(dataIdByAccountUserId[r.accountUserId]
      ? { entityId: dataIdByAccountUserId[r.accountUserId].entityId }
      : {}),
  }));

  await promises.each(updateData, (auData) =>
    AccountUserData.upsert(auData, {
      conflictFields: ['organization_id', 'account_user_id'],
    })
  );

  /* Re-queue if more to process in this batch */
  if (accountUserEntityIds.length > 0) {
    logger.debug(
      `[updateAccountUserData] Remaining ids: ${accountUserEntityIds.length}; re-queue`
    );

    await queueJob(
      {
        jobType: JobType.UpdateAccountUserData,
        accountUserEntityIds,
      },
      {
        delayInMs: 1000,
      }
    );
  } else {
    logger.debug(`[updateAccountUserData] Update complete, ending task`);
  }
};

export default updateAccountUserData;
