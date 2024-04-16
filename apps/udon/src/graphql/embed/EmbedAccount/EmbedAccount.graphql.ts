import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';

import AccountUserType from 'src/graphql/AccountUser/AccountUser.graphql';
import { Account } from 'src/data/models/Account.model';
import { EmbedContext } from 'src/graphql/types';
import {
  IntegrationApiKey,
  IntegrationType,
} from 'src/data/models/IntegrationApiKey.model';
import { IntegrationState } from 'bento-common/types/integrations';

const EmbedAccountType = new GraphQLObjectType<Account, EmbedContext>({
  name: 'EmbedAccount',
  fields: () => ({
    ...globalEntityId('EmbedAccount'),
    ...entityIdField(),
    externalId: {
      type: GraphQLString,
      description: 'The user-supplied unique ID for the Account',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the account',
    },
    accountUsers: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      resolve: (account, _, { loaders }) =>
        loaders.accountUsersOfAccountLoader.load(account.id),
    },
    ticketsEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (_, __, { organization }) => {
        /* Temp logic, will be replaced when we have targeting. */
        const ik = await IntegrationApiKey.findOne({
          where: {
            organizationId: organization.id,
            type: IntegrationType.zendesk,
            state: IntegrationState.Active,
          },
        });

        return !!ik;
      },
    },
  }),
});

export default EmbedAccountType;
