import Dataloader from 'dataloader';

import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { AccountUser } from 'src/data/models/AccountUser.model';
import getUsersWhoViewedGuideBases from 'src/interactions/analytics/stats/getUsersWhoViewedGuideBase';

export default function participantsWhoViewedGuideBaseLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (guideBaseIds) => {
    const rows = await getUsersWhoViewedGuideBases(guideBaseIds);

    return loadBulk(
      guideBaseIds,
      rows,
      'guideBaseId',
      'accountUserId',
      loaders.accountUserLoader
    );
  });
}
