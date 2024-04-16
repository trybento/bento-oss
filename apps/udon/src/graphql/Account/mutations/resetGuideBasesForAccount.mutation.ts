import { GraphQLNonNull } from 'graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import EntityId from 'bento-common/graphql/EntityId';
import AccountType from 'src/graphql/Account/Account.graphql';
import { Account } from 'src/data/models/Account.model';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { ResetLevel } from 'src/jobsBull/jobs/guideReset/helpers';

export default generateMutation({
  name: 'ResetGuideBasesForAccount',
  description: 'Reset the guide bases of an account',
  inputFields: {
    accountEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    account: {
      type: AccountType,
    },
  },
  mutateAndGetPayload: async ({ accountEntityId }, { organization, user }) => {
    const account = await Account.scope('notArchived').findOne({
      where: {
        entityId: accountEntityId,
        organizationId: organization.id,
      },
    });

    if (!account) {
      return {
        errors: ['Account not found'],
      };
    }

    if (account.isResetting) {
      return {
        errors: ['Guide resetting already in progress for this account'],
      };
    }

    await account.update({ isResetting: true });

    new AuditContext({
      type: AuditType.Account,
      modelId: account.id,
      organizationId: organization.id,
      userId: user.id,
    }).logEvent({
      eventName: AuditEvent.reset,
    });

    await queueJob({
      jobType: JobType.ResetGuides,
      resetLevel: ResetLevel.Account,
      resetObjectId: account.id,
      organizationId: organization.id,
    });

    return { account };
  },
});
