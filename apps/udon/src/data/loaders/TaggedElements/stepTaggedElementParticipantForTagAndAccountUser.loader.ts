import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { groupBy, keyBy } from 'lodash';

import { StepTaggedElementParticipant } from 'src/data/models/StepTaggedElementParticipant.model';

interface Args {
  accountUserId: number;
  tagId: number;
}

/**
 * Retrieve a single `StepTaggedElementParticipant` instance that match the combo of Tag Id
 * and AccountUser Id, since there can be only one.
 */
export default function stepTaggedElementParticipantForTagAndAccountUserLoader() {
  return new Dataloader<Args, StepTaggedElementParticipant, string>(
    async (args) => {
      const argsByAccountUserId = groupBy(args, 'accountUserId');

      const result = await promises.reduce<
        string,
        Record<number, Record<number, StepTaggedElementParticipant>>
      >(
        Object.keys(argsByAccountUserId),
        async (acc, auId) => {
          acc[auId] = keyBy(
            await StepTaggedElementParticipant.findAll({
              where: {
                accountUserId: auId,
                stepTaggedElementId: argsByAccountUserId[auId]?.map(
                  (arg) => arg.tagId
                ),
              },
            }),
            'stepTaggedElementId'
          );
          return acc;
        },
        {}
      );

      return args.map(
        (args) => result[args?.accountUserId]?.[args?.tagId] || null
      );
    },
    { cacheKeyFn: ({ accountUserId, tagId }) => `${accountUserId}-${tagId}` }
  );
}
