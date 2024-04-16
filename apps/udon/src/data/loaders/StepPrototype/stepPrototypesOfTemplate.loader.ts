import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

export default function stepPrototypesOfTemplateLoader(loaders: Loaders) {
  return new Dataloader<number, StepPrototype[]>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
	        sp.id as "stepPrototypeId" ,
        	templates.id as "templateId"
        FROM
        	core.step_prototypes sp
        JOIN core.modules_step_prototypes msp on
        	sp.id = msp.step_prototype_id
        JOIN core.templates_modules tm on
        	tm.module_id = msp.module_id
        JOIN core.templates on
        	templates.id = tm.template_id
        WHERE
          templates.id IN (:templateIds)
        ORDER BY
        	templates.id asc,
        	tm.order_index asc,
          msp.order_index asc
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as { stepPrototypeId: number; templateId: number }[];

    return loadBulk(
      templateIds,
      rows,
      'templateId',
      'stepPrototypeId',
      loaders.stepPrototypeLoader
    );
  });
}
