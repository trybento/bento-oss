import { GraphQLNonNull, GraphQLString } from 'graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import EntityId from 'bento-common/graphql/EntityId';

import StepType from 'src/graphql/Step/Step.graphql';

import { StepTypeEnumType } from 'src/graphql/graphQl.types';
import { Step } from 'src/data/models/Step.model';

export default generateMutation({
  name: 'EditStep',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
    name: {
      type: GraphQLString,
    },
    body: {
      type: GraphQLString,
    },
    stepType: {
      type: new GraphQLNonNull(StepTypeEnumType),
    },
  },
  outputFields: {
    step: {
      type: StepType,
    },
  },
  mutateAndGetPayload: async (args) => {
    const { entityId, name, body, stepType } = args;

    const step = await Step.findOne({
      where: {
        entityId: entityId,
      },
    });

    if (!step) {
      throw new Error('Step not found');
    }

    await step.update({
      name,
      body,
      stepType,
    });

    return { step };
  },
});
