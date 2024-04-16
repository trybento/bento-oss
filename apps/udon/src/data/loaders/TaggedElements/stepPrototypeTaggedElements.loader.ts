import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { Loaders } from '..';

export default function stepPrototypeTaggedElementsLoader(loaders: Loaders) {
  return new Dataloader<number, StepPrototypeTaggedElement[]>(
    //
    async (stepPrototypeId) => {
      const rows = (await queryRunner({
        sql: `
        SELECT
          id as "id",
          step_prototype_id as "stepPrototypeId"
        FROM core.step_prototype_tagged_elements
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
        loaders.stepPrototypeTaggedElementLoader
      );
    }
  );
}
