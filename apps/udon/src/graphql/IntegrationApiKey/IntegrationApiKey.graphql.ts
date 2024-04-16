import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import { entityIdField } from 'bento-common/graphql/EntityId';
import { IntegrationState } from 'bento-common/types/integrations';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import OrganizationType from 'src/graphql/Organization/Organization.graphql';
import {
  IntegrationApiKey,
  IntegrationType,
} from 'src/data/models/IntegrationApiKey.model';
import { GraphQLContext } from 'src/graphql/types';
import { IntegrationStateEnum, TargetsType } from '../graphQl.types';

export const IntegrationTypeEnum = enumToGraphqlEnum({
  name: 'IntegrationTypeEnum',
  enumType: IntegrationType,
  description: 'What integration this key is for',
});

const TwoWayStateType = new GraphQLObjectType<
  IntegrationApiKey,
  GraphQLContext
>({
  name: 'TwoWayState',
  fields: () => ({
    upState: {
      type: IntegrationStateEnum,
    },
    downState: {
      type: IntegrationStateEnum,
    },
  }),
});

const ZendeskState = new GraphQLObjectType<IntegrationApiKey, GraphQLContext>({
  name: 'ZendeskState',
  fields: () => ({
    username: {
      type: GraphQLString,
    },
    subdomain: {
      type: GraphQLString,
    },
    liveChat: {
      type: GraphQLBoolean,
      deprecationReason: 'Use orgSettings.helpCenter instead',
    },
    issueSubmission: {
      type: GraphQLBoolean,
      deprecationReason: 'Use orgSettings.helpCenter instead',
    },
    kbSearch: {
      type: GraphQLBoolean,
      deprecationReason: 'Use orgSettings.helpCenter instead',
    },
  }),
});

const IntegrationApiKeyType = new GraphQLObjectType<
  IntegrationApiKey,
  GraphQLContext
>({
  name: 'IntegrationApiKey',
  fields: () => ({
    ...globalEntityId('IntegrationApiKey'),
    ...entityIdField(),
    key: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The API key for the organization to connect to the integration',
    },
    type: {
      type: IntegrationTypeEnum,
    },
    integratedAt: {
      type: GraphQLDateTime,
      description: 'The time of first successful integration',
    },
    lastRunAt: {
      type: GraphQLDateTime,
      description: 'For scheduled integrations, last time it ran automatically',
    },
    state: {
      type: new GraphQLNonNull(IntegrationStateEnum),
    },
    twoWayState: {
      type: TwoWayStateType,
      deprecationReason: 'We should no longer store two states in one key',
      resolve: (integrationApiKey) => {
        const {
          upState = IntegrationState.Inactive,
          downState = IntegrationState.Inactive,
        } = integrationApiKey.options || {};
        return {
          upState,
          downState,
        };
      },
    },
    zendeskState: {
      type: ZendeskState,
      resolve: (integrationApiKey) =>
        integrationApiKey.type === IntegrationType.zendesk
          ? integrationApiKey.options
          : {},
    },
    issueSubmission: {
      type: GraphQLBoolean,
      resolve: () => false,
    },
    kbSearch: {
      type: GraphQLBoolean,
      resolve: () => false,
    },
    targeting: {
      description:
        'If this particular integration specifically should be targeted to certain segments',
      deprecationReason: 'Not in use, to potentially be revisited later.',
      type: new GraphQLNonNull(TargetsType),
    },
    organization: {
      type: new GraphQLNonNull(OrganizationType),
      description: 'The organization that the Segment API key belongs to',
      resolve: (integrationApiKey, _, { loaders }) =>
        loaders.organizationLoader.load(integrationApiKey.organizationId),
    },
  }),
});

export default IntegrationApiKeyType;
