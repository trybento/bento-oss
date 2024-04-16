import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { Template } from 'src/data/models/Template.model';
import { Loaders } from '..';

export default function templatesUsingStepPrototypeLoader(loaders: Loaders) {
  return new Dataloader<number, Template[]>(async (stepPrototypeIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT tm.template_id AS "templateId", sp.id AS "stepPrototypeId"
				FROM core.step_prototypes sp
				JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = sp.id
				JOIN core.templates_modules tm ON tm.module_id = msp.module_id
				WHERE sp.id IN (:stepPrototypeIds)
				ORDER BY sp.id ASC, tm.template_id ASC
      `,
      replacements: {
        stepPrototypeIds: stepPrototypeIds as number[],
      },
    })) as { stepPrototypeId: number; templateId: number }[];

    return loadBulk(
      stepPrototypeIds,
      rows,
      'stepPrototypeId',
      'templateId',
      loaders.templateLoader
    );
  });
}
