import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { QueryDatabase, queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { AccountUser } from 'src/data/models/AccountUser.model';

/**
 * Example use case: Step.usersViewed
 */
export default function usersViewedStepLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (stepIds) => {
    const rows = (await queryRunner({
      sql: `
      SELECT
        DISTINCT ON (steps.id, au.entity_id)
        au.entity_id AS account_user_entity_id,
        steps.id as step_id
      FROM core.steps
      JOIN core.organizations
      ON steps.organization_id = organizations.id
      JOIN analytics.step_daily_rollup sdr
      	ON steps.id = sdr.step_id AND organizations.id = sdr.organization_id
      JOIN core.account_users au
      	ON au.id = sdr.account_user_id
      WHERE steps.id IN (:stepIds)
      GROUP BY steps.id, au.entity_id`,
      replacements: {
        stepIds: stepIds as number[],
      },
      queryDatabase: QueryDatabase.primary,
    })) as { account_user_entity_id: string; step_id: number }[];

    const rowsByStepId = groupBy(rows, 'step_id');
    return promises.map(stepIds, (stepId) => {
      const rows = rowsByStepId[stepId] || [];
      return promises.map(rows, (row) =>
        loaders.accountUserEntityLoader.load(row.account_user_entity_id)
      );
    });
  });
}
