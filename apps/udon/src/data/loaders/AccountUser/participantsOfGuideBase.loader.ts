import Dataloader from 'dataloader';

import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { AccountUser } from 'src/data/models/AccountUser.model';
import getUsersOfGuideBases from 'src/interactions/analytics/stats/getUsersOfGuideBase';

/**
 * @todo drop static loaders and arg
 */
export default function participantsOfGuideBaseLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (guideBaseIds) => {
    const rows = await getUsersOfGuideBases(guideBaseIds);

    return loadBulk(
      guideBaseIds,
      rows,
      'guideBaseId',
      'accountUserId',
      loaders.accountUserLoader
    );
  });
}
