import { GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { Template } from 'src/data/models/Template.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { DeleteLevel } from 'src/jobsBull/jobs/guideDeletion/helpers';

export default generateMutation({
  name: 'DeleteTemplates',
  description: 'Delete a list of existing templates',
  inputFields: {
    templateEntityIds: {
      type: new GraphQLList(new GraphQLNonNull(EntityId)),
    },
  },
  outputFields: {
    deletedTemplateIds: {
      type: new GraphQLList(GraphQLID),
    },
  },
  mutateAndGetPayload: async ({ templateEntityIds }, { organization }) => {
    const templates = await Template.findAll({
      where: {
        entityId: templateEntityIds,
        organizationId: organization.id,
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
    const templatesToDelete = templates.filter(
      (t) => (t.splitTargets?.length || 0) === 0
    );

    await Template.destroy({
      where: {
        entityId: templatesToDelete.map((t) => t.entityId),
        organizationId: organization.id,
      },
    });

    for (const template of templatesToDelete) {
      await queueJob({
        jobType: JobType.DeleteGuides,
        organizationId: organization.id,
        deleteLevel: DeleteLevel.Template,
        deleteObjectId: template.id,
      });
    }

    return {
      deletedTemplateIds: templatesToDelete.map(({ entityId }) =>
        toGlobalId('Template', entityId)
      ),
    };
  },
});
