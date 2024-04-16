import getUsersWhoViewedGuideBases from './getUsersWhoViewedGuideBase';

/**
 * Get the count of the participants who viewed a guide base
 * We may want to deprecate where we use this alongside getting the actual list,
 *   to avoid querying twice. we can just get users.length instead of this
 */
export default async function getNumberUsersWhoViewedGuideBases(
  guideBaseIds: readonly number[]
) {
  const allUsers = await getUsersWhoViewedGuideBases(guideBaseIds);

  const counts = allUsers.reduce((a, r) => {
    a[r.guideBaseId]
      ? (a[r.guideBaseId] = a[r.guideBaseId] + 1)
      : (a[r.guideBaseId] = 1);
    return a;
  }, {} as Record<number, number>);

  return guideBaseIds.map((guideBaseId) => ({
    guideBaseId,
    count: counts[guideBaseId] || 0,
  }));
}
