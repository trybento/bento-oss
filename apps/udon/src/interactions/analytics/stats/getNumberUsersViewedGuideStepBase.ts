import getUsersViewedGuideStepBases from './getUsersViewedGuideStepBase';

/**
 * Get the count of the participants who viewed a guide step base
 * We may want to deprecate where we use this alongside getting the actual list,
 *   to avoid querying twice. we can just get users.length instead of this
 */
export default async function getNumberUsersWhoViewedGuideStepBases(
  guideStepBaseIds: readonly number[]
) {
  const allUsers = await getUsersViewedGuideStepBases(guideStepBaseIds);

  const counts = allUsers.reduce((a, r) => {
    a[r.guide_step_base_id]
      ? (a[r.guide_step_base_id] = a[r.guide_step_base_id] + 1)
      : (a[r.guide_step_base_id] = 1);
    return a;
  }, {} as Record<number, number>);

  return guideStepBaseIds.map((guideStepBaseId) => ({
    guideStepBaseId,
    count: counts[guideStepBaseId] || 0,
  }));
}
