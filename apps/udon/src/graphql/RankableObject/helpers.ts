import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { RankableType } from 'bento-common/types';
import { EntityId } from '../helpers/types';

export const RankableObjectTypeType = enumToGraphqlEnum({
  name: 'RankableObjectTypeType',
  enumType: RankableType,
});

export const RankableObjectInputType = new GraphQLInputObjectType({
  name: 'RankableObjectInputType',
  fields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
    priorityRanking: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    type: { type: new GraphQLNonNull(RankableObjectTypeType) },
  },
});

export const RankableObjectType = new GraphQLObjectType({
  name: 'RankableObjectType',
  fields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
    priorityRanking: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    type: { type: new GraphQLNonNull(RankableObjectTypeType) },
  },
});
