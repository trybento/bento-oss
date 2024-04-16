import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Loaders } from '..';

export default function stepPrototypesOfModuleLoader(loaders: Loaders) {
  return new Dataloader<number, StepPrototype[]>(async (moduleIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          step_prototypes.id as "stepPrototypeId"
          , modules.id as "moduleId"
        FROM core.step_prototypes
        JOIN core.modules_step_prototypes
        ON step_prototypes.id = modules_step_prototypes.step_prototype_id
        JOIN core.modules
        ON modules.id = modules_step_prototypes.module_id
        WHERE modules.id IN (:moduleIds)
        ORDER BY modules.id ASC, modules_step_prototypes.order_index ASC
      `,
      replacements: {
        moduleIds: moduleIds as number[],
      },
    })) as { stepPrototypeId: number; moduleId: number }[];

    return loadBulk(
      moduleIds,
      rows,
      'moduleId',
      'stepPrototypeId',
      loaders.stepPrototypeLoader
    );
  });
}
