import { GraphQLString, GraphQLBoolean } from 'graphql';
import { Organization } from 'src/data/models/Organization.model';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { OrganizationOrgSettingsType } from '../OrganizationSettings.graphql';

export default generateMutation({
  name: 'SetOrgSettings',
  inputFields: {
    orgName: {
      type: GraphQLString,
    },
    sendEmailNotifications: {
      type: GraphQLBoolean,
    },
    fallbackCommentsEmail: {
      type: GraphQLString,
    },
    sendAccountUserNudges: {
      type: GraphQLBoolean,
    },
    defaultUserNotificationURL: {
      type: GraphQLString,
    },
  },
  outputFields: {
    orgSettings: { type: OrganizationOrgSettingsType },
  },
  mutateAndGetPayload: async (args, { organization }) => {
    const {
      orgName,
      sendEmailNotifications,
      fallbackCommentsEmail,
      sendAccountUserNudges,
      defaultUserNotificationURL,
    } = args;

    await OrganizationSettings.update(
      {
        sendEmailNotifications,
        fallbackCommentsEmail,
        sendAccountUserNudges,
        defaultUserNotificationURL,
      },
      {
        where: {
          organizationId: organization.id,
        },
      }
    );

    if (orgName) {
      await Organization.update(
        { name: orgName },
        {
          where: {
            id: organization.id,
          },
        }
      );
    }

    return {
      orgSettings: organization,
    };
  },
});
