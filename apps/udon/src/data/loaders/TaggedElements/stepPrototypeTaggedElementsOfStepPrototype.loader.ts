import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';

export default function stepPrototypeTaggedElementsOfStepPrototypeLoader(
  loaders: Loaders
) {
  return new Dataloader<number, StepPrototypeTaggedElement[]>(
    async (stepPrototypeIds) => {
      const rows = (await queryRunner({
        sql: `--sql
          SELECT
            sp.id as id,
            spte.id as tag_prototype_id
          FROM
            core.step_prototypes sp
            JOIN core.step_prototype_tagged_elements spte ON spte.step_prototype_id = sp.id
          WHERE sp.id IN (:stepPrototypeIds);
      `,
        replacements: {
          stepPrototypeIds,
        },
      })) as { id: number; tag_prototype_id: number }[];

      return loadBulk(
        stepPrototypeIds,
        rows,
        'id',
        'tag_prototype_id',
        loaders.stepPrototypeTaggedElementLoader
      );
    }
  );
}
