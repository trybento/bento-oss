import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepPrototypeAutoCompleteInteraction } from 'src/data/models/StepPrototypeAutoCompleteInteraction.model';

export default function organizationStepPrototypeAutoCompleteInteractionsLoader(
  loaders: Loaders
) {
  return new Dataloader<number, StepPrototypeAutoCompleteInteraction[]>(
    async (organizationId) => {
      const rows = (await queryRunner({
        sql: `
        SELECT
          id as "id",
          organization_id as "organizationId"
        FROM core.step_prototype_auto_complete_interactions
        WHERE organization_id IN (:organizationId);
      `,
        replacements: {
          organizationId,
        },
      })) as { id: number; organizationId: number }[];

      return loadBulk(
        organizationId,
        rows,
        'organizationId',
        'id',
        loaders.stepPrototypeAutoCompleteInteractionLoader
      );
    }
  );
}
