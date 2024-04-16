import Dataloader from 'dataloader';

import { Loaders } from 'src/data/loaders';
import { AccountUser } from 'src/data/models/AccountUser.model';
import getParticipantsWhoViewedAStepInGuideBases from 'src/interactions/analytics/stats/getUsersWhoViewedAStepInGuideBase';
import { loadBulk } from '../helpers';

/**
 * Example use case: GuideBase.usersViewedAStep
 */
export default function usersViewedAStepInGuideBaseLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (guideBaseIds) => {
    const rows = await getParticipantsWhoViewedAStepInGuideBases(guideBaseIds);

    return loadBulk(
      guideBaseIds,
      rows,
      'guide_base_id',
      'account_user_entity_id',
      loaders.accountUserEntityLoader
    );
  });
}
