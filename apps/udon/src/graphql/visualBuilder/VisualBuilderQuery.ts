import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { VisualBuilderContext } from '../types';
import VisualBuilderSessionType from './VisualBuilderSession/VisualBuilderSession.graphql';
import EntityId from 'bento-common/graphql/EntityId';
import { VisualBuilderSession } from 'src/data/models/VisualBuilderSession.model';
import { OrganizationUISettingsType } from './Organization/OrganizationUISettings.graphql';
import { filterFeatureFlags } from 'src/utils/features/api';
import AttributeType from './Attribute/Attribute.graphql';
import fetchAttributesForOrganization from 'src/interactions/targeting/fetchAttributesForOrganization';

export default new GraphQLObjectType<unknown, VisualBuilderContext>({
  name: 'RootType',
  fields: () => ({
    findVisualBuilderSession: {
      type: VisualBuilderSessionType,
      args: {
        entityId: {
          type: EntityId,
        },
      },
      resolve: async (_, { entityId }, { organization, user }) => {
        const session = await VisualBuilderSession.findOne({
          where: {
            entityId,
            organizationId: organization.id,
            userId: user.id,
          },
        });

        return session;
      },
    },
    uiSettings: {
      type: OrganizationUISettingsType,
      resolve: (_, _args, { organization, loaders }) =>
        loaders.organizationSettingsOfOrganizationLoader.load(organization.id),
    },
    organizationDomain: {
      type: GraphQLString,
      resolve: async (_, _args, { organization }) => organization.domain,
    },
    enabledFeatureFlags: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
      description: 'Features enabled for this organization',
      resolve: async (_, _args, { organization, loaders }) => {
        const flags = await loaders.featureFlagsForOrganizationLoader.load(
          organization.id
        );

        return await filterFeatureFlags(flags, 'admin');
      },
    },
    attributes: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AttributeType))
      ),
      description: 'Attributes used for targeting',
      resolve: (_, _args, { loaders, organization }) =>
        fetchAttributesForOrganization({ loaders, organization }),
    },
  }),
});
