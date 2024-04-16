import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { Dictionary, groupBy } from 'lodash';

import { GuideParticipant } from 'src/data/models/GuideParticipant.model';

type Args = {
  accountUserId: number;
  guideId: number;
};

/**
 * Retrieve GuideParticipants that match the combo of step ID and accountUserID
 */
export default function guideParticipantForGuideAndAccountUserLoader() {
  return new Dataloader<Args, GuideParticipant>(
    async (args) => {
      const accountUserIds = groupBy(args, 'accountUserId');

      /** dict key: GuideParticipants */
      const result: Dictionary<Dictionary<GuideParticipant[]>> = {};
      await promises.map(Object.keys(accountUserIds), async (auId) => {
        result[auId] = groupBy(
          await GuideParticipant.findAll({
            where: {
              accountUserId: auId,
              guideId: accountUserIds[auId]?.map((arg) => arg.guideId),
            },
          }),
          'guideId'
        );
      });

      /* Should only be one guide <-> account user mapping but groupBy creates arrays */
      return args.map(
        (args) => result[args?.accountUserId]?.[args?.guideId]?.[0] || null
      );
    },
    {
      // @ts-ignore
      cacheKeyFn: ({ accountUserId, guideId }) => `${accountUserId}-${guideId}`,
    }
  );
}
