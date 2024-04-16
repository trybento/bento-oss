import { QueryDatabase, queryRunner } from 'src/data';

/**
 * Gets list of account users that have viewed a step in requested guide base Ids
 * Theoretically the numbers here should match up with getUsersWhoViewedGuideBases
 */
export default async function getUsersWhoViewedAStepInGuideBases(
  guideBaseIds: readonly number[]
) {
  if (guideBaseIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
      SELECT
        DISTINCT ON (guide_bases.id, account_users.entity_id)
        account_users.entity_id AS account_user_entity_id,
        guide_bases.id as guide_base_id
      FROM core.guide_bases
      JOIN core.guides
      	ON guides.created_from_guide_base_id = guide_bases.id
      JOIN core.guide_participants
      	ON guide_participants.guide_id = guides.id
      JOIN core.account_users
      	ON guide_participants.account_user_id = account_users.id
      JOIN core.steps
      	ON steps.guide_id = guides.id
      JOIN core.organizations
      	ON steps.organization_id = organizations.id
      JOIN analytics.step_daily_rollup sdr
      	ON steps.id = sdr.step_id AND account_users.id = sdr.account_user_id AND organizations.id = sdr.organization_id
      WHERE guide_bases.id IN (:guideBaseIds)
      GROUP BY guide_bases.id, account_users.entity_id`,
    replacements: {
      guideBaseIds: guideBaseIds as number[],
    },
    queryDatabase: QueryDatabase.follower,
  })) as { account_user_entity_id: string; guide_base_id: number }[];

  return rows;
}
