import Dataloader from 'dataloader';
import promises from 'src/utils/promises';
import { groupBy } from 'lodash';

import { InputStepAnswer } from 'src/data/models/inputStepAnswer.model';

type Args = {
  inputStepBaseId: number;
  stepId: number;
};

const inputStepAnswerOfStepForEmbeddableLoader = () =>
  new Dataloader<Args, InputStepAnswer, string>(
    async (args) => {
      const result = {};
      const stepIds = groupBy(args, 'stepId');

      await promises.map(Object.keys(stepIds), async (stepId) => {
        result[stepId] = groupBy(
          await InputStepAnswer.findAll({
            where: {
              stepId,
              inputStepBaseId: stepIds[stepId]?.map(
                (arg) => arg.inputStepBaseId
              ),
            },
            order: [['updatedAt', 'DESC']],
          }),
          'inputStepBaseId'
        );
      });

      return args.map(
        (args) => result[args?.stepId]?.[args?.inputStepBaseId]?.[0] || null
      );
    },
    {
      cacheKeyFn: ({ inputStepBaseId, stepId }) =>
        `${inputStepBaseId}-${stepId}`,
    }
  );

export default inputStepAnswerOfStepForEmbeddableLoader;
