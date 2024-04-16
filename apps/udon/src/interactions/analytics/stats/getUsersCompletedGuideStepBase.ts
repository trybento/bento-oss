import { QueryDatabase, queryRunner } from 'src/data';

export default async function getUsersCompletedGuideStepBases(
  guideStepBaseIds: readonly number[]
) {
  if (guideStepBaseIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
      SELECT
        steps.completed_by_account_user_id AS completed_by_account_user_id
        , guide_step_bases.id AS guide_step_base_id
      FROM core.guide_step_bases
      JOIN core.steps
      	ON guide_step_bases.id = steps.created_from_guide_step_base_id
			JOIN core.account_users au
				ON au.id = steps.completed_by_account_user_id
			JOIN core.guide_bases gb
				ON gb.id = guide_step_bases.guide_base_id
      WHERE guide_step_bases.id IN (:guideStepBaseIds)
      	AND steps.completed_by_account_user_id IS NOT NULL
				AND guide_step_bases.deleted_at IS NULL
      ORDER BY guide_step_bases.id ASC, steps.completed_by_account_user_id ASC`,
    replacements: {
      guideStepBaseIds: guideStepBaseIds as number[],
    },
    queryDatabase: QueryDatabase.follower,
  })) as {
    completed_by_account_user_id: number;
    guide_step_base_id: number;
  }[];

  return rows;
}
