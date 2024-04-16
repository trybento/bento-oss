import { VisualTagHighlightType } from './../types/index';
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql';
import { enumToGraphqlEnum } from '../utils/graphql';

export const VisualTagHighlightTypeType = enumToGraphqlEnum({
  name: 'VisualTagHighlightType',
  enumType: VisualTagHighlightType,
});

export const VisualTagHighlightSettingsType = new GraphQLObjectType({
  name: 'VisualTagHighlightSettings',
  fields: {
    type: { type: VisualTagHighlightTypeType },
    pulse: { type: GraphQLBoolean },
    color: { type: GraphQLString },
    thickness: { type: GraphQLInt },
    padding: { type: GraphQLInt },
    radius: { type: GraphQLInt },
    opacity: { type: GraphQLFloat },
    text: { type: GraphQLString },
  },
});

export const VisualTagStyleSettingsType = new GraphQLUnionType({
  name: 'VisualTagStyleSettings',
  // add more
  types: [VisualTagHighlightSettingsType],
  resolveType: (_data) => {
    return VisualTagHighlightSettingsType;
  },
});

const HighlightSettingsInputFields = {
  type: { type: VisualTagHighlightTypeType },
  pulse: { type: GraphQLBoolean },
  color: { type: GraphQLString },
  thickness: { type: GraphQLInt },
  padding: { type: GraphQLInt },
  radius: { type: GraphQLInt },
  opacity: { type: GraphQLFloat },
  text: { type: GraphQLString },
};

export const VisualTagStyleSettingsInputType = new GraphQLInputObjectType({
  name: 'VisualTagStyleSettingsInput',
  fields: {
    // must add all fields here since union type isn't supported as an input type
    // do validation in the mutation
    ...HighlightSettingsInputFields,
  },
});
