import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { Loaders } from 'src/data/loaders';
import { AccountUser } from 'src/data/models/AccountUser.model';
import getUsersViewedGuideStepBases from 'src/interactions/analytics/stats/getUsersViewedGuideStepBase';

/**
 * Exampple use case: GuideStepBase.usersWhoViewed
 */
export default function usersViewedGuideStepBaseLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (guideStepBaseIds) => {
    const rows = await getUsersViewedGuideStepBases(guideStepBaseIds);

    const rowsByGuideStepBaseId = groupBy(rows, 'guide_step_base_id');
    return promises.map(guideStepBaseIds, (guideStepBaseId) => {
      const rows = rowsByGuideStepBaseId[guideStepBaseId] || [];
      return promises.map(rows, (row) =>
        loaders.accountUserEntityLoader.load(row.account_user_entity_id)
      );
    });
  });
}
