import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepPrototypeAutoCompleteInteraction } from 'src/data/models/StepPrototypeAutoCompleteInteraction.model';
import { Loaders } from '..';

export default function stepPrototypeAutoCompleteInteractionsOfStepPrototypeLoader(
  loaders: Loaders
) {
  return new Dataloader<number, StepPrototypeAutoCompleteInteraction[]>(
    async (stepPrototypeId) => {
      const rows = (await queryRunner({
        sql: `
        SELECT
          id as "id",
          step_prototype_id as "stepPrototypeId"
        FROM core.step_prototype_auto_complete_interactions
        WHERE step_prototype_id IN (:stepPrototypeId);
      `,
        replacements: {
          stepPrototypeId,
        },
      })) as { id: number; stepPrototypeId: number }[];

      return loadBulk(
        stepPrototypeId,
        rows,
        'stepPrototypeId',
        'id',
        loaders.stepPrototypeAutoCompleteInteractionLoader
      );
    }
  );
}
