import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { Loaders } from 'src/data/loaders';
import { AccountUser } from 'src/data/models/AccountUser.model';
import getUsersCompletedGuideStepBase from 'src/interactions/analytics/stats/getUsersCompletedGuideStepBase';

export default function usersCompletedGuideStepBaseLoader(loaders: Loaders) {
  return new Dataloader<number, AccountUser[]>(async (guideStepBaseIds) => {
    const rows = await getUsersCompletedGuideStepBase(guideStepBaseIds);

    const rowsByGuideStepBaseId = groupBy(rows, 'guide_step_base_id');
    return promises.map(guideStepBaseIds, (guideStepBaseId) => {
      const rows = rowsByGuideStepBaseId[guideStepBaseId] || [];
      return promises.map(rows, (row) =>
        loaders.accountUserLoader.load(row.completed_by_account_user_id)
      );
    });
  });
}
