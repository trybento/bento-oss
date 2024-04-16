import Dataloader from 'dataloader';

import { OrganizationData } from 'src/data/models/Analytics/OrganizationData.model';
import { collateLoaderResults } from '../helpers';

export default function organizationDataOfOrganization() {
  return new Dataloader<number, OrganizationData | null>(
    async (organizationIds) => {
      const organizationDatum = await OrganizationData.findAll({
        where: { organizationId: organizationIds },
      });
      return collateLoaderResults(
        organizationIds,
        organizationDatum,
        'organizationId'
      );
    }
  );
}
