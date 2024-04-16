import { keyBy } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';

/** Flat count of steps completed. Indicative of progress for account guides */
export default async function getNumberStepsCompletedOfGuideBase(
  guideBaseIds: readonly number[]
) {
  if (guideBaseIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
			SELECT
				g.created_from_guide_base_id AS guide_base_id,
				COUNT(s.id)
			FROM core.steps s
			-- Drop steps from dynamic modules
			JOIN core.guide_modules gm
				ON s.guide_module_id = gm.id
			JOIN core.guide_module_bases gmb
				ON gm.created_from_guide_module_base_id = gmb.id
				AND gmb.added_dynamically_at IS NULL
			JOIN core.guides g ON s.guide_id = g.id
			WHERE g.created_from_guide_base_id IN (:guideBaseIds)
				AND s.completed_at IS NOT NULL
				AND gm.deleted_at IS NULL
			GROUP BY g.created_from_guide_base_id;
		`,
    replacements: { guideBaseIds },
    queryDatabase: QueryDatabase.follower,
  })) as { guide_base_id: number; count: number }[];

  const countByGuideBaseId = keyBy(rows, 'guide_base_id');

  return guideBaseIds.map((tid) => countByGuideBaseId[tid]?.count || 0);
}
