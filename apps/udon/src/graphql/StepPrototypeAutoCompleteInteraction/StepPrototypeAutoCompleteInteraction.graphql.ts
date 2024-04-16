import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';

import StepPrototypeType from '../StepPrototype/StepPrototype.graphql';
import { GraphQLContext } from '../types';
import globalEntityId from '../helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { StepAutoCompleteInteractionType } from 'bento-common/types';
import { StepPrototypeAutoCompleteInteraction } from 'src/data/models/StepPrototypeAutoCompleteInteraction.model';
import { FAKE_ELEMENT_HTML } from 'bento-common/utils/constants';

export const StepAutoCompleteInteractionTypeEnumType = enumToGraphqlEnum({
  name: 'StepAutoCompleteInteractionTypeEnumType',
  description: 'The type of the step auto complete interaction',
  enumType: StepAutoCompleteInteractionType,
});

const StepPrototypeAutoCompleteInteractionType = new GraphQLObjectType<
  StepPrototypeAutoCompleteInteraction,
  GraphQLContext
>({
  name: 'StepPrototypeAutoCompleteInteraction',
  fields: () => ({
    ...globalEntityId('StepPrototypeAutoCompleteInteraction'),
    ...entityIdField(),
    stepPrototype: {
      type: new GraphQLNonNull(StepPrototypeType),
      resolve: async (interaction, _, { loaders }) =>
        await loaders.stepPrototypeLoader.load(interaction.stepPrototypeId),
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    wildcardUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
    type: {
      type: new GraphQLNonNull(StepAutoCompleteInteractionTypeEnumType),
    },
    elementSelector: {
      type: new GraphQLNonNull(GraphQLString),
    },
    elementText: {
      type: GraphQLString,
    },
    elementHtml: {
      type: GraphQLString,
      /**
       * Note: Temporarily disabled.
       */ resolve: (interaction) =>
        interaction.elementHtml ? FAKE_ELEMENT_HTML : '',
    },
  }),
});

export default StepPrototypeAutoCompleteInteractionType;
