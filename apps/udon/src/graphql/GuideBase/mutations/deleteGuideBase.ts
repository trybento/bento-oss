import { GraphQLID, GraphQLNonNull } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import generateMutation from 'src/graphql/helpers/generateMutation';
import AccountType from 'src/graphql/Account/Account.graphql';
import EntityId from 'bento-common/graphql/EntityId';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Account } from 'src/data/models/Account.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { DeleteLevel } from 'src/jobsBull/jobs/guideDeletion/helpers';
import { updateManualLaunchFlagForTemplates } from 'src/interactions/library/library.helpers';

export default generateMutation({
  name: 'DeleteGuideBase',
  description: 'Delete an existing guide base',
  inputFields: {
    guideBaseEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    deletedGuideBaseId: {
      type: GraphQLID,
    },
    account: {
      type: AccountType,
    },
  },
  mutateAndGetPayload: async ({ guideBaseEntityId }, { organization }) => {
    const guideBase = await GuideBase.findOne({
      where: {
        entityId: guideBaseEntityId,
        organizationId: organization.id,
      },
    });

    if (!guideBase) {
      return {
        errors: ['Guide base not found'],
      };
    }

    const account = await Account.scope('notArchived').findOne({
      where: {
        id: guideBase.accountId,
        organizationId: organization.id,
      },
    });

    if (!account) {
      return {
        errors: ['Account not found'],
      };
    }

    await guideBase.destroy();

    await queueJob({
      jobType: JobType.DeleteGuides,
      organizationId: organization.id,
      deleteLevel: DeleteLevel.GuideBase,
      deleteObjectId: guideBase.id,
    });

    if (
      guideBase.wasAutoLaunched === false &&
      guideBase.createdFromTemplateId
    ) {
      await updateManualLaunchFlagForTemplates({
        templateIds: [guideBase.createdFromTemplateId],
      });
    }

    return {
      deletedGuideBaseId: toGlobalId('GuideBase', guideBaseEntityId),
      account,
    };
  },
});
