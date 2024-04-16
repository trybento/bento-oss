import Dataloader from 'dataloader';
import { keyBy } from 'lodash';
import { queryRunner } from 'src/data';

type IntegrationsInformation = {
  webhooks: boolean;
};

export default function organizationHasIntegrationsLoader() {
  return new Dataloader<number, IntegrationsInformation | null>(
    async (organizationIds) => {
      const rows = (await queryRunner({
        sql: `--sql
				SELECT
					o.id AS "organizationId",
					SUM(CASE WHEN w.webhook_type = 'standard' THEN 1 ELSE 0 END) > 0 AS "webhooks"
				FROM core.organizations o
				LEFT JOIN core.segment_api_keys sak ON sak.organization_id = o.id
				LEFT JOIN core.integration_api_keys iak ON iak.organization_id = o.id
				LEFT JOIN core.webhooks w ON w.organization_id = o.id
				WHERE o.id IN (:organizationIds)
				GROUP BY o.id;
				`,
        replacements: {
          organizationIds,
        },
      })) as Array<IntegrationsInformation & { organizationId: number }>;

      const infoByOrgId = keyBy(rows, 'organizationId');

      return organizationIds.map((orgId) => infoByOrgId[String(orgId)]);
    }
  );
}
