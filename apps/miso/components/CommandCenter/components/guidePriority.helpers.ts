import { AutoLaunchableTarget } from 'components/EditorCommon/targeting.helpers';

export type ExtendedAutoLaunchableTarget = AutoLaunchableTarget & {
  previousRank?: number;
  currentRank?: number;
};

export const computeRankChanges = ({
  originalRanking,
  newRanking,
}: {
  originalRanking: AutoLaunchableTarget[];
  newRanking: AutoLaunchableTarget[];
}) => {
  /* Transform into a record with old rank */
  const oldRanksByEntityId = originalRanking.reduce<
    Record<string, ExtendedAutoLaunchableTarget>
  >((a, t, i) => {
    a[t.entityId] = {
      ...t,
      previousRank: i,
    };
    return a;
  }, {});

  return newRanking.reduce<ExtendedAutoLaunchableTarget[]>((a, t, i) => {
    const previous = oldRanksByEntityId[t.entityId];
    /* Didn't change, skip */
    if (i === previous.previousRank) return a;

    a.push({
      ...previous,
      currentRank: i,
    });

    return a;
  }, []);
};
