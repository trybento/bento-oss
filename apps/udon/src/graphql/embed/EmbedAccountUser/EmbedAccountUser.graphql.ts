import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { entityIdField } from 'bento-common/graphql/EntityId';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import EmbedAccountType from 'src/graphql/embed/EmbedAccount/EmbedAccount.graphql';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { EmbedContext } from 'src/graphql/types';

const AccountUserType = new GraphQLObjectType<AccountUser, EmbedContext>({
  name: 'EmbedAccountUser',
  fields: () => ({
    ...globalEntityId('EmbedAccountUser'),
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
    firstName: {
      type: GraphQLString,
      resolve: (accountUser) =>
        accountUser.fullName ? accountUser.fullName.split(' ')[0] : 'User',
    },
    account: {
      type: new GraphQLNonNull(EmbedAccountType),
      description: 'The account for whom this user belongs',
      resolve: (accountUser, _, { loaders }) =>
        loaders.accountLoader.load(accountUser.accountId),
    },
    createdInOrganizationAt: {
      type: GraphQLDateTime,
    },
  }),
});

export default AccountUserType;
