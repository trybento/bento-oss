import { GraphQLID, GraphQLNonNull } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { GraphQLContext } from 'src/graphql/types';
import { Template } from 'src/data/models/Template.model';
import removeTemplate from 'src/interactions/library/removeTemplate';

export default generateMutation({
  name: 'RemoveTemplate',
  description: 'Remove an existing template',
  inputFields: {
    templateEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    removedTemplateId: {
      type: GraphQLID,
    },
  },
  mutateAndGetPayload: async (
    { templateEntityId },
    { organization, user }: GraphQLContext
  ) => {
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

    if (template.archivedAt && !template.isAutoLaunchEnabled) {
      return { errors: ['Template already removed'] };
    }

    await removeTemplate({ template, organization, userId: user.id });

    return { removedTemplateId: toGlobalId('Template', templateEntityId) };
  },
});
