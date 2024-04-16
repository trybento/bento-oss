import { QueryDatabase, queryRunner } from 'src/data';

/**
 * For announcement types this means dismissed
 */
export default async function getUsersWhoSkippedAStepInGuideBases(
  guideBaseIds: readonly number[]
) {
  if (guideBaseIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
      SELECT DISTINCT
				g.created_from_guide_base_id AS guide_base_id,
				sp.account_user_id
			FROM
        core.step_participants sp
        JOIN core.steps s ON sp.step_id = s.id
        JOIN core.guides g ON g.id = s.guide_id
			WHERE
        sp.skipped_at IS NOT NULL
				AND g.created_from_guide_base_id IN (:guideBaseIds)`,
    replacements: {
      guideBaseIds: guideBaseIds as number[],
    },
    queryDatabase: QueryDatabase.follower,
  })) as { account_user_id: number; guide_base_id: number }[];

  return rows;
}
