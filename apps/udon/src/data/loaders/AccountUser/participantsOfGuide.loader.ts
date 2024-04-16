import Dataloader from 'dataloader';

import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { AccountUser } from 'src/data/models/AccountUser.model';
import getUsersOfGuide from 'src/interactions/analytics/stats/getUsersOfGuide';

/**
 * @todo drop static loaders and arg
 */
export default function participantsOfGuideLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (guideIds) => {
    const rows = await getUsersOfGuide(guideIds);

    return loadBulk(
      guideIds,
      rows,
      'guideId',
      'accountUserId',
      loaders.accountUserLoader
    );
  });
}
