import promises from 'src/utils/promises';
import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import isEmail from 'is-email';
import { Op } from 'sequelize';

import { withTransaction } from 'src/data';

import generateMutation from 'src/graphql/helpers/generateMutation';
import UserType from '../User.graphql';
import { UserStatus } from 'src/data/models/types';
import { logger } from 'src/utils/logger';
import { sendInviteUserEmail } from 'src/interactions/notifications/sendInviteUserEmail';
import { User } from 'src/data/models/User.model';
import { removeWhiteSpaces } from 'bento-common/data/helpers';
import {
  AuthAudit,
  AuthAuditEvent,
  AuthAuditEventOutcome,
} from 'src/data/models/Audit/AuthAudit.model';

interface InviteUsersMutationArgs {
  inviteUsers: string; // Comma separated values.
}

export default generateMutation({
  name: 'InviteUsers',
  description: 'Invite users to an organization',
  inputFields: {
    inviteUsers: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    invitedUsers: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    },
  },
  mutateAndGetPayload: async (
    { inviteUsers }: InviteUsersMutationArgs,
    { organization, user }
  ) => {
    if (!inviteUsers)
      return {
        errors: ['No emails were provided to invite'],
      };

    let inviteUsersArray = removeWhiteSpaces(inviteUsers)
      .toLowerCase()
      .split(',')
      .filter((e) => isEmail(e));

    if (!inviteUsersArray.length)
      return {
        errors: ['No valid emails were provided to invite'],
      };

    // Re-send invitation only to users where status is 'invited'.
    const emailsToIgnore = (
      await User.findAll({
        attributes: ['email'],
        where: {
          email: inviteUsersArray,
          organizationId: organization.id,
          status: { [Op.not]: UserStatus.invited },
        },
      })
    ).map((u) => u.email);

    inviteUsersArray = inviteUsersArray.filter(
      (e) => !emailsToIgnore.includes(e)
    );

    const newUsers = await withTransaction(async () => {
      return await promises.mapSeries(inviteUsersArray, async (email) => {
        const [newUser] = await User.findOrCreate({
          where: {
            email,
          },
          defaults: {
            email,
            organizationId: organization.id,
            status: UserStatus.invited,
            sessionsValidFrom: new Date(),
          },
        });

        await AuthAudit.create(
          {
            eventName: AuthAuditEvent.userInvited,
            userId: newUser.id,
            meta: { invitedByUserId: user.id },
            payload: { email },
            outcome: AuthAuditEventOutcome.unknown,
          },
          { returning: false }
        );

        return newUser;
      });
    });

    // Send emails if users were created succesfully.
    if (newUsers.length) {
      await promises.mapSeries(newUsers, async (newUser) => {
        await sendInviteUserEmail({
          invitedByName: user.fullName || user.email,
          user: newUser,
          organization,
        });
      });

      return newUsers;
    } else {
      logger.info(`No users were invited from payload: ${inviteUsers}`);
      return [];
    }
  },
});
