import { GuideState, GuideTypeEnum } from 'bento-common/types';

import { GuideBase } from 'src/data/models/GuideBase.model';
import createGuideFromGuideBase from '../createGuideFromGuideBase';

type Args = {
  guideBase: GuideBase;
  activateAt?: Date;
};

export default async function createGuideForAccountGuideBase({
  activateAt,
  guideBase,
}: Args) {
  const template = await guideBase.$get('createdFromTemplate');

  /* Orphaned gb is pending removal */
  if (!template)
    throw new Error(
      'Attempting to launch a deleted guide base. Check identify queries.'
    );

  /** Only for account type guides */
  if (template.type !== GuideTypeEnum.account)
    throw new Error('Called account guide helper on a user guide');

  const activatedAt = activateAt || new Date();

  const guide = await createGuideFromGuideBase({
    guideBase,
    state: GuideState.active,
    launchedAt: activatedAt,
  });

  return guide;
}
