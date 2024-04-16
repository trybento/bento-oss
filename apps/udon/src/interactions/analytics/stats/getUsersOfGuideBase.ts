import { QueryDatabase, queryRunner } from 'src/data';

export type GetUsersOfGuideBasesResult = {
  accountUserId: number;
  accountUserExternalId: string;
  guideBaseId: number;
};

/**
 * This logic is supposed to be quite similar to `getUsersOfGuides`.
 */
export default async function getUsersOfGuideBases(
  guideBaseIds: readonly number[]
): Promise<GetUsersOfGuideBasesResult[]> {
  if (!guideBaseIds.length) return [];

  return (await queryRunner({
    sql: `--sql
        SELECT
          account_users.id as "accountUserId"
          , account_users.external_id as "accountUserExternalId"
          , guide_bases.id as "guideBaseId"
        FROM
          core.account_users
          JOIN core.guide_participants
            ON account_users.id = guide_participants.account_user_id
          JOIN core.guides
            ON guides.id = guide_participants.guide_id
          JOIN core.guide_bases
            ON guide_bases.id = guides.created_from_guide_base_id
        WHERE
          guide_bases.id IN (:guideBaseIds)
        GROUP BY
          account_users.id
          , guide_bases.id
        ORDER BY
          guide_bases.id ASC
          , account_users.id ASC
      `,
    replacements: {
      guideBaseIds,
    },
    queryDatabase: QueryDatabase.follower,
  })) as GetUsersOfGuideBasesResult[];
}
