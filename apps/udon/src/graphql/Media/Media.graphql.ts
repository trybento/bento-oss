import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { EmbedContext, GraphQLContext } from 'src/graphql/types';
import Media from 'src/data/models/Media.model';
import { MediaMetaType, MediaTypeEnumType } from 'bento-common/graphql/media';
import { interpolateAttributes } from 'bento-common/data/helpers';
import { fetchAndMapDynamicAttributes } from 'src/interactions/replaceDynamicAttributes';

const MediaType = new GraphQLObjectType<
  Media,
  EmbedContext | (GraphQLContext & { accountUser: undefined })
>({
  name: 'Media',
  fields: () => ({
    ...globalEntityId('Media'),
    ...entityIdField(),
    type: {
      type: new GraphQLNonNull(MediaTypeEnumType),
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (media, _, { loaders, accountUser }) => {
        if (accountUser) {
          // NOTE: Using 'account' from context causes guide-changed subscriptions to fail.
          const account = await loaders.accountLoader.load(
            accountUser.accountId
          );
          const attributes = fetchAndMapDynamicAttributes(account, accountUser);
          return media.url
            ? interpolateAttributes(media.url, attributes, '')
            : media.url;
        } else {
          return media.url;
        }
      },
    },
    meta: {
      type: new GraphQLNonNull(MediaMetaType),
      resolve: async (media, _, { loaders }) => {
        return {
          ...(media.meta || {}),
          mediaType: media.type,
        };
      },
    },
  }),
});

export default MediaType;
