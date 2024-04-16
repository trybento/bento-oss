import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { EmbedContext } from 'src/graphql/types';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { InputStepBase } from 'src/data/models/inputStepBase.model';
import { InputSettingsResolverField } from 'src/graphql/InputStep/inputSettings';
import { InputStepFieldTypeEnumType } from 'src/graphql/InputStep/types';

const EmbedInputStep = new GraphQLObjectType<InputStepBase, EmbedContext>({
  name: 'EmbedInputStep',
  description: 'An input that belongs to a step',
  fields: () => ({
    ...globalEntityId('EmbedInputStep'),
    ...entityIdField(),
    label: {
      description: 'Label for the input',
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (input, _args, { loaders }) => {
        return (
          await loaders.inputStepPrototypeLoader.load(
            input.createdFromInputStepPrototypeId!
          )
        ).label;
      },
    },
    type: {
      description: 'Type of the input',
      type: new GraphQLNonNull(InputStepFieldTypeEnumType),
      resolve: async (input, _args, { loaders }) => {
        return (
          await loaders.inputStepPrototypeLoader.load(
            input.createdFromInputStepPrototypeId!
          )
        ).type;
      },
    },
    settings: InputSettingsResolverField,
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Index that indicates the order of the input',
      resolve: async (input, _args, { loaders }) => {
        return (
          await loaders.inputStepPrototypeLoader.load(
            input.createdFromInputStepPrototypeId!
          )
        ).orderIndex;
      },
    },
    answer: {
      type: GraphQLString,
      description: 'The value answered for this input',
    },
  }),
});

export default EmbedInputStep;
