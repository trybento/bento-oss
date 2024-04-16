import { GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { Template } from 'src/data/models/Template.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { AuditEvent, TemplateState } from 'src/../../common/types';
import AuditContext, { AuditType } from 'src/utils/auditContext';

export default generateMutation({
  name: 'RemoveTemplates',
  description: 'Remove a list of existing templates',
  inputFields: {
    templateEntityIds: {
      type: new GraphQLList(new GraphQLNonNull(EntityId)),
    },
  },
  outputFields: {
    removedTemplateIds: {
      type: new GraphQLList(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { templateEntityIds },
    { organization, user, loaders }
  ) => {
    const templates = await Template.findAll({
      where: {
        entityId: templateEntityIds,
        organizationId: organization.id,
        archivedAt: null,
        isTemplate: false,
      },
      include: [
        {
          association: Template.associations.splitTargets,
          attributes: ['id'],
          required: false,
        },
      ],
      attributes: ['id', 'entityId'],
    });

    // Filter out templates part of split tests
    const templatesToRemove = templates.filter(
      (t) => (t.splitTargets?.length || 0) === 0
    );

    await Template.update(
      {
        state: TemplateState.removed,
        archivedAt: new Date(),
        isAutoLaunchEnabled: false,
      },
      {
        where: {
          entityId: templatesToRemove.map((t) => t.entityId),
          organizationId: organization.id,
        },
      }
    );

    for (const { id } of templatesToRemove) {
      new AuditContext({
        type: AuditType.Template,
        modelId: id,
        organizationId: organization.id,
        userId: user.id,
      }).logEvent({
        eventName: AuditEvent.removed,
      });

      await queueJob({
        jobType: JobType.RemoveTemplate,
        organizationId: organization.id,
        templateId: id,
        userId: user.id,
      });
    }

    return {
      removedTemplateIds: templatesToRemove.map(({ entityId }) =>
        toGlobalId('Template', entityId)
      ),
    };
  },
});
