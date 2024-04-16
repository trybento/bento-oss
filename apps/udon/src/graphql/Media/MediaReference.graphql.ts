import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import EntityIdType, { entityIdField } from 'bento-common/graphql/EntityId';
import { GraphQLContext } from 'src/graphql/types';
import MediaType from './Media.graphql';
import MediaReference from 'src/data/models/MediaReference.model';
import {
  MediaMetaInputType,
  MediaReferenceSettingsInputType,
  MediaReferenceSettingsType,
  MediaReferenceTypeEnumType,
  MediaTypeEnumType,
} from 'bento-common/graphql/media';

const MediaReferenceType = new GraphQLObjectType<
  MediaReference,
  GraphQLContext
>({
  name: 'MediaReference',
  fields: () => ({
    ...globalEntityId('MediaReference'),
    ...entityIdField(),
    mediaId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    referenceId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    referenceType: {
      type: new GraphQLNonNull(MediaReferenceTypeEnumType),
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    settings: {
      type: new GraphQLNonNull(MediaReferenceSettingsType),
      resolve: async (mediaReference, _, { loaders }) => {
        const media = await loaders.mediaLoader.load(mediaReference.mediaId);
        return {
          ...(mediaReference.settings || {}),
          mediaType: media.type,
        };
      },
    },
    media: {
      type: new GraphQLNonNull(MediaType),
      description: 'The media associated to this record.',
      resolve: async (mediaReference, _, { loaders }) =>
        loaders.mediaLoader.load(mediaReference.mediaId),
    },
  }),
});

export const MediaInputType = new GraphQLInputObjectType({
  name: 'MediaInputType',
  fields: {
    type: {
      type: MediaTypeEnumType,
    },
    url: {
      type: GraphQLString,
    },
    meta: {
      type: MediaMetaInputType,
    },
  },
});

export const MediaReferenceInputType = new GraphQLInputObjectType({
  name: 'MediaReferenceInputType',
  fields: {
    entityId: {
      type: EntityIdType,
    },
    media: {
      type: new GraphQLNonNull(MediaInputType),
    },
    settings: {
      type: MediaReferenceSettingsInputType,
    },
  },
});

export default MediaReferenceType;
