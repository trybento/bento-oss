import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';

type TemplateUsageData = {
  autoLaunchedAccounts: number;
  autoLaunchedUsers: number;
  manualLaunchedAccounts: number;
  manualLaunchedUsers: number;
};

export default function templateUsageLoader() {
  return new Dataloader<number, TemplateUsageData>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
					gb.created_from_template_id AS template_id,
					COUNT (g.id) FILTER (WHERE gb.was_autolaunched = FALSE) AS manual_guides,
					COUNT (g.id) FILTER (WHERE gb.was_autolaunched = TRUE) AS auto_guides,
					COUNT (DISTINCT gb.id) FILTER (WHERE gb.was_autolaunched = FALSE) AS manual_guide_bases,
					COUNT (DISTINCT gb.id) FILTER (WHERE gb.was_autolaunched = TRUE) AS auto_guide_bases
				FROM
          core.guide_bases gb
          LEFT JOIN core.guides g ON g.created_from_guide_base_id = gb.id
				WHERE
          gb.created_from_template_id IN (:templateIds)
          AND gb.state = 'active'
				GROUP BY
          gb.created_from_template_id
				ORDER BY
          gb.created_from_template_id;
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as {
      template_id: number;
      auto_guides: number;
      auto_guide_bases: number;
      manual_guides: number;
      manual_guide_bases: number;
    }[];

    const rowsByTemplateId = keyBy(rows, 'template_id');

    return templateIds.map((templateId) => {
      const data = rowsByTemplateId[templateId];
      return {
        autoLaunchedAccounts: data?.auto_guide_bases || 0,
        autoLaunchedUsers: data?.auto_guides || 0,
        manualLaunchedAccounts: data?.manual_guide_bases || 0,
        manualLaunchedUsers: data?.manual_guides || 0,
      };
    });
  });
}
