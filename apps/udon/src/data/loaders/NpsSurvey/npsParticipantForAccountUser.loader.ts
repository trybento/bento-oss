import Dataloader from 'dataloader';
import { AtLeast, RankableType } from 'bento-common/types';

import NpsParticipant from 'src/data/models/NetPromoterScore/NpsParticipant.model';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';
import sortAvailableObjects, {
  RankableObjectWith,
} from 'src/interactions/priorityRanking/sortAvailableObjects';

type RankableNpsParticipant = Omit<NpsParticipant, 'instance'> & {
  instance: AtLeast<Omit<NpsSurveyInstance, 'survey'>, 'id' | 'startedAt'> & {
    survey: AtLeast<NpsSurvey, 'id' | 'priorityRanking'>;
  };
};

/**
 * Get active NPS surveys for the account users if
 *   - They are not dismissed
 *   - They are not completed
 */
export const findNpsParticipantsForAccountUser = async (
  accountUserIds: readonly number[] | number[]
): Promise<RankableNpsParticipant[]> => {
  return (await NpsParticipant.scope('incomplete').findAll({
    where: {
      accountUserId: accountUserIds,
    },
    include: [
      {
        model: NpsSurveyInstance.scope('active'),
        attributes: ['id', 'startedAt'],
        required: true,
        include: [
          {
            model: NpsSurvey,
            attributes: ['id', 'priorityRanking'],
            order: [['priorityRanking', 'ASC']],
            required: true,
          },
        ],
      },
    ],
  })) as RankableNpsParticipant[];
};

export const transformNpsParticipantsToRankableObjects = (
  participants: RankableNpsParticipant[]
) => {
  return participants.reduce<
    Record<number, RankableObjectWith<RankableNpsParticipant>[]>
  >((acc, np) => {
    const auId = np.accountUserId;
    if (!acc[auId]) acc[auId] = [];

    acc[auId].push({
      type: RankableType.survey,
      id: np.id,
      rank: np.instance!.survey!.priorityRanking,
      launchedAt: np.instance!.startedAt,
      instance: np,
    });

    return acc;
  }, {});
};

/**
 * Fetches all incomplete NPS participants for the account user.
 *
 * NOTE: Results includes the associated NpsSurveyInstance and NpsSurvey objects.
 *
 * WARNING: This does NOT consider other rankable objects (i.e. guides), therefore shouldn't ever
 * be used to compute the actual "orderIndex" of nps surveys, but can be used to determine the sort order
 * within surveys.
 */
export default function npsParticipantForAccountUserLoader() {
  return new Dataloader<number, RankableNpsParticipant[]>(
    async (accountUserIds) => {
      const participants = await findNpsParticipantsForAccountUser(
        accountUserIds
      );
      const rankableParticipantObjects =
        transformNpsParticipantsToRankableObjects(participants);

      return accountUserIds.map((auId) => {
        // only ever return a single instance for each account user id
        const first = sortAvailableObjects(
          rankableParticipantObjects[auId] || []
        )[0]?.instance;
        return first ? [first] : [];
      });
    }
  );
}
