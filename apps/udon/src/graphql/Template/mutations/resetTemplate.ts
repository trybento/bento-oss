import { GraphQLNonNull } from 'graphql';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import { GraphQLContext } from 'src/graphql/types';
import { Template } from 'src/data/models/Template.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { ResetLevel } from '../../../jobsBull/jobs/guideReset/helpers';
import TemplateType from '../Template.graphql';

export default generateMutation({
  name: 'ResetTemplate',
  description: 'Resets the guides for a given template',
  inputFields: {
    templateEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    template: {
      type: TemplateType,
    },
  },
  mutateAndGetPayload: async (
    { templateEntityId },
    { organization, user }: GraphQLContext
  ) => {
    let template = await Template.findOne({
      where: {
        entityId: templateEntityId,
        organizationId: organization.id,
      },
    });

    if (!template) {
      return { errors: ['Template not found'] };
    }

    if (template.isResetting) {
      return {
        errors: ['Guide resetting already in progress'],
      };
    }

    new AuditContext({
      type: AuditType.Template,
      modelId: template.id,
      organizationId: organization.id,
      userId: user.id,
    }).logEvent({
      eventName: AuditEvent.reset,
    });

    template = await template.update({ isResetting: true });

    await queueJob({
      jobType: JobType.ResetGuides,
      resetLevel: ResetLevel.Template,
      resetObjectId: template.id,
      organizationId: template.organizationId,
    });

    return { template };
  },
});
