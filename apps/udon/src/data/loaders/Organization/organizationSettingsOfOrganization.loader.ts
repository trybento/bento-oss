import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { groupLoad } from '../helpers';

export default function organizationSettingsOfOrganization(loaders: Loaders) {
  return new Dataloader<number, OrganizationSettings | null>(
    async (organizationIds) => {
      const rows = (await queryRunner({
        sql: `
        SELECT
          organization_settings.id as "organizationSettingsId"
          , organizations.id as "organizationId"
        FROM core.organization_settings
        JOIN core.organizations
        ON organization_settings.organization_id = organizations.id
        WHERE organizations.id IN (:organizationIds)
        ORDER BY organizations.id ASC, organization_settings.id ASC
      `,
        replacements: {
          organizationIds: organizationIds as number[],
        },
      })) as { organizationSettingsId: number; organizationId: number }[];

      return groupLoad(
        organizationIds,
        rows,
        'organizationId',
        'organizationSettingsId',
        loaders.organizationSettingsLoader
      );
    }
  );
}
