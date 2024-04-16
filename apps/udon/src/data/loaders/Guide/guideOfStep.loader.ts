import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Guide } from 'src/data/models/Guide.model';

export default function guideOfStep(loaders: Loaders) {
  return new Dataloader<number, Guide[]>(async (stepIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          g.id as "id",
          s.id as "stepId"
        FROM core.guides g
          JOIN core.steps s
            ON s.guide_id = g.id
						AND g.deleted_at IS NULL
        WHERE
          s.id IN (:stepIds);
        `,
      replacements: {
        stepIds,
      },
    })) as { id: number; stepId: number }[];

    return loadBulk(stepIds, rows, 'stepId', 'id', loaders.guideLoader);
  });
}
