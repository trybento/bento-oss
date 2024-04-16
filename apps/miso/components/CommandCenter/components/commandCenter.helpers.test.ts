import { faker } from '@faker-js/faker';
import { RankableType } from 'bento-common/types';

import { AutoLaunchableTarget } from 'components/EditorCommon/targeting.helpers';
import {
  ExtendedAutoLaunchableTarget,
  computeRankChanges,
} from './guidePriority.helpers';

const getAutoLaunchableTarget = (
  priorityRanking: number
): AutoLaunchableTarget => ({
  entityId: faker.string.uuid(),
  name: faker.company.buzzPhrase(),
  type: RankableType.guide,
  launchedAt: new Date().toISOString(),
  priorityRanking,
});

describe('guide priorities', () => {
  test('results empty when no changes', () => {
    const rankableObjects = [0, 1, 2].map((i) => getAutoLaunchableTarget(i));

    const changes = computeRankChanges({
      originalRanking: rankableObjects,
      newRanking: rankableObjects,
    });

    expect(changes.length).toEqual(0);
  });

  test('only changed objects show up', () => {
    const originalRanking = [0, 1, 2].map((i) => getAutoLaunchableTarget(i));

    const newRanking = [
      originalRanking[2],
      originalRanking[1],
      originalRanking[0],
    ];

    const changes = computeRankChanges({
      originalRanking,
      newRanking,
    });

    expect(changes.length).toEqual(2);
  });

  test('stores prev and current rank', () => {
    const originalRanking = [0, 1].map((i) => getAutoLaunchableTarget(i));

    const newRanking = [originalRanking[1], originalRanking[0]];

    const changes = computeRankChanges({
      originalRanking,
      newRanking,
    });

    const newLeader = changes[0];

    expect(newLeader.currentRank).toEqual(0);
    expect(newLeader.previousRank).toEqual(1);
  });
});
