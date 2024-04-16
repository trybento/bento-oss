import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { Step } from 'src/data/models/Step.model';

/**
 * For user guide base only due to 1-1 guide<->user model
 *
 * @deprecated poor performance, we shouldn't ever return all steps of a GSB
 */
export default function stepsOfGuideStepBaseLoader(loaders: Loaders) {
  return new Dataloader<number, Step[]>(
    //
    async (guideStepBaseIds) => {
      const rows = (await queryRunner({
        sql: `--sql
        SELECT
          s.id as step_id
          , gsb.id as guide_step_base_id
        FROM
          core.steps s
          JOIN core.guide_step_bases gsb
            ON s.created_from_guide_step_base_id = gsb.id
						AND gsb.deleted_at IS NULL
        WHERE
          gsb.id IN (:guideStepBaseIds)
        ORDER BY
          gsb.id ASC
          , gsb.order_index ASC
          , s.id ASC
      `,
        replacements: {
          guideStepBaseIds: guideStepBaseIds as number[],
        },
      })) as { step_id: number; guide_step_base_id: number }[];

      const rowsByGuideId = groupBy(rows, 'guide_step_base_id');
      return promises.map(guideStepBaseIds, (guideStepBaseId) => {
        const rowsForGuideId = rowsByGuideId[guideStepBaseId] || [];
        return promises.map(rowsForGuideId, (row) =>
          loaders.stepLoader.load(row.step_id)
        );
      });
    }
  );
}
