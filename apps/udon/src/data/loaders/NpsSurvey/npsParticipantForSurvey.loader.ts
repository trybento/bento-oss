import promises from 'src/utils/promises';
import DataLoader from 'dataloader';
import { groupBy } from 'lodash';

import NpsParticipant from 'src/data/models/NetPromoterScore/NpsParticipant.model';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';

type Args = {
  accountUserId: number;
  npsSurveyId: number;
};

const npsParticipantForSurveyLoader = () =>
  new DataLoader<Args, NpsParticipant, string>(
    async (args: readonly Args[]) => {
      const accountUserIds = groupBy(args, 'accountUserId');

      const result: Record<number, Record<number, NpsParticipant>> = {};
      await promises.map(Object.keys(accountUserIds), async (auId) => {
        result[auId] = groupBy(
          await NpsParticipant.findAll({
            where: {
              accountUserId: auId,
            },
            include: [
              {
                model: NpsSurveyInstance,
                required: true,
                where: {
                  createdFromNpsSurveyId: accountUserIds[auId]?.map(
                    (a) => a.npsSurveyId
                  ),
                },
              },
            ],
          }),
          'instance.createdFromNpsSurveyId'
        );
      });

      return args.map(
        (args) => result[args.accountUserId]?.[args.npsSurveyId]?.[0] || null
      );
    },
    {
      cacheKeyFn: (args) => `${args.accountUserId}-${args.npsSurveyId}`,
    }
  );

export default npsParticipantForSurveyLoader;
