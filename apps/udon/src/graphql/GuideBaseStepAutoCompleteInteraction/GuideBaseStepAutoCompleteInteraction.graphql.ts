import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import GuideBaseStepType from '../GuideStepBase/GuideStepBase.graphql';
import { GraphQLContext } from '../types';
import globalEntityId from '../helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { GuideBaseStepAutoCompleteInteraction } from 'src/data/models/GuideBaseStepAutoCompleteInteraction.model';
import { StepAutoCompleteInteractionTypeEnumType } from '../StepPrototypeAutoCompleteInteraction/StepPrototypeAutoCompleteInteraction.graphql';

const GuideBaseStepAutoCompleteInteractionType = new GraphQLObjectType<
  GuideBaseStepAutoCompleteInteraction,
  GraphQLContext
>({
  name: 'GuideBaseStepAutoCompleteInteraction',
  fields: () => ({
    ...globalEntityId('GuideBaseStepAutoCompleteInteraction'),
    ...entityIdField(),
    step: {
      type: new GraphQLNonNull(GuideBaseStepType),
      resolve: async (interaction, _, { loaders }) =>
        await loaders.guideStepBaseLoader.load(interaction.guideBaseStepId),
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (interaction, _, { loaders }) => {
        return (
          await loaders.stepPrototypeAutoCompleteInteractionLoader.load(
            interaction.createdFromSpacInteractionId || 0
          )
        )?.url;
      },
    },
    wildcardUrl: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (interaction, _, { loaders }) => {
        return (
          await loaders.stepPrototypeAutoCompleteInteractionLoader.load(
            interaction.createdFromSpacInteractionId || 0
          )
        )?.wildcardUrl;
      },
    },
    type: {
      type: new GraphQLNonNull(StepAutoCompleteInteractionTypeEnumType),
      resolve: async (interaction, _, { loaders }) => {
        return (
          await loaders.stepPrototypeAutoCompleteInteractionLoader.load(
            interaction.createdFromSpacInteractionId || 0
          )
        )?.type;
      },
    },
    elementSelector: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (interaction, _, { loaders }) => {
        return (
          await loaders.stepPrototypeAutoCompleteInteractionLoader.load(
            interaction.createdFromSpacInteractionId || 0
          )
        )?.elementSelector;
      },
    },
  }),
});

export default GuideBaseStepAutoCompleteInteractionType;
