import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import EntityIdType from 'bento-common/graphql/EntityId';

import { dynamicAttributesResolver } from './../resolvers';
import { EmbedContext } from '../../types';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { inlineEmbedBaseFields } from '../../InlineEmbed/InlineEmbed.graphql';

const EmbedInlineEmbedType = new GraphQLObjectType<
  OrganizationInlineEmbed,
  EmbedContext
>({
  name: 'EmbedOrganizationInlineEmbed',
  fields: {
    ...inlineEmbedBaseFields,
    wildcardUrl: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (inlineEmbed, _, { account, accountUser }) =>
        dynamicAttributesResolver(
          inlineEmbed.wildcardUrl,
          account,
          accountUser
        ),
    },
    guide: {
      type: EntityIdType,
      description: 'The guide associated with this inline embed',
      resolve: async (inlineEmbed, _, { loaders, accountUser }) =>
        (
          await loaders.guideForInlineEmbedLoader.load({
            inlineEmbedId: inlineEmbed.id,
            accountUserId: accountUser.id,
          })
        )?.entityId,
    },
  },
});

export default EmbedInlineEmbedType;
