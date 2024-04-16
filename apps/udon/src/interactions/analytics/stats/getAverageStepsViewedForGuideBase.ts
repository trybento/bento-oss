import { keyBy } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';

export default async function getAverageStepsViewedForGuideBase(
  guideBaseIds: readonly number[]
) {
  if (guideBaseIds.length === 0) return [];

  const sql = `--sql
		WITH counts AS (
			SELECT
        g.created_from_guide_base_id AS guide_base_id, 
        sdr.account_user_id, 
        COUNT(s.id)
			FROM analytics.step_daily_rollup sdr
			JOIN core.steps s ON sdr.step_id = s.id
			-- Drop steps from dynamic modules
			JOIN core.guide_modules gm
				ON s.guide_module_id = gm.id
			JOIN core.guide_module_bases gmb
				ON gm.created_from_guide_module_base_id = gmb.id AND gmb.added_dynamically_at IS NULL
			JOIN core.guides g ON s.guide_id = g.id
			WHERE g.created_from_guide_base_id IN (:guideBaseIds)
				AND gm.deleted_at IS NULL
			GROUP BY g.created_from_guide_base_id, sdr.account_user_id
		)
		SELECT
      c.guide_base_id,
      AVG(c.count)
    FROM
      counts c
		GROUP BY
      c.guide_base_id;
	`;

  const rows = (await queryRunner({
    sql,
    replacements: {
      guideBaseIds,
    },
    queryDatabase: QueryDatabase.follower,
  })) as { guide_base_id: number; avg: number }[];

  const avgsByGuideBaseId = keyBy(rows, 'guide_base_id');

  return guideBaseIds.map((gbId) =>
    Math.ceil(avgsByGuideBaseId[gbId]?.avg || 0)
  );
}
