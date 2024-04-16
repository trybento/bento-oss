import Dataloader from 'dataloader';
import keyBy from 'lodash/keyBy';
import { QueryDatabase, queryRunner } from 'src/data';

export default function triggeredCountOfBranchingPathLoader() {
  return new Dataloader<number, number>(async (branchingPathIds) => {
    const rows = (await queryRunner({
      sql: `--sql
				SELECT
					tbp.branching_path_id AS "branchingPathId",
					COUNT(tbp.id)
				FROM core.triggered_branching_paths tbp
				WHERE tbp.branching_path_id IN (:branchingPathIds)
				GROUP BY tbp.branching_path_id
			`,
      replacements: {
        branchingPathIds,
      },
      queryDatabase: QueryDatabase.primary,
    })) as { branchingPathId: number; count: number }[];

    const rowsByPathId = keyBy(rows, 'branchingPathId');
    return branchingPathIds.map((bpId) => rowsByPathId[bpId]?.count ?? 0);
  });
}
