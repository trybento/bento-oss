import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import EntityIdType, { entityIdField } from 'bento-common/graphql/EntityId';

import globalEntityId from '../../helpers/types/globalEntityId';
import { StepAutoCompleteInteractionTypeEnumType } from '../../StepPrototypeAutoCompleteInteraction/StepPrototypeAutoCompleteInteraction.graphql';
import { dynamicAttributesResolver } from '../resolvers';
import { EmbedContext } from 'src/graphql/types';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';

const EmbedStepAutoCompleteInteractionType = new GraphQLObjectType<
  StepAutoCompleteInteraction,
  EmbedContext
>({
  name: 'EmbedStepAutoCompleteInteraction',
  fields: {
    ...globalEntityId('StepAutoCompleteInteraction'),
    ...entityIdField(),
    step: {
      type: new GraphQLNonNull(EntityIdType),
      resolve: async (interaction, _, { loaders }) => {
        const step = await loaders.stepLoader.load(interaction.stepId);
        return step.entityId;
      },
    },
    guide: {
      type: new GraphQLNonNull(EntityIdType),
      resolve: async (interaction, _, { loaders }) => {
        const step = await loaders.stepLoader.load(interaction.stepId);
        const [guide] = await loaders.guideOfStepLoader.load(step.id);
        return guide.entityId;
      },
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (interaction, _, { loaders }) => {
        return (await loaders.stepPrototypeAutoCompleteInteractionOfStepInteractionLoader.load(
          interaction.id
        ))!.url;
      },
    },
    wildcardUrl: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (interaction, _, { loaders, account, accountUser }) => {
        const ref =
          await loaders.stepPrototypeAutoCompleteInteractionOfStepInteractionLoader.load(
            interaction.id
          );
        return dynamicAttributesResolver(
          ref?.wildcardUrl || '',
          account,
          accountUser
        );
      },
    },
    type: {
      type: new GraphQLNonNull(StepAutoCompleteInteractionTypeEnumType),
      resolve: async (interaction, _, { loaders }) => {
        return (await loaders.stepPrototypeAutoCompleteInteractionOfStepInteractionLoader.load(
          interaction.id
        ))!.type;
      },
    },
    elementSelector: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (interaction, _, { loaders }) => {
        return (await loaders.stepPrototypeAutoCompleteInteractionOfStepInteractionLoader.load(
          interaction.id
        ))!.elementSelector;
      },
    },
  },
});

export default EmbedStepAutoCompleteInteractionType;
