import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';

export default function stepPrototypeCtasOfStepPrototypeLoader(
  loaders: Loaders
) {
  return new Dataloader<number, StepPrototypeCta[]>(async (stepPrototypeId) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          id as "id",
          step_prototype_id as "stepPrototypeId"
        FROM core.step_prototype_ctas
        WHERE step_prototype_id IN (:stepPrototypeId)
        ORDER BY step_prototype_ctas.order_index ASC;
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
      loaders.stepPrototypeCtaLoader
    );
  });
}
