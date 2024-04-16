import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';

export default function inputStepPrototypesOfTemplateCountLoader() {
  return new Dataloader<number, number>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `
       	SELECT
					COUNT(DISTINCT isp.id) as "numInputStepPrototypes",
					tm.template_id as "templateId"
				FROM
					core.input_step_prototypes isp
				JOIN core.step_prototypes sp ON
					isp.step_prototype_id = sp.id
				JOIN core.modules_step_prototypes msp on
					sp.id = msp.step_prototype_id
				JOIN core.templates_modules tm on
					tm.module_id = msp.module_id
				WHERE
					tm.template_id IN (:templateIds) AND sp.step_type = 'input'
				GROUP BY tm.template_id;
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as { numInputStepPrototypes: number; templateId: number }[];

    const countByTemplateId = keyBy(rows, 'templateId');
    return templateIds.map(
      (tId) => countByTemplateId[tId]?.numInputStepPrototypes ?? 0
    );
  });
}
