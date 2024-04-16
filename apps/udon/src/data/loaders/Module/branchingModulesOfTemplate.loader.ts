import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';

import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Module } from 'src/data/models/Module.model';

export default function branchingModulesOfTemplateLoader(loaders: Loaders) {
  return new Dataloader<number, Module[]>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
					tm.template_id AS "templateId",
					m.id AS "moduleId"
				FROM core.modules m
				JOIN core.branching_paths bp ON bp.module_id = m.id
				JOIN core.step_prototypes sp ON bp.branching_key = sp.entity_id
				JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = sp.id
				JOIN core.templates_modules tm ON tm.module_id = msp.module_id
				WHERE tm.template_id IN (:templateIds)
				ORDER BY tm.template_id;
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
