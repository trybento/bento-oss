import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { Module } from 'src/data/models/Module.model';

export default function moduleOfStepPrototypeLoader(loaders: Loaders) {
  return new Dataloader<number, Module | null>(async (stepPrototypeIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          modules.id as "moduleId",
          step_prototypes.id as "stepPrototypeId"
        FROM core.modules
        JOIN core.modules_step_prototypes
        ON modules.id = modules_step_prototypes.module_id
        JOIN core.step_prototypes
        ON step_prototypes.id = modules_step_prototypes.step_prototype_id
        WHERE step_prototypes.id IN (:stepPrototypeIds)
        ORDER BY step_prototypes.id ASC
      `,
      replacements: {
        stepPrototypeIds: stepPrototypeIds as number[],
      },
    })) as { moduleId: number; stepPrototypeId: number }[];

    const rowsByStepPrototypeId = keyBy(rows, 'stepPrototypeId');
    return promises.map(stepPrototypeIds, (stepPrototypeId) => {
      const row = rowsByStepPrototypeId[stepPrototypeId];
      return row
        ? loaders.moduleLoader.load(
            rowsByStepPrototypeId[stepPrototypeId].moduleId
          )
        : null;
    });
  });
}
