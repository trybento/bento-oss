import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { GraphQLContext } from 'src/graphql/types';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import StepPrototypeType from 'src/graphql/StepPrototype/StepPrototype.graphql';
import { InputSettingsResolverField } from './inputSettings';
import { InputStepFieldTypeEnumType } from './types';

const InputStepPrototypeType = new GraphQLObjectType<
  InputStepPrototype,
  GraphQLContext
>({
  name: 'InputStepPrototype',
  description: 'An input prototype that belongs to a step prototype',
  fields: () => ({
    ...globalEntityId('InputStepPrototype'),
    ...entityIdField(),
    stepPrototype: {
      type: new GraphQLNonNull(StepPrototypeType),
      description:
        'The step prototype to which this input prototype belongs to',
      resolve: async (input, _args, { loaders }) =>
        await loaders.stepPrototypeLoader.load(input.stepPrototypeId),
    },
    label: {
      description: 'Label for the input',
      type: new GraphQLNonNull(GraphQLString),
    },
    type: {
      description: 'Type of the input',
      type: new GraphQLNonNull(InputStepFieldTypeEnumType),
    },
    settings: InputSettingsResolverField,
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Index that indicates the order of the input',
    },
  }),
});

export default InputStepPrototypeType;
