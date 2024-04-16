import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';

import { loadBulk } from 'src/data/loaders/helpers';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import { Loaders } from '..';

const inputPrototypesOfStepPrototypeLoader = (loaders: Loaders) =>
  new Dataloader<number, InputStepPrototype[]>(async (stepPrototypeId) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          id as "id",
          step_prototype_id as "stepPrototypeId"
        FROM core.input_step_prototypes
        WHERE step_prototype_id IN (:stepPrototypeId)
        ORDER BY order_index ASC;
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
      loaders.inputStepPrototypeLoader
    );
  });

export default inputPrototypesOfStepPrototypeLoader;
