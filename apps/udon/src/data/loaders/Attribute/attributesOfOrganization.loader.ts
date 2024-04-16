import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { queryRunner } from 'src/data';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { Loaders } from '..';

export default function attributesOfOrganizationLoader(loaders: Loaders) {
  return new Dataloader<number, CustomAttribute[]>(async (organizationIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          custom_attributes.id AS custom_attribute_id
          , organizations.id AS organization_id
        FROM core.custom_attributes
        JOIN core.organizations
        ON custom_attributes.organization_id = organizations.id
        WHERE organizations.id IN (:organizationIds)
        ORDER BY organizations.id, custom_attributes.type ASC, custom_attributes.name ASC
      `,
      replacements: {
        organizationIds: organizationIds as number[],
      },
    })) as { custom_attribute_id: number; organization_id: number }[];

    const rowsByOrganizationId = groupBy(rows, 'organization_id');
    return promises.map(organizationIds, (organizationId) => {
      const rowsForOrganizationId = rowsByOrganizationId[organizationId] || [];
      return promises.map(rowsForOrganizationId, (row) =>
        loaders.customAttributeLoader.load(row.custom_attribute_id)
      );
    });
  });
}
