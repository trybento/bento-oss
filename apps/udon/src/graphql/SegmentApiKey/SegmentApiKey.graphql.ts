import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';

import OrganizationType from 'src/graphql/Organization/Organization.graphql';
import {
  BentoApiKeyType,
  SegmentApiKey,
} from 'src/data/models/SegmentApiKey.model';
import { GraphQLContext } from 'src/graphql/types';
import { GraphQLDateTime } from 'graphql-iso-date';

export const BentoApiKeyTypeEnum = enumToGraphqlEnum({
  name: 'BentoApiKeyTypeEnum',
  enumType: BentoApiKeyType,
  description: 'What integration this key is for',
});

const SegmentApiKeyType = new GraphQLObjectType<SegmentApiKey, GraphQLContext>({
  name: 'SegmentApiKey',
  fields: () => ({
    ...globalEntityId('SegmentApiKey'),
    ...entityIdField(),
    key: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        "The API key for the organization to connect to Bento's segment integration",
    },
    type: {
      type: BentoApiKeyTypeEnum,
    },
    integratedAt: {
      type: GraphQLDateTime,
      description: 'The time of first successful integration',
    },
    organization: {
      type: new GraphQLNonNull(OrganizationType),
      description: 'The organization that the Segment API key belongs to',
      resolve: (segmentApiKey, _, { loaders }) =>
        loaders.organizationLoader.load(segmentApiKey.organizationId),
    },
  }),
});

export default SegmentApiKeyType;
