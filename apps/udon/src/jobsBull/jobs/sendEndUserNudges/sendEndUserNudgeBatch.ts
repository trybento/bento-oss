// triggered by cron to find all the users who should be nudged today.

import { JobPro } from '@taskforcesh/bullmq-pro';
import { groupBy } from 'lodash';
import { queryRunner } from 'src/data';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, SendEndUserNudgeBatchJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import { EndUserNudgePayload } from './helpers';

/** Use old Courier templates */
const USE_COURIER = !!process.env.USE_COURIER_NUDGE;
/** How many weeks back should we nudge */
const WEEK_CUTOFF = 3;

/** Choose non-contextual guides that have been viewed and not completed (7 * n) days ago */
export const NUDGE_QUERY = `--sql
  SELECT
    o.id AS "organizationId",
    au.email, g.id AS "guideId"
  FROM
    core.organizations o
    JOIN core.organization_settings os ON (os.organization_id = o.id)
    JOIN core.account_users au on (o.id = au.organization_id)
    JOIN core.accounts a on (a.id = au.account_id)
    JOIN core.guide_participants p on (au.id = p.account_user_id)
    JOIN core.guides g on (p.guide_id = g.id)
    JOIN core.templates t on t.id = g.created_from_template_id
  WHERE
      os.send_account_user_nudges
      AND a.deleted_at IS NULL
      AND au.email IS NOT NULL
      AND g.completed_at IS NULL
      AND au.internal = FALSE
      AND t.is_side_quest = FALSE
      AND g.deleted_at IS NULL
      AND to_char(p.first_viewed_at, 'day') = to_char(CURRENT_TIMESTAMP, 'day') --same weekday
      AND p.first_viewed_at < NOW() - INTERVAL '2 days' --and not today
      AND p.first_viewed_at > NOW() - INTERVAL '${WEEK_CUTOFF * 7 + 1} days'
  ORDER BY
    o.id,
    email,
    p.created_at desc;
`;

const handler: JobHandler<SendEndUserNudgeBatchJob> = async (_, logger) => {
  const orgEmailGuides = (await queryRunner({
    sql: NUDGE_QUERY,
  })) as EndUserNudgePayload[];
  // we now have potentially multiple nudges for a given organization/email pair,
  // based on two factors. One is multiple account users in the same org, the other is
  // users backtracking and uncompleting a guide so they have two active. Either way,
  // we only want to send one email per address per day (and hopefully per week).
  const pickOne = groupBy(
    orgEmailGuides,
    (e) => e.organizationId + '--' + e.email
  );
  const jobs: JobPro[] = [];
  for (const payloads of Object.values(pickOne)) {
    const job = await queueJob({
      jobType: USE_COURIER
        ? JobType.SendEndUserNudgeSingle
        : JobType.SendEndUserNudgeWithTemplate,
      ...payloads[0],
    });

    jobs.push(job);
  }
  logger.info(
    `End user nudges: ${jobs.length} messages enqueued. UseCourier? ${USE_COURIER}`
  );
};

export default handler;
