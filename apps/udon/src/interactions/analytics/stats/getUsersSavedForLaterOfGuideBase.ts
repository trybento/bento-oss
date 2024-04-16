import { QueryDatabase, queryRunner } from 'src/data';

/**
 * For announcement types this means dismissed
 */
export default async function getUsersSavedForLaterOfGuideBase(
  guideBaseIds: readonly number[]
) {
  if (guideBaseIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
      SELECT DISTINCT
				gp.account_user_id,
				g.created_from_guide_base_id AS guide_base_id
			FROM
        core.guide_participants gp
        JOIN core.guides g ON gp.guide_id = g.id
			WHERE
        g.created_from_guide_base_id IN (:guideBaseIds)
        AND gp.saved_at IS NOT NULL;
		`,
    replacements: {
      guideBaseIds: guideBaseIds as number[],
    },
    queryDatabase: QueryDatabase.follower,
  })) as { account_user_id: number; guide_base_id: number }[];

  return rows;
}
