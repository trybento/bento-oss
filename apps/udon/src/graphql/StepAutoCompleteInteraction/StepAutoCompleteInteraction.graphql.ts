import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import StepType from '../GuideStepBase/GuideStepBase.graphql';
import { GraphQLContext } from '../types';
import globalEntityId from '../helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';
import { StepAutoCompleteInteractionTypeEnumType } from '../StepPrototypeAutoCompleteInteraction/StepPrototypeAutoCompleteInteraction.graphql';

const StepAutoCompleteInteractionType = new GraphQLObjectType<
  StepAutoCompleteInteraction,
  GraphQLContext
>({
  name: 'StepAutoCompleteInteraction',
  fields: () => ({
    ...globalEntityId('StepAutoCompleteInteraction'),
    ...entityIdField(),
    step: {
      type: new GraphQLNonNull(StepType),
      resolve: async (interaction, _, { loaders }) =>
        await loaders.stepLoader.load(interaction.stepId),
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (interaction, _, { loaders }) => {
        return (
          await loaders.stepPrototypeAutoCompleteInteractionOfStepInteractionLoader.load(
            interaction.id
          )
        )?.url;
      },
    },
    wildcardUrl: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (interaction, _, { loaders }) => {
        return (
          await loaders.stepPrototypeAutoCompleteInteractionOfStepInteractionLoader.load(
            interaction.id
          )
        )?.wildcardUrl;
      },
    },
    type: {
      type: new GraphQLNonNull(StepAutoCompleteInteractionTypeEnumType),
      resolve: async (interaction, _, { loaders }) => {
        return (
          await loaders.stepPrototypeAutoCompleteInteractionOfStepInteractionLoader.load(
            interaction.id
          )
        )?.type;
      },
    },
    elementSelector: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (interaction, _, { loaders }) => {
        return (
          await loaders.stepPrototypeAutoCompleteInteractionOfStepInteractionLoader.load(
            interaction.id
          )
        )?.elementSelector;
      },
    },
  }),
});

export default StepAutoCompleteInteractionType;
