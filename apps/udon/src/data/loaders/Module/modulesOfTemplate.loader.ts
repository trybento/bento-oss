import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Module } from 'src/data/models/Module.model';

export default function modulesOfTemplateLoader(loaders: Loaders) {
  return new Dataloader<number, Module[]>(
    //
    async (templateIds) => {
      const rows = (await queryRunner({
        sql: `
        SELECT
          modules.id as "moduleId"
          , templates.id as "templateId"
        FROM core.modules
        JOIN core.templates_modules
        ON modules.id = templates_modules.module_id
        JOIN core.templates
        ON templates.id = templates_modules.template_id
        WHERE templates.id IN (:templateIds)
        ORDER BY templates.id ASC, templates_modules.order_index ASC
      `,
        replacements: {
          templateIds: templateIds as number[],
        },
      })) as { moduleId: number; templateId: number }[];

      return loadBulk(
        templateIds,
        rows,
        'templateId',
        'moduleId',
        loaders.moduleLoader
      );
    }
  );
}
