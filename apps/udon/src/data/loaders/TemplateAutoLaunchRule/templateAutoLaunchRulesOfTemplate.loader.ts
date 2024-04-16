import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { loadBulk } from '../helpers';

export default function templateAutoLaunchRulesOfTemplateLoader(
  loaders: Loaders
) {
  return new Dataloader<number, TemplateAutoLaunchRule[]>(
    //
    async (templateIds) => {
      const rows = (await queryRunner({
        sql: `--sql
        SELECT
          template_auto_launch_rules.id as template_auto_launch_rule_id
          , templates.id as template_id
        FROM core.template_auto_launch_rules
        JOIN core.templates
        ON template_auto_launch_rules.template_id = templates.id
        WHERE templates.id IN (:templateIds)
					AND templates.deleted_at IS NULL
        ORDER BY templates.id ASC, template_auto_launch_rules.id ASC
      `,
        replacements: {
          templateIds: templateIds as number[],
        },
      })) as { template_auto_launch_rule_id: number; template_id: number }[];

      return loadBulk(
        templateIds,
        rows,
        'template_id',
        'template_auto_launch_rule_id',
        loaders.templateAutoLaunchRuleLoader
      );
    }
  );
}
