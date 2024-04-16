import Dataloader from 'dataloader';

import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { AccountUser } from 'src/data/models/AccountUser.model';
import getUsersCompletedAStepInGuideBase from 'src/interactions/analytics/stats/getUsersCompletedAStepInGuideBase';

export default function usersCompletedAStepInGuideBaseLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (guideBaseIds) => {
    const rows = await getUsersCompletedAStepInGuideBase(guideBaseIds);

    return loadBulk(
      guideBaseIds,
      rows,
      'guide_base_id',
      'completed_by_account_user_id',
      loaders.accountUserLoader
    );
  });
}
