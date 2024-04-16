import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { QueryDatabase, queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { AccountUser } from 'src/data/models/AccountUser.model';

const sql = `SELECT account_user_id AS account_user_id, step_id AS step_id
	FROM step_participant
	WHERE step_id IN (:stepIds)`;

export default function usersSkippedStepLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (stepIds) => {
    const rows = (await queryRunner({
      sql,
      replacements: {
        stepIds: stepIds as number[],
      },
      queryDatabase: QueryDatabase.primary,
    })) as { account_user_id: number; step_id: number }[];

    const rowsByStepId = groupBy(rows, 'step_id');
    return promises.map(stepIds, (stepId) => {
      const rows = rowsByStepId[stepId] || [];
      return promises.map(rows, (row) =>
        loaders.accountUserLoader.load(row.account_user_id)
      );
    });
  });
}
