import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';
import { Loaders } from '..';

/**
 * WARNING: Assumes `gatedGuideAndStepPropagation` feature is enabled for this Org.
 * You shouldn't be using this loader if that is not the case.
 */
export default function nameOfStepLoader(_loaders: Loaders) {
  return new Dataloader<number, string>(async (stepIds) => {
    const rows = (await queryRunner({
      sql: `--sql
				SELECT
					s.id AS "stepId",
					COALESCE(gsb.name, sp.name) AS "name"
				FROM core.steps s
				JOIN core.guide_step_bases gsb
					ON gsb.id = s.created_from_guide_step_base_id
					AND gsb.deleted_at IS NULL
				JOIN core.step_prototypes sp
					ON sp.id = s.created_from_step_prototype_id
				WHERE s.id IN (:stepIds);
			`,
      replacements: {
        stepIds,
      },
    })) as {
      stepId: number;
      name: string;
    }[];

    const rowsByStepId = keyBy(rows, 'stepId');

    return stepIds.map((stepId) => {
      const row = rowsByStepId[stepId];
      return row.name;
    });
  });
}
