import { keyBy } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';

export default async function getAverageStepsCompletedForGuideBase(
  guideBaseIds: readonly number[]
) {
  if (guideBaseIds.length === 0) return [];

  const sql = `--sql
		WITH counts AS (
			SELECT
				g.created_from_guide_base_id, g.id AS guide_id,
				COUNT(s.id)
			FROM core.steps s
			-- Drop steps from dynamic modules
			JOIN core.guide_modules gm
				ON s.guide_module_id = gm.id
			JOIN core.guide_module_bases gmb
				ON gm.created_from_guide_module_base_id = gmb.id AND gmb.added_dynamically_at IS NULL
			JOIN core.guides g ON s.guide_id = g.id
			WHERE g.created_from_guide_base_id IN (:guideBaseIds)
				AND s.is_complete = true
				AND gm.deleted_at IS NULL
			GROUP BY g.created_from_guide_base_id, g.id
		)
		SELECT
			c.created_from_guide_base_id AS guide_base_id,
			AVG(c.count)
		FROM counts c
		GROUP BY c.created_from_guide_base_id;
	`;

  const rows = (await queryRunner({
    sql,
    replacements: { guideBaseIds },
    queryDatabase: QueryDatabase.follower,
  })) as {
    guide_base_id: number;
    avg: number;
  }[];

  const avgsByGuideBaseId = keyBy(rows, 'guide_base_id');

  return guideBaseIds.map((gbId) =>
    Math.ceil(avgsByGuideBaseId[gbId]?.avg || 0)
  );
}
