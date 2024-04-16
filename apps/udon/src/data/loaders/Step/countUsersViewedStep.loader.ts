import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { QueryDatabase, queryRunner } from 'src/data';

/**
 * Example use case: Steps.countUsersViewed
 */
export default function countUsersViewedStepLoader() {
  return new Dataloader<number, number>(async (stepIds) => {
    const rows = (await queryRunner({
      sql: `
      SELECT
        COUNT(DISTINCT sdr.account_user_id) AS count_users_viewed,
        steps.id AS step_id
      FROM core.steps
      JOIN core.organizations
      	ON steps.organization_id = organizations.id
      JOIN analytics.step_daily_rollup sdr
      	ON steps.id = sdr.step_id AND organizations.id = sdr.organization_id
			JOIN core.account_users au
				ON au.id = sdr.account_user_id
      WHERE steps.id IN (:stepIds)
      GROUP BY steps.id`,
      replacements: {
        stepIds: stepIds as number[],
      },
      queryDatabase: QueryDatabase.primary,
    })) as { count_users_viewed: number; step_id: number }[];

    const rowsByStepId = keyBy(rows, 'step_id');
    return stepIds.map(
      (stepId) => rowsByStepId[stepId]?.count_users_viewed || 0
    );
  });
}
