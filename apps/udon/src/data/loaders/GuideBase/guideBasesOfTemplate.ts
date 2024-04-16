import Dataloader from 'dataloader';

import { Loaders } from 'src/data/loaders';
import { collateLoaderResultsBulk } from 'src/data/loaders/helpers';
import { GuideBase } from 'src/data/models/GuideBase.model';

export default function guideBasesOfTemplate(_loaders: Loaders) {
  return new Dataloader<number, GuideBase[]>(async (templateIds) => {
    const guideBases = await GuideBase.findAll({
      where: { createdFromTemplateId: templateIds },
    });
    return collateLoaderResultsBulk(
      templateIds,
      guideBases,
      'createdFromTemplateId'
    );
  });
}
