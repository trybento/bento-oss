import { keyBy } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';

/**
 * For account guides we expect this to max out at 1
 *   because there should only be 1 guide per guide base.
 */
export default async function getNumberGuidesWithView(
  guideBaseIds: readonly number[]
): Promise<number[]> {
  if (!guideBaseIds.length) return [];

  const rows = (await queryRunner({
    sql: `--sql
			SELECT
				g.created_from_guide_base_id AS "guideBaseId",
				COUNT(DISTINCT g.id) AS "guidesSeen"
			FROM core.guides g 
			JOIN core.guide_participants gp ON gp.guide_id = g.id AND gp.first_viewed_at IS NOT NULL
			WHERE g.created_from_guide_base_id IN (:guideBaseIds)
			GROUP BY g.created_from_guide_base_id
		`,
    replacements: {
      guideBaseIds,
    },
    queryDatabase: QueryDatabase.follower,
  })) as { guideBaseId: number; guidesSeen: number }[];

  const rowsByGuideBaseId = keyBy(rows, 'guideBaseId');

  return guideBaseIds.map(
    (guideBaseId) => rowsByGuideBaseId[guideBaseId]?.guidesSeen ?? 0
  );
}
