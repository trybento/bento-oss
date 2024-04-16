import { QueryDatabase, queryRunner } from 'src/data';

export default async function getUsersViewedGuideStepBases(
  guideStepBaseIds: readonly number[]
) {
  if (guideStepBaseIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
      SELECT
        DISTINCT ON (guide_step_bases.id, au.entity_id)
        au.entity_id AS account_user_entity_id,
        guide_step_bases.id AS guide_step_base_id
      FROM core.guide_step_bases
      JOIN core.steps
      	ON guide_step_bases.id = steps.created_from_guide_step_base_id
      JOIN core.organizations
      	ON steps.organization_id = organizations.id
			JOIN analytics.step_daily_rollup sdr
      	ON steps.id = sdr.step_id AND organizations.id = sdr.organization_id
			JOIN core.account_users au
				ON au.id = sdr.account_user_id
			JOIN core.guide_bases gb
				ON gb.id = guide_step_bases.guide_base_id
			WHERE guide_step_bases.id IN (:guideStepBaseIds)
				AND guide_step_bases.deleted_at IS NULL
      GROUP BY guide_step_bases.id, au.entity_id`,
    replacements: {
      guideStepBaseIds: guideStepBaseIds as number[],
    },
    queryDatabase: QueryDatabase.follower,
  })) as { account_user_entity_id: string; guide_step_base_id: number }[];

  return rows;
}
