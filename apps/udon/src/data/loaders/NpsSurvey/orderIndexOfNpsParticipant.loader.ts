import Dataloader from 'dataloader';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';

import { Loaders } from '..';
import { logger } from 'src/utils/logger';
import sortAvailableObjects from 'src/interactions/priorityRanking/sortAvailableObjects';
import {
  findAvailableGuidesForAccountUser,
  transformGuidesToRankableObjects,
} from '../Guide/availableGuidesForAccountUser.loader';
import {
  findNpsParticipantsForAccountUser,
  transformNpsParticipantsToRankableObjects,
} from './npsParticipantForAccountUser.loader';

type Args = {
  accountUserId: number;
  npsParticipantId: number;
};

/**
 * Computes the orderIndex of INCOMPLETE NPS participant surveys.
 *
 * WARNING: This can't be used to compute the orderIndex of a answered/dismissed survey since
 * those aren't included in the results set.
 */
export default function orderIndexOfNpsParticipantLoader(_loaders: Loaders) {
  return new Dataloader<Args, number, string>(
    async (args) => {
      const accountUserIds = args.map((arg) => arg.accountUserId);

      const guides = await findAvailableGuidesForAccountUser(accountUserIds);

      const rankableGuideObjects = transformGuidesToRankableObjects(guides);

      const surveyParticipants = await findNpsParticipantsForAccountUser(
        accountUserIds
      );

      const rankableSurveyParticipantObjects =
        transformNpsParticipantsToRankableObjects(surveyParticipants);

      return args.map((arg) => {
        const rankableObjects = [
          ...(rankableGuideObjects[arg.accountUserId] || []),
          ...(rankableSurveyParticipantObjects[arg.accountUserId] || []),
        ];

        const orderIndex = sortAvailableObjects<any>(rankableObjects).findIndex(
          (object) =>
            object.type === 'survey' && object.id === arg.npsParticipantId
        );

        if (orderIndex === -1) {
          logger.debug(
            `Failed to compute order index for survey:${arg.accountUserId}:${arg.npsParticipantId}`
          );
          return DEFAULT_PRIORITY_RANKING;
        }

        return orderIndex;
      });
    },
    {
      cacheKeyFn: (args) => `${args.accountUserId}-${args.npsParticipantId}`,
    }
  );
}
