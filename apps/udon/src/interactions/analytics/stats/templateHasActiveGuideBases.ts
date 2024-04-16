import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';

export default async function templateHasActiveGuideBases(
  templateIds: number[]
) {
  if (templateIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
      SELECT 
        bool_or(gb.state = 'active') AS "hasActiveGuideBases",
        coalesce(bool_or(gb.id IS NOT NULL), false) AS "hasGuideBases",
        gb.created_from_template_id template_id
      FROM core.guide_bases gb 
      WHERE gb.created_from_template_id IN (:templateIds)
      GROUP BY gb.created_from_template_id;
    `,
    replacements: {
      templateIds: templateIds as number[],
    },
  })) as {
    hasActiveGuideBases: boolean;
    hasGuideBases: boolean;
    template_id: number;
  }[];

  const rowsByTemplateId = keyBy(rows, 'template_id');
  return templateIds.map((templateId) => ({
    hasActiveGuideBases:
      rowsByTemplateId[templateId]?.hasActiveGuideBases || false,
    hasGuideBases: rowsByTemplateId[templateId]?.hasGuideBases || false,
  }));
}
