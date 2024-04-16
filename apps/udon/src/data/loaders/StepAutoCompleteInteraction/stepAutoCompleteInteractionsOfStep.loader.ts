import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';

export default function stepAutoCompleteInteractionsOfStepLoader(
  loaders: Loaders
) {
  return new Dataloader<number, StepAutoCompleteInteraction[]>(
    async (stepIds) => {
      const rows = await queryRunner<{ id: number; step_id: number }[]>({
        sql: `--sql
          SELECT
            saci.id as "id",
            saci.step_id
          FROM
            core.step_auto_complete_interactions saci
            JOIN core.guide_base_step_auto_complete_interactions gbsaci
              ON gbsaci.id = saci.created_from_guide_base_step_auto_complete_interaction_id
          WHERE
            saci.step_id IN (:stepIds)
            AND saci.created_from_guide_base_step_auto_complete_interaction_id IS NOT NULL
            AND gbsaci.created_from_step_prototype_auto_complete_interaction_id IS NOT NULL;
        `,
        replacements: {
          stepIds,
        },
      });

      return loadBulk(
        stepIds,
        rows,
        'step_id',
        'id',
        loaders.stepAutoCompleteInteractionLoader
      );
    }
  );
}
