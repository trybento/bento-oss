import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLUnionType,
} from 'graphql';
import {
  MediaMeta,
  MediaReferenceSettings,
  MediaReferenceType,
  MediaType,
} from '../types/media';
import { enumToGraphqlEnum } from '../utils/graphql';

export const MediaTypeEnumType = enumToGraphqlEnum({
  name: 'MediaTypeEnumType',
  description: 'The type of a media element',
  enumType: MediaType,
});

export const MediaReferenceTypeEnumType = enumToGraphqlEnum({
  name: 'MediaReferenceTypeEnumType',
  description: 'The type of a media reference',
  enumType: MediaReferenceType,
});

const ImageMediaReferenceSettingsFields = {
  alignment: {
    type: GraphQLString,
  },
  fill: {
    type: GraphQLString,
  },
  hyperlink: {
    type: GraphQLString,
  },
  lightboxDisabled: {
    type: GraphQLBoolean,
  },
};

const ImageMediaReferenceSettingsType = new GraphQLObjectType({
  name: 'ImageMediaReferenceSettings',
  fields: ImageMediaReferenceSettingsFields,
});

const VideoMediaReferenceSettingsFields = {
  alignment: {
    type: GraphQLString,
  },
  playsInline: {
    type: GraphQLBoolean,
  },
};

const VideoMediaReferenceSettingsType = new GraphQLObjectType({
  name: 'VideoMediaReferenceSettings',
  fields: VideoMediaReferenceSettingsFields,
});

const NumberAttributeMediaReferenceSettingsFields = {
  _: {
    type: GraphQLBoolean,
  },
};

const NumberAttributeMediaReferenceSettingsType = new GraphQLObjectType({
  name: 'NumberAttributeMediaReferenceSettings',
  fields: NumberAttributeMediaReferenceSettingsFields,
});

export const MediaReferenceSettingsType = new GraphQLUnionType({
  name: 'MediaReferenceSettingsType',
  description: 'The media reference settings',
  types: [
    NumberAttributeMediaReferenceSettingsType,
    ImageMediaReferenceSettingsType,
    VideoMediaReferenceSettingsType,
  ],
  resolveType: ({
    mediaType,
  }: MediaReferenceSettings & { mediaType: MediaType }) => {
    switch (mediaType) {
      case MediaType.numberAttribute:
        return NumberAttributeMediaReferenceSettingsType;

      case MediaType.image:
        return ImageMediaReferenceSettingsType;

      case MediaType.video:
        return VideoMediaReferenceSettingsType;

      default:
        console.warn(
          `[BENTO] Media type '${mediaType}' not implemented, fallbacking to image.`
        );
        return ImageMediaReferenceSettingsType;
    }
  },
});

export const MediaReferenceSettingsInputType = new GraphQLInputObjectType({
  name: 'MediaReferenceSettingsInputType',
  fields: {
    ...ImageMediaReferenceSettingsFields,
    ...VideoMediaReferenceSettingsFields,
    ...NumberAttributeMediaReferenceSettingsFields,
  },
});

const ImageMediaMetaFields = {
  naturalWidth: { type: GraphQLInt },
  naturalHeight: { type: GraphQLInt },
};

const ImageMediaMetaType = new GraphQLObjectType({
  name: 'ImageMediaMeta',
  fields: ImageMediaMetaFields,
});

const VideoMediaMetaFields = {
  videoId: {
    type: GraphQLString,
  },
  videoType: {
    type: GraphQLString,
  },
};

const VideoMediaMetaType = new GraphQLObjectType({
  name: 'VideoMediaMeta',
  fields: VideoMediaMetaFields,
});

const NumberAttributeMediaMetaFields = {
  _: {
    type: GraphQLBoolean,
  },
};

const NumberAttributeMediaMetaType = new GraphQLObjectType({
  name: 'NumberAttributeMediaMeta',
  fields: NumberAttributeMediaMetaFields,
});

export const MediaMetaType = new GraphQLUnionType({
  name: 'MediaMetaType',
  description: 'The media reference settings',
  types: [NumberAttributeMediaMetaType, ImageMediaMetaType, VideoMediaMetaType],
  resolveType: ({ mediaType }: MediaMeta & { mediaType: MediaType }) => {
    switch (mediaType) {
      case MediaType.numberAttribute:
        return NumberAttributeMediaMetaType;

      case MediaType.image:
        return ImageMediaMetaType;

      case MediaType.video:
        return VideoMediaMetaType;

      default:
        console.warn(
          `[BENTO] Media type '${mediaType}' not implemented, fallbacking to image.`
        );
        return ImageMediaMetaType;
    }
  },
});

export const MediaMetaInputType = new GraphQLInputObjectType({
  name: 'MediaMetaInputType',
  fields: {
    ...ImageMediaMetaFields,
    ...VideoMediaMetaFields,
    ...NumberAttributeMediaMetaFields,
  },
});
