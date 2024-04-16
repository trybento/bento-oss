import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { InputFieldConfigMap } from 'bento-common/types/graphql';
import EntityIdType, { entityIdField } from 'bento-common/graphql/EntityId';

import {
  InlineEmbedAlignmentType,
  InlineEmbedPositionType,
  InlineEmbedStateType,
} from '../InlineEmbed.graphql';

const BaseInlineEmbedInputFields: InputFieldConfigMap = {
  url: {
    type: new GraphQLNonNull(GraphQLString),
  },
  wildcardUrl: {
    type: new GraphQLNonNull(GraphQLString),
  },
  elementSelector: {
    type: new GraphQLNonNull(GraphQLString),
  },
  position: {
    type: new GraphQLNonNull(InlineEmbedPositionType),
  },
  topMargin: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  rightMargin: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  bottomMargin: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  leftMargin: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  padding: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  borderRadius: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  alignment: {
    type: InlineEmbedAlignmentType,
  },
  maxWidth: {
    type: GraphQLInt,
  },
};

/**
 * Inline embed creation input type.
 * This is supposed to be used on mutations focused on creating new instances.
 */
export const CreateInlineEmbedInputType = new GraphQLInputObjectType({
  name: 'CreateInlineEmbedInputType',
  fields: {
    ...BaseInlineEmbedInputFields,
  },
});

/**
 * Inline embed upsert input type.
 * This is supposed to be used on mutations focused on creating and/or updating instances.
 */
export const EditInlineEmbedInputType = new GraphQLInputObjectType({
  name: 'EditInlineEmbedInputType',
  fields: {
    ...BaseInlineEmbedInputFields,
    ...entityIdField(),
    state: {
      type: InlineEmbedStateType,
    },
  },
});

/**
 * Inline embed upsert input type.
 * This is supposed to be used on mutations focused on creating and/or updating instances.
 */
export const UpsertInlineEmbedInputType = new GraphQLInputObjectType({
  name: 'UpsertInlineEmbedInputType',
  fields: {
    ...BaseInlineEmbedInputFields,
    entityId: {
      type: EntityIdType,
    },
    state: {
      type: InlineEmbedStateType,
    },
  },
});
