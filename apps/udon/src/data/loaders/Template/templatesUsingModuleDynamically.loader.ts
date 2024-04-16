import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Template } from 'src/data/models/Template.model';

export default function templatesUsingModuleDynamicallyLoader(
  loaders: Loaders
) {
  return new Dataloader<number, Template[]>(async (moduleIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
					DISTINCT ON (t.id)
					t.id as "templateId"
					, m.id as "moduleId"
				FROM core.modules m
				JOIN core.module_auto_launch_rules malr ON malr.module_id = m.id
				JOIN core.templates t ON t.id = malr.target_template_id
				WHERE m.id IN (:moduleIds);
      `,
      replacements: {
        moduleIds: moduleIds as number[],
      },
    })) as { moduleId: number; templateId: number }[];

    return loadBulk(
      moduleIds,
      rows,
      'moduleId',
      'templateId',
      loaders.templateLoader
    );
  });
}
