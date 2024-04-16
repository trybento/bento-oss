import Dataloader from 'dataloader';

import { GuideBase } from 'src/data/models/GuideBase.model';
import { collateLoaderResultsBulk } from '../helpers';

export default function guideBasesOfOrganization() {
  return new Dataloader<number, GuideBase[]>(async (organizationIds) => {
    const guideBases = await GuideBase.findAll({
      where: { organizationId: organizationIds },
    });
    return collateLoaderResultsBulk(
      organizationIds,
      guideBases,
      'organizationId'
    );
  });
}
