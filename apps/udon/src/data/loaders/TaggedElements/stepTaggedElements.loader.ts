import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { Loaders } from '..';

export default function stepTaggedElementsLoader(loaders: Loaders) {
  return new Dataloader<number, StepTaggedElement[]>(
    //
    async (stepId) => {
      const rows = (await queryRunner({
        sql: `--sql
          SELECT
            id as "id",
            step_id as "stepId"
          FROM
            core.step_tagged_elements
          WHERE
            step_id IN (:stepId);
        `,
        replacements: {
          stepId,
        },
      })) as { id: number; stepId: number }[];

      return loadBulk(
        stepId,
        rows,
        'stepId',
        'id',
        loaders.stepTaggedElementLoader
      );
    }
  );
}
