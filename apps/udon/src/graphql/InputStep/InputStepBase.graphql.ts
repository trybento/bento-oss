import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { GraphQLContext } from 'src/graphql/types';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { InputStepBase } from 'src/data/models/inputStepBase.model';
import GuideStepBaseType from '../GuideStepBase/GuideStepBase.graphql';
import { InputSettingsResolverField } from './inputSettings';
import { InputStepFieldTypeEnumType } from './types';

const InputStepBaseType = new GraphQLObjectType<InputStepBase, GraphQLContext>({
  name: 'InputStepBase',
  description: 'An input base that belongs to a guide step base',
  fields: () => ({
    ...globalEntityId('InputStepBase'),
    ...entityIdField(),
    guideStepBase: {
      type: new GraphQLNonNull(GuideStepBaseType),
      description: 'The guide step base to which this input base belongs to',
      resolve: async (input, _args, { loaders }) =>
        await loaders.guideStepBaseLoader.load(input.guideStepBaseId),
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

export default InputStepBaseType;
