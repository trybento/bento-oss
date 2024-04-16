import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';

export default async function templateHasGuideParticipants(
  templateIds: number[]
) {
  if (templateIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
        SELECT
					bool_or(g.id IS NOT NULL) AS "hasGuideParticipants",
					g.created_from_template_id template_id
				FROM core.guide_participants gp
				JOIN core.guides g ON gp.guide_id = g.id
				JOIN core.guide_bases gb ON g.created_from_guide_base_id = gb.id
				JOIN core.accounts a ON gb.account_id = a.id AND a.deleted_at IS NULL
				WHERE g.created_from_template_id IN (:templateIds)
				GROUP BY g.created_from_template_id;
      `,
    replacements: {
      templateIds,
    },
  })) as { hasGuideParticipants: boolean; template_id: number }[];

  const rowsByTemplateId = keyBy(rows, 'template_id');
  return templateIds.map(
    (templateId) => rowsByTemplateId[templateId]?.hasGuideParticipants || false
  );
}
