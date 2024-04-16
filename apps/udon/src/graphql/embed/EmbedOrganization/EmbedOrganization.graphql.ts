import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { entityIdField } from 'bento-common/graphql/EntityId';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { Organization } from 'src/data/models/Organization.model';
import { EmbedContext } from 'src/graphql/types';

const OrganizationType = new GraphQLObjectType<Organization, EmbedContext>({
  name: 'EmbedOrganization',
  fields: () => ({
    ...globalEntityId('EmbedOrganization'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the organization',
    },
    domain: {
      type: GraphQLString,
      description: 'The domain of the organization',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The unique slug identifying the organization',
    },
  }),
});

export default OrganizationType;
