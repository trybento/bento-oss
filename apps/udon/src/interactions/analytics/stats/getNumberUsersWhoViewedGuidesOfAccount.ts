import { Op } from 'sequelize';

import { GuideBase } from 'src/data/models/GuideBase.model';
import getUsersWhoViewedGuideBases from './getUsersWhoViewedGuideBase';

/**
 * Count unique users that viewed all guide bases in an account
 */
export default async function getNumberUsersWhoViewedGuidesOfAccount(
  accountIds: readonly number[]
) {
  const gbs = await GuideBase.findAll({
    where: {
      accountId: accountIds,
      createdFromTemplateId: { [Op.ne]: null } as any,
    },
    attributes: ['id'],
  });

  if (!gbs || gbs.length === 0) return Array(accountIds.length).fill(0);

  const views = await getUsersWhoViewedGuideBases(gbs.map((gb) => gb.id));

  const uniqUsersByAccount = views.reduce((counts, view) => {
    if (!counts[view.accountId]) {
      counts[view.accountId] = new Set();
    }
    counts[view.accountId].add(view.accountUserId);
    return counts;
  }, {} as Record<string, Set<number>>);

  return accountIds.map(
    (accountId) => uniqUsersByAccount[accountId]?.size ?? 0
  );
}
