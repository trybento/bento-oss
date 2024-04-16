import { QueryDatabase, queryRunner } from 'src/data';

/**
 * Gets list of account users that have viewed requested guide base Ids
 */
export default async function getUsersWhoViewedGuideBases(
  guideBaseIds: readonly number[]
) {
  if (guideBaseIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
        SELECT DISTINCT
          gp.account_user_id as "accountUserId",
          g.created_from_guide_base_id as "guideBaseId",
          g.account_id as "accountId"
        FROM core.guides g
        JOIN core.guide_participants gp ON gp.guide_id = g.id
        JOIN core.accounts a ON g.account_id = a.id
        WHERE g.created_from_guide_base_id IN (:guideBaseIds)
          AND gp.first_viewed_at IS NOT NULL
          AND a.deleted_at IS NULL
        ORDER BY g.created_from_guide_base_id ASC, gp.account_user_id ASC
      `,
    replacements: {
      guideBaseIds: guideBaseIds as number[],
    },
    queryDatabase: QueryDatabase.follower,
  })) as { accountUserId: number; guideBaseId: number; accountId: number }[];

  return rows;
}

/**
 * Gets list of account users that have viewed requested guide base Ids
 */
export async function getUsersWhoViewedGuideBasesUsingRollup(
  guideBaseIds: readonly number[]
) {
  if (guideBaseIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
        SELECT DISTINCT
          au.id as "accountUserId"
          , g.created_from_guide_base_id as "guideBaseId"
				FROM analytics.guide_daily_rollup r
        JOIN core.account_users au
					ON r.account_user_id = au.id
				JOIN core.accounts a
					ON au.account_id = a.id AND a.deleted_at IS NULL
        JOIN core.guides g
        	ON g.id = r.guide_id
        WHERE g.created_from_guide_base_id IN (:guideBaseIds)
        ORDER BY g.created_from_guide_base_id ASC, au.id ASC
      `,
    replacements: {
      guideBaseIds: guideBaseIds as number[],
    },
    queryDatabase: QueryDatabase.follower,
  })) as { accountUserId: number; guideBaseId: number }[];

  return rows;
}
