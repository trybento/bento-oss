import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { queryRunner } from 'src/data';

type LaunchingType = 'branching' | 'launch_cta';

/** Loads whether or not a split test spawned any guide bases in any state. */
export default function templatesLaunchingTemplateLoader() {
  return new Dataloader<
    number,
    Array<{ sourceTemplate: number; type: LaunchingType }>
  >(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
					bp.template_id AS "destinationTemplate",
					tm.template_id AS "sourceTemplate",
					'branching' AS type
				FROM core.branching_paths bp
				JOIN core.step_prototypes sp ON sp.entity_id = bp.branching_key
				JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = sp.id
				JOIN core.templates_modules tm ON tm.module_id = msp.module_id
				JOIN core.templates t ON tm.template_id = t.id
				WHERE
					bp.template_id IN (:templateIds)
					AND t.deleted_at IS NULL
					AND t.archived_at IS NULL

				UNION

				SELECT
					spc.launchable_template_id AS "destinationTemplate",
					tm.template_id AS "sourceTemplate",
					'launch_cta' AS type
				FROM core.step_prototype_ctas spc
				JOIN core.step_prototypes sp ON sp.id = spc.step_prototype_id
				JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = sp.id
				JOIN core.templates_modules tm ON tm.module_id = msp.module_id
				JOIN core.templates t ON tm.template_id = t.id
				WHERE
					spc.launchable_template_id IN (:templateIds)
					AND t.deleted_at IS NULL
					AND t.archived_at IS NULL;
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as {
      destinationTemplate: number;
      sourceTemplate: number;
      type: LaunchingType;
    }[];

    const rowsByTemplateId = groupBy(rows, 'destinationTemplate');
    return templateIds.map((templateId) => rowsByTemplateId[templateId] ?? []);
  });
}
