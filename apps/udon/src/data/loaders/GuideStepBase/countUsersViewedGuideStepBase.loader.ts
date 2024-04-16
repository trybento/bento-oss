import Dataloader from 'dataloader';

import getNumberUsersWhoViewedGuideStepBases from 'src/interactions/analytics/stats/getNumberUsersViewedGuideStepBase';

/**
 * Example use case: GuideStepBase.usersViewed
 */
export default function countUsersViewedGuideStepBaseLoader() {
  return new Dataloader<number, number>(async (guideStepBaseIds) => {
    const rows = await getNumberUsersWhoViewedGuideStepBases(guideStepBaseIds);

    return rows.map((r) => r.count);
  });
}
