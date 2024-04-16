import { QueryDatabase, queryRunner } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';

export default async function fetchUserIdsWhoEditedTemplates({
  organization,
}: {
  organization: Organization;
}) {
  const rows = (await queryRunner({
    sql: `--sql
      SELECT DISTINCT
        t.edited_by_user_id AS "userId"
      FROM core.templates t
      WHERE t.organization_id = :organizationId
        AND t.edited_by_user_id IS NOT NULL
        AND t.deleted_at IS NULL
    `,
    queryDatabase: QueryDatabase.primary,
    replacements: {
      organizationId: organization.id,
    },
  })) as { userId: number }[];

  return rows.map((r) => r.userId);
}
