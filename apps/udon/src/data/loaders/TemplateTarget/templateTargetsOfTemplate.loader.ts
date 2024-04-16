import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { Loaders } from '..';
import { loadBulk } from '../helpers';

export default function templateTargetsOfTemplateLoader(loaders: Loaders) {
  return new Dataloader<number, TemplateTarget[]>(
    //
    async (templateIds) => {
      const rows = (await queryRunner({
        sql: `--sql
        SELECT
          template_targets.id as template_target_id
          , templates.id as template_id
        FROM core.template_targets
        JOIN core.templates
        ON template_targets.template_id = templates.id
        WHERE templates.id IN (:templateIds)
					AND templates.deleted_at IS NULL
        ORDER BY templates.id ASC, template_targets.id ASC
      `,
        replacements: {
          templateIds: templateIds as number[],
        },
      })) as { template_target_id: number; template_id: number }[];

      return loadBulk(
        templateIds,
        rows,
        'template_id',
        'template_target_id',
        loaders.templateTargetLoader
      );
    }
  );
}
