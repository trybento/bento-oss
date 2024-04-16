import Dataloader from 'dataloader';

import { GuideBase } from 'src/data/models/GuideBase.model';
import { collateLoaderResults } from '../helpers';

export default function guideBasesOfOrganizationCount() {
  return new Dataloader<number, number>(async (organizationIds) => {
    const guideBases = (await GuideBase.count({
      where: { organizationId: organizationIds },
      attributes: ['organizationId'],
      group: ['organizationId'],
    })) as { organizationId: number; count: number }[];

    return collateLoaderResults(
      organizationIds,
      guideBases,
      'organizationId',
      'count',
      0
    ) as number[];
  });
}
