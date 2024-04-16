import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Template } from 'src/data/models/Template.model';

export default function templatesUsingModuleLoader(loaders: Loaders) {
  return new Dataloader<number, Template[]>(async (moduleIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          t.id as "templateId"
          , m.id as "moduleId"
        FROM core.modules m
        JOIN core.templates_modules tm
        	ON m.id = tm.module_id
        JOIN core.templates t
        	ON t.id = tm.template_id
          AND t.archived_at IS NULL
          AND t.deleted_at IS NULL
        WHERE m.id IN (:moduleIds)
        ORDER BY m.id ASC, t.id ASC
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
