import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';

export default function inputStepPrototypesOfTemplateLoader(loaders: Loaders) {
  return new Dataloader<number, InputStepPrototype[]>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
	        isp.id as "inputStepPrototypeId" ,
        	templates.id as "templateId"
        FROM
					core.input_step_prototypes isp
				JOIN core.step_prototypes sp ON
					isp.step_prototype_id = sp.id
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
        	tm.order_index asc
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as { inputStepPrototypeId: number; templateId: number }[];

    return loadBulk(
      templateIds,
      rows,
      'templateId',
      'inputStepPrototypeId',
      loaders.inputStepPrototypeLoader
    );
  });
}
