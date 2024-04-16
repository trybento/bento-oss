import Dataloader from 'dataloader';
import { Op } from 'sequelize';
import { RankableType } from 'bento-common/types';

import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide, GuideScope } from 'src/data/models/Guide.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Template } from 'src/data/models/Template.model';
import sortAvailableObjects, {
  RankableObjectWith,
} from 'src/interactions/priorityRanking/sortAvailableObjects';
import { Loaders } from '..';

/**
 * Find all available guides for the given account user.
 *
 * @returns Promise the list of available guides
 */
export const findAvailableGuidesForAccountUser = async (
  accountUserIds: number[] | readonly number[]
): Promise<Guide[]> => {
  return Guide.scope([GuideScope.launched, GuideScope.active]).findAll({
    include: [
      {
        model: GuideParticipant.scope('notObsolete'),
        required: true,
        attributes: ['id', 'doneAt', 'firstViewedAt'],
        include: [
          {
            model: AccountUser,
            required: true,
            attributes: ['id'],
            where: { id: accountUserIds },
          },
        ],
      },
      {
        association: 'createdFromBranchingPath',
        attributes: ['id'],
        where: {
          accountUserId: {
            [Op.col]: 'guideParticipants.account_user_id',
          },
        },
        required: false,
        include: [
          {
            association: 'triggeredFromGuide',
            required: true,
            attributes: ['id', 'launchedAt'],
          },
        ],
      },
      {
        model: GuideBase.scope('notObsolete'),
        required: true,
        attributes: ['activatedAt'],
      },
      {
        model: Template.scope('notArchived'),
        required: true,
        attributes: ['priorityRanking', 'isSideQuest'],
      },
    ],
  });
};

export const transformGuidesToRankableObjects = (guides: Guide[]) => {
  return guides.reduce<Record<number, RankableObjectWith<Guide>[]>>(
    (acc, g) => {
      const auId = g.guideParticipants[0].accountUser.id;
      if (!acc[auId]) acc[auId] = [];

      acc[auId].push({
        type: RankableType.guide,
        id: g.id,
        rank: g.createdFromTemplate!.priorityRanking,
        /**
         * We use the guide base date because account guide objects are created on launch, and
         *   user guide objects on identify. This will cause account guides to auto bias
         *   towards a higher priority even if they're manually launched at the same time with
         *   lower priority ranking.
         */
        launchedAt: g.createdFromGuideBase!.activatedAt!,
        branchedFrom: g.createdFromBranchingPath?.triggeredFromGuide?.id,
        instance: g,
      });

      return acc;
    },
    {}
  );
};

/**
 * Determines if guide is finished (completed or skipped).
 */
const isGuideFinished = (guide: Guide) => {
  return !!guide.completedAt || !!guide.guideParticipants[0].doneAt;
};

/**
 * Filter out main quest guides which are incomplete, not viewed, and were
 * launched after **two** other incomplete main quest guides.
 *
 * All side quests are simply returned.
 */
const mainQuestFilter = (guide: Guide, i: number, guides: Guide[]): boolean => {
  if (guide.createdFromTemplate?.isSideQuest) return true;
  const previousMainQuests = guides.slice(0, i).filter((g) => {
    return !g.createdFromTemplate?.isSideQuest && !isGuideFinished(g);
  });

  return (
    isGuideFinished(guide) ||
    !!guide.guideParticipants?.[0]?.firstViewedAt ||
    previousMainQuests.length < 2
  );
};

/**
 * Fetches all available guides for the account user.
 *
 * WARNING: This does NOT consider other rankable objects (i.e. NPS surveys), therefore shouldn't ever
 * be used to compute the actual "orderIndex" of guides, but can be used to determine the sort order within guides
 * (i.e. next/previous) guides.
 */
export default function availableGuidesForAccountUserLoader(_loaders: Loaders) {
  return new Dataloader<number, Guide[]>(async (accountUserIds) => {
    const guides = await findAvailableGuidesForAccountUser(accountUserIds);
    const rankableGuideObjects = transformGuidesToRankableObjects(guides);

    return accountUserIds.map((auId) => {
      return sortAvailableObjects(rankableGuideObjects[auId] || [])
        .map((obj) => obj.instance)
        .filter(mainQuestFilter);
    });
  });
}
