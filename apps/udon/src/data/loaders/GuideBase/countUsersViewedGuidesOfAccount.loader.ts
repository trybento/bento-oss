import Dataloader from 'dataloader';

import getNumberParticipantsWhoViewedGuidesOfAccount from 'src/interactions/analytics/stats/getNumberUsersWhoViewedGuidesOfAccount';

/**
 * Example use case: Accounts.participantsWhoViewedGuide
 */
export default function countUsersViewedGuidesOfAccountLoader() {
  return new Dataloader<number, number>((accountIds) =>
    getNumberParticipantsWhoViewedGuidesOfAccount(accountIds)
  );
}
