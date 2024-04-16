import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { Step } from 'src/data/models/Step.model';

export default function stepByWhichGuideModuleBaseDynamicallyAddedLoader(
  loaders: Loaders
) {
  return new Dataloader<number, Step | null>(async (guideModuleBaseIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          steps.id as step_id
          , triggered_branching_actions.created_guide_module_base_id as guide_module_base_id
        FROM core.triggered_branching_actions
        JOIN core.steps
        ON steps.id = triggered_branching_actions.triggered_from_step_id
        WHERE triggered_branching_actions.created_guide_module_base_id IN (:guideModuleBaseIds)
        ORDER BY triggered_branching_actions.created_guide_module_base_id ASC, steps.id ASC
      `,
      replacements: {
        guideModuleBaseIds: guideModuleBaseIds as number[],
      },
    })) as { step_id: number; guide_module_base_id: number }[];

    const rowsByGuideModuleBaseId = keyBy(rows, 'guide_module_base_id');
    return promises.map(guideModuleBaseIds, (guideModuleBaseId) => {
      const row = rowsByGuideModuleBaseId[guideModuleBaseId];
      return row ? loaders.stepLoader.load(row.step_id) : null;
    });
  });
}
