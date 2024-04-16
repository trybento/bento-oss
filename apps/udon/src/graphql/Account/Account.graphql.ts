import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import GuideBaseType from 'src/graphql/GuideBase/GuideBase.graphql';
import EntityId, { entityIdField } from 'bento-common/graphql/EntityId';
import { fetchAttributesForAccount } from 'src/interactions/targeting/fetchAttributesForAccount';

import AccountUserType from 'src/graphql/AccountUser/AccountUser.graphql';
import UserType from 'src/graphql/User/User.graphql';
import { GraphQLContext } from 'src/graphql/types';
import { Account } from 'src/data/models/Account.model';
import { Guide } from 'src/data/models/Guide.model';

const AccountType = new GraphQLObjectType<Account, GraphQLContext>({
  name: 'Account',
  fields: () => ({
    ...globalEntityId('Account'),
    ...entityIdField(),
    externalId: {
      type: GraphQLString,
      description: 'The user-supplied unique ID for the Account',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the account',
    },
    archived: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (account) => !!account.deletedAt,
    },
    blockedAt: {
      type: GraphQLDateTime,
    },
    blockedBy: {
      type: UserType,
      resolve: async (account, _, { loaders }) =>
        loaders.accountsBlockedByLoader.load(account.id),
    },
    hasActiveAccountGuide: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Does the account have an active account onboarding guide',
      resolve: async (account, _, { loaders }) => {
        const activeAccountGuidesCount =
          await loaders.activeAccountGuidesOfAccountCountLoader.load(
            account.id
          );
        return activeAccountGuidesCount > 0;
      },
    },
    attributes: {
      type: new GraphQLNonNull(GraphQLJSON),
      description: 'The attributes associated with this account',
      resolve: (account) => fetchAttributesForAccount({ account }),
    },
    hasGuideBaseWithTemplate: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Does the account have an active guide with the given template',
      args: {
        templateEntityId: {
          type: EntityId,
        },
      },
      resolve: async (account, { templateEntityId }, { loaders }) => {
        if (!templateEntityId) return false;
        const guideBases =
          await loaders.guideBasesOfAccountAndTemplateLoader.load({
            accountId: account.id,
            templateEntityId,
          });
        return guideBases.length > 0;
      },
    },
    participantsWhoViewedGuidesCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The count of participants who viewed guides',
      resolve: (account, _, { loaders }) =>
        loaders.countUsersViewedGuidesOfAccountLoader.load(account.id),
    },
    lastActiveAt: {
      type: GraphQLDateTime,
      description: 'Last time a user was active in this account',
    },
    guideBasesCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The count of guide-bases in the account',
      resolve: (account, _, { loaders }) =>
        loaders.guideBasesCountOfAccountLoader.load(account.id),
    },
    hasGuides: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Determine whether the account has at least one guide',
      resolve: async (account, _, { organization }) => {
        const firstGuide = await Guide.findOne({
          attributes: ['id'],
          where: {
            organizationId: organization.id,
            accountId: account.id,
          },
          raw: true,
        });
        return !!firstGuide;
      },
    },
    guideBases: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GuideBaseType))
      ),
      description: 'The guide bases belonging to the account',
      resolve: async (account, _, { loaders }) =>
        loaders.guideBasesOfAccountLoader.load(account.id),
    },
    accountUsers: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      resolve: (account, _, { loaders }) =>
        loaders.accountUsersOfAccountLoader.load(account.id),
    },
    primaryContact: {
      type: UserType,
      resolve: (account, _, { loaders }) =>
        account.primaryOrganizationUserId
          ? loaders.userLoader.load(account.primaryOrganizationUserId)
          : null,
    },
    createdInOrganizationAt: {
      type: GraphQLDateTime,
      description:
        'When the account was created in the organization (as opposed to within Bento)',
    },
  }),
});

export default AccountType;
