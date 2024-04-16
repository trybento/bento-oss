import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';

/**
 * Returns only tagged elements directly associated to a template
 * that are not associated to a step.
 */
export default function stepPrototypeTaggedElementsOfTemplateLoader(
  loaders: Loaders
) {
  return new Dataloader<number, StepPrototypeTaggedElement[]>(
    async (templateIds) => {
      const rows = (await queryRunner({
        sql: `--sql
          SELECT
            t.id as id,
            spte.id as tag_prototype_id
          FROM
            core.templates t
            JOIN core.step_prototype_tagged_elements spte ON spte.template_id = t.id
            AND spte.step_prototype_id IS NULL
          WHERE t.id IN (:templateIds);
      `,
        replacements: {
          templateIds,
        },
      })) as { id: number; tag_prototype_id: number }[];

      return loadBulk(
        templateIds,
        rows,
        'id',
        'tag_prototype_id',
        loaders.stepPrototypeTaggedElementLoader
      );
    }
  );
}
