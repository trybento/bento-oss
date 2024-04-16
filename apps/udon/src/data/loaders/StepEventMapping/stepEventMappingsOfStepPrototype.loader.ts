import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepEventMapping } from 'src/data/models/StepEventMapping.model';
import { Loaders } from '..';

export default function stepEventMappingsOfStepPrototypeLoader(
  loaders: Loaders
) {
  return new Dataloader<number, StepEventMapping[]>(
    async (stepPrototypeIds) => {
      const rows = (await queryRunner({
        sql: `
        SELECT
          step_event_mappings.id as "stepEventMappingId"
          , step_prototypes.id as "stepPrototypeId"
        FROM core.step_prototypes
        JOIN core.step_event_mappings
        ON step_event_mappings.step_prototype_id = step_prototypes.id
        WHERE step_prototypes.id IN (:stepPrototypeIds)
        ORDER BY step_prototypes.id ASC, step_event_mappings.id ASC
      `,
        replacements: {
          stepPrototypeIds: stepPrototypeIds as number[],
        },
      })) as { stepEventMappingId: number; stepPrototypeId: number }[];

      return loadBulk(
        stepPrototypeIds,
        rows,
        'stepPrototypeId',
        'stepEventMappingId',
        loaders.stepEventMappingLoader
      );
    }
  );
}
