import Dataloader from 'dataloader';

import { AccountUser } from 'src/data/models/AccountUser.model';
import getUsersSavedForLaterOfGuideBase from 'src/interactions/analytics/stats/getUsersSavedForLaterOfGuideBase';
import { Loaders } from '..';
import { loadBulk } from '../helpers';

/**
 * Only really relevant for announcement types
 */
export default function usersSavedForLaterOfGuideBaseLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (guideBaseIds) => {
    const rows = await getUsersSavedForLaterOfGuideBase(guideBaseIds);

    return loadBulk(
      guideBaseIds,
      rows,
      'guide_base_id',
      'account_user_id',
      loaders.accountUserLoader
    );
  });
}
