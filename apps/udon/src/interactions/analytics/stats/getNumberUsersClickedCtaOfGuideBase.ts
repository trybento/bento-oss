import { keyBy } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';

export default async function getNumberUsersClickedCtaOfGuideBase(
  guideBaseIds: readonly number[]
) {
  if (guideBaseIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
			SELECT
				g.created_from_guide_base_id AS "guideBaseId",
				COUNT(DISTINCT se.account_user_entity_id) AS "ctasClicked"
			FROM analytics.step_events se
			JOIN core.organizations o ON se.organization_entity_id = o.entity_id
			JOIN core.steps s ON se.step_entity_id = s.entity_id
			JOIN core.guides g ON s.guide_id = g.id
			WHERE
				se.event_name LIKE 'cta_clicked' AND
				g.created_from_guide_base_id IN (:guideBaseIds)
			GROUP BY g.created_from_guide_base_id
			ORDER BY 1 ASC;
		`,
    replacements: { guideBaseIds },
    queryDatabase: QueryDatabase.follower,
  })) as { guideBaseId: number; ctasClicked: number }[];

  const countByGuideBaseId = keyBy(rows, 'guideBaseId');

  return guideBaseIds.map((tid) => countByGuideBaseId[tid]?.ctasClicked || 0);
}
