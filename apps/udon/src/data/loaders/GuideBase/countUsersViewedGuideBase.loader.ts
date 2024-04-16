import Dataloader from 'dataloader';

import getNumberParticipantsWhoViewedGuideBases from 'src/interactions/analytics/stats/getNumberUsersWhoViewedGuideBase';

/**
 * Example use case: GuideBase.participantsWhoViewedCount
 */
export default function countUsersViewedGuideBaseLoader() {
  return new Dataloader<number, number>(async (guideBaseIds) => {
    const rows = await getNumberParticipantsWhoViewedGuideBases(guideBaseIds);

    return rows.map((r) => r.count);
  });
}
