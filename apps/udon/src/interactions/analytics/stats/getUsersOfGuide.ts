import { QueryDatabase, queryRunner } from 'src/data';

export type GetUsersOfGuidesResult = {
  accountUserId: number;
  accountUserExternalId: string;
  guideId: number;
};

/**
 * This logic is supposed to be quite similar to `getUsersOfGuideBases`.
 */
export default async function getUsersOfGuides(
  guideIds: readonly number[]
): Promise<GetUsersOfGuidesResult[]> {
  if (!guideIds.length) return [];

  return (await queryRunner({
    sql: `--sql
        SELECT
          account_users.id as "accountUserId"
          , account_users.external_id as "accountUserExternalId"
          , guides.id as "guideId"
        FROM
          core.account_users
          JOIN core.guide_participants
            ON account_users.id = guide_participants.account_user_id
          JOIN core.guides
            ON guides.id = guide_participants.guide_id
        WHERE
          guides.id IN (:guideIds)
        GROUP BY
          account_users.id
          , guides.id
        ORDER BY
          guides.id ASC
          , account_users.id ASC
      `,
    replacements: {
      guideIds,
    },
    queryDatabase: QueryDatabase.follower,
  })) as GetUsersOfGuidesResult[];
}
