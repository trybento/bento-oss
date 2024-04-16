import { GraphQLNonNull } from 'graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import EntityId from 'bento-common/graphql/EntityId';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { ResetLevel } from 'src/jobsBull/jobs/guideReset/helpers';
import { GuideBase } from 'src/data/models/GuideBase.model';
import GuideBaseType from '../GuideBase.graphql';

export default generateMutation({
  name: 'ResetGuideBase',
  description: 'Reset a guide base',
  inputFields: {
    guideBaseEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    guideBase: {
      type: GuideBaseType,
    },
  },
  mutateAndGetPayload: async (
    { guideBaseEntityId },
    { organization, user }
  ) => {
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

    new AuditContext({
      type: AuditType.GuideBase,
      modelId: guideBase.id,
      organizationId: organization.id,
      userId: user.id,
    }).logEvent({
      eventName: AuditEvent.reset,
    });

    await queueJob({
      jobType: JobType.ResetGuides,
      resetLevel: ResetLevel.GuideBase,
      resetObjectId: guideBase.id,
      organizationId: organization.id,
    });

    return { guideBase };
  },
});
