import Dataloader from 'dataloader';
import { keyBy } from 'lodash';
import { queryRunner } from 'src/data';

/** Loads whether or not a template has any guide bases in any state that were auto-launched. */
export default function hasAutoLaunchedGuideBasesLoader() {
  return new Dataloader<number, boolean>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          gb.created_from_template_id AS template_id
        FROM core.guide_bases gb
        WHERE gb.created_from_template_id IN (:templateIds)
          AND gb.was_autolaunched = TRUE
        GROUP BY gb.created_from_template_id
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as { template_id: number }[];

    const rowsByTemplateId = keyBy(rows, 'template_id');

    return templateIds.map((templateId) => !!rowsByTemplateId[templateId]);
  });
}
