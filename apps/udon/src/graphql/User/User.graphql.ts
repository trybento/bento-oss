import {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import OrganizationType from 'src/graphql/Organization/Organization.graphql';

import googleProfilePictureUrl from 'src/interactions/googleProfilePictureUrl';
import { User } from 'src/data/models/User.model';
import { GraphQLContext } from 'src/graphql/types';
import { UserOrganization } from 'src/data/models/UserOrganization.model';
import { OrganizationOrgSettingsType } from '../Organization/OrganizationSettings.graphql';

const UserType = new GraphQLObjectType<User, GraphQLContext>({
  name: 'User',
  fields: () => ({
    ...globalEntityId('User'),
    ...entityIdField(),
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    fullName: {
      type: GraphQLString,
    },
    avatarUrl: {
      type: GraphQLString,
      resolve: async (user, _, { loaders }) => {
        const googlePictureUrl = await googleProfilePictureUrl(
          loaders,
          user.id
        );
        if (googlePictureUrl) return googlePictureUrl;
        else return '';
      },
    },
    phoneNumber: {
      type: GraphQLString,
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    isSuperadmin: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    extra: {
      type: GraphQLJSON,
    },
    hasAssignedAccounts: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (user, _, { loaders, organization }) => {
        const assignedAccounts =
          await loaders.accountsAssignedToUserLoader.load(user.id);

        // Account for Bento superadmins logged into a different org
        // We will want a better way to manage this moving forward
        const assignedAccountsInOrg = assignedAccounts.filter(
          (account) => account.organizationId === organization.id
        );
        return assignedAccountsInOrg.length > 0;
      },
    },
    organization: {
      type: new GraphQLNonNull(OrganizationType),
      resolve: async (_user, _args, { organization }) => organization,
    },
    orgSettings: {
      type: OrganizationOrgSettingsType,
      resolve: async (_user, _args, { organization, loaders }) =>
        await loaders.organizationSettingsOfOrganizationLoader.load(
          organization.id
        ),
    },
    allOrgs: {
      type: new GraphQLNonNull(new GraphQLList(OrganizationType)),
      resolve: async (user) =>
        await UserOrganization.findAll({ where: { userId: user.id } }),
    },
    hasBentoOnboardingGuide: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (_, _args, { user, organization, loaders }) => {
        const guide = await loaders.userBentoOnboardingGuideLoader.load({
          orgEntityId: organization.entityId,
          userEntityId: user.entityId,
        });

        return !!guide;
      },
    },
    isBentoOnboardingGuideComplete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (_, _args, { user, organization, loaders }) => {
        const guide = await loaders.userBentoOnboardingGuideLoader.load({
          orgEntityId: organization.entityId,
          userEntityId: user.entityId,
        });

        return !!guide?.completedAt;
      },
    },
  }),
});

export default UserType;
