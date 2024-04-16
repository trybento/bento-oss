import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { fetchAttributesForAccountUser } from 'src/interactions/targeting/fetchAttributesForAccountUser';

import AccountType from 'src/graphql/Account/Account.graphql';

import { AccountUser } from 'src/data/models/AccountUser.model';
import { GraphQLContext } from 'src/graphql/types';

const AccountUserType = new GraphQLObjectType<AccountUser, GraphQLContext>({
  name: 'AccountUser',
  fields: () => ({
    ...globalEntityId('AccountUser'),
    ...entityIdField(),
    externalId: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    fullName: {
      type: GraphQLString,
    },
    avatarUrl: {
      type: GraphQLString,
      deprecationReason: 'does not exist anymore, will be removed',
    },
    attributes: {
      type: new GraphQLNonNull(GraphQLJSON),
      description: 'The attributes associated with this account',
      resolve: (accountUser) => fetchAttributesForAccountUser({ accountUser }),
    },
    account: {
      type: new GraphQLNonNull(AccountType),
      description: 'The account for whom this user belongs',
      resolve: (accountUser, _, { loaders }) =>
        loaders.accountLoader.load(accountUser.accountId),
    },
    createdInOrganizationAt: {
      type: GraphQLDateTime,
    },
    latestGuide: {
      /* GuideType causes a circular dependency */
      type: GraphQLJSON,
      description: 'The last guide the user interacted with',
      resolve: async (accountUser, _, { loaders }) => {
        const g = await loaders.lastViewedGuideOfAccountUserLoader.load(
          accountUser.id
        );

        return g?.[0] || null;
      },
    },
  }),
});

export default AccountUserType;
