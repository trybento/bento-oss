import { GraphQLID, GraphQLNonNull } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { Template } from 'src/data/models/Template.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { DeleteLevel } from 'src/jobsBull/jobs/guideDeletion/helpers';

export default generateMutation({
  name: 'DeleteTemplate',
  description: 'Delete an existing template',
  inputFields: {
    templateEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    deletedTemplateId: {
      type: GraphQLID,
    },
  },
  mutateAndGetPayload: async ({ templateEntityId }, { organization }) => {
    const template = await Template.findOne({
      where: {
        entityId: templateEntityId,
        organizationId: organization.id,
      },
      include: [
        {
          association: Template.associations.splitTargets,
          attributes: ['id'],
          required: false,
        },
      ],
    });

    if (!template) {
      return { errors: ['Template not found'] };
    }

    if ((template.splitTargets?.length || 0) > 0) {
      return {
        errors: [
          'Template is part of a split test. Please delete the split test first.',
        ],
      };
    }

    await template.destroy();

    await queueJob({
      jobType: JobType.DeleteGuides,
      organizationId: organization.id,
      deleteLevel: DeleteLevel.Template,
      deleteObjectId: template.id,
    });

    return { deletedTemplateId: toGlobalId('Template', templateEntityId) };
  },
});
