import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';
import { Loaders } from '..';
import promises from 'src/utils/promises';

export default function nameOfGuideStepBaseLoader(_loaders: Loaders) {
  return new Dataloader<number, string | null>(async (guideStepBaseIds) => {
    const rows = await queryRunner<
      {
        guideStepBaseId: number;
        name: string | null;
      }[]
    >({
      sql: `--sql
				SELECT
          gsb.id AS "guideStepBaseId",
					COALESCE(gsb.name, sp.name) AS "name"
				FROM
          core.guide_step_bases gsb
				  JOIN core.step_prototypes sp ON sp.id = gsb.created_from_step_prototype_id
				WHERE
          gsb.id IN (:guideStepBaseIds);
			`,
      replacements: {
        guideStepBaseIds,
      },
    });

    const rowsByGuideStepBaseId = keyBy(rows, 'guideStepBaseId');

    return promises.map(guideStepBaseIds, (guideStepBaseId) => {
      return rowsByGuideStepBaseId[guideStepBaseId]?.name || null;
    });
  });
}
