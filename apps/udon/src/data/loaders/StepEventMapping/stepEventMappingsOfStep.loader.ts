import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepEventMapping } from 'src/data/models/StepEventMapping.model';

export default function stepEventMappingsOfStepLoader(loaders: Loaders) {
  return new Dataloader<number, StepEventMapping[]>(async (stepIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          step_event_mappings.id as "stepEventMappingId"
          , steps.id as "stepId"
        FROM core.steps
        JOIN core.guide_step_bases
        	ON guide_step_bases.id = steps.created_from_guide_step_base_id
					AND guide_step_bases.deleted_at IS NULL
        JOIN core.step_prototypes
        	ON guide_step_bases.created_from_step_prototype_id = step_prototypes.id
        JOIN core.step_event_mappings
        	ON step_event_mappings.step_prototype_id = step_prototypes.id
        WHERE steps.id IN (:stepIds)
        ORDER BY steps.id ASC, step_event_mappings.id ASC
      `,
      replacements: {
        stepIds: stepIds,
      },
    })) as { stepEventMappingId: number; stepId: number }[];

    return loadBulk(
      stepIds,
      rows,
      'stepId',
      'stepEventMappingId',
      loaders.stepEventMappingLoader
    );
  });
}
