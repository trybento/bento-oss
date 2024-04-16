import Dataloader from 'dataloader';

import { Loaders } from 'src/data/loaders';
import { AccountUser } from 'src/data/models/AccountUser.model';
import getUsersWhoSkippedAStepInGuideBase from 'src/interactions/analytics/stats/getUsersWhoSkippedAStepInGuideBase';
import { loadBulk } from '../helpers';

export default function usersSkippedAStepInGuideBaseLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (guideBaseIds) => {
    const rows = await getUsersWhoSkippedAStepInGuideBase(guideBaseIds);

    return loadBulk(
      guideBaseIds,
      rows,
      'guide_base_id',
      'account_user_id',
      loaders.accountUserLoader
    );
  });
}
