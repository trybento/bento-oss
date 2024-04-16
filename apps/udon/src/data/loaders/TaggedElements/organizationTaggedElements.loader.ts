import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { Loaders } from '..';

export default function organizationTaggedElementsLoader(loaders: Loaders) {
  return new Dataloader<number, StepPrototypeTaggedElement[]>(
    //
    async (organizationId) => {
      const rows = (await queryRunner({
        sql: `
        SELECT
          id, organization_id
        FROM core.step_prototype_tagged_elements
        WHERE organization_id IN (:organizationId);
      `,
        replacements: {
          organizationId,
        },
      })) as { id: number; organization_id: number }[];

      return loadBulk(
        organizationId,
        rows,
        'organization_id',
        'id',
        loaders.stepPrototypeTaggedElementLoader
      );
    }
  );
}
