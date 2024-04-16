import { QueryDatabase, queryRunner } from 'src/data';
import { keyBy } from 'lodash';

export default async function getAverageTimeToCompleteGuideForOrgs(
  orgIds: number[]
) {
  if (orgIds.length === 0) return [];

  const sql = `--sql
		SELECT
			g.organization_id,
			avg(abs(g.completed_at::date - g.launched_at::date))::float AS avg_date_diff
		FROM core.guides g
		WHERE g.organization_id IN (:orgIds)
		GROUP BY g.organization_id;
	`;

  const rows = (await queryRunner({
    sql,
    replacements: { orgIds },
    queryDatabase: QueryDatabase.follower,
  })) as { organization_id: number; avg_date_diff: number | null }[];

  const rowsByOrgId = keyBy(rows, 'organization_id');

  return orgIds.map((orgId) => rowsByOrgId[orgId]?.avg_date_diff ?? null);
}
