import promises from 'src/utils/promises';
import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { StepParticipant } from 'src/data/models/StepParticipant.model';

interface Args {
  accountUserId: number;
  stepId: number;
}

/**
 * Retrieve StepParticipants that matche the combo of step ID and accountUserID
 */
export default function stepParticipantForStepAndAccountUserLoader() {
  //
  return new Dataloader<Args, StepParticipant[], string>(
    async (args) => {
      const accountUserIds = groupBy(args, 'accountUserId');

      /** dict key: StepParticipants[] */
      const result = {};
      await promises.map(Object.keys(accountUserIds), async (auId) => {
        result[auId] = groupBy(
          await StepParticipant.findAll({
            where: {
              accountUserId: auId,
              stepId: accountUserIds[auId]?.map((arg) => arg.stepId),
            },
          }),
          'stepId'
        );
      });

      return args.map(
        (args) => result[args?.accountUserId]?.[args?.stepId] || null
      );
    },
    { cacheKeyFn: ({ accountUserId, stepId }) => `${accountUserId}-${stepId}` }
  );
}
