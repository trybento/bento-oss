import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';

import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Module } from 'src/data/models/Module.model';

export default function dynamicModulesOfTemplateLoader(loaders: Loaders) {
  return new Dataloader<number, Module[]>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
					DISTINCT ON (m.id)
					m.id as "moduleId"
					, t.id as "templateId"
				FROM core.modules m
				JOIN core.module_auto_launch_rules malr ON malr.module_id = m.id
				JOIN core.templates t ON t.id = malr.target_template_id
				WHERE t.id IN (:templateIds);
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
  });
}
