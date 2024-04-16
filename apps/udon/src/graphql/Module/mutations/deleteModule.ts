import { GraphQLID, GraphQLNonNull } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';

import { removeBranchingChoices } from 'src/interactions/branching/removeBranchingChoices';
import updateTemplatesForDeletedModule from 'src/interactions/library/updateTemplatesForDeletedModule';
import { updateAffectedTemplates } from './moduleMutations.helpers';
import AuditContext, { AuditType } from 'src/utils/auditContext';
import detachPromise from 'src/utils/detachPromise';
import { Module } from 'src/data/models/Module.model';

export default generateMutation({
  name: 'DeleteModule',
  description: 'Delete an existing module',
  inputFields: {
    moduleEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    deletedModuleId: {
      type: GraphQLID,
    },
  },
  mutateAndGetPayload: async ({ moduleEntityId }, { organization, user }) => {
    const module = await Module.findOne({
      where: {
        entityId: moduleEntityId,
        organizationId: organization.id,
      },
    });

    if (!module) return { errors: ['Module not found'] };

    await removeBranchingChoices({
      moduleId: module.id,
      organization,
    });
    const templateIds = await updateTemplatesForDeletedModule({
      module,
      organization,
    });

    if (templateIds.length) {
      detachPromise(
        () =>
          updateAffectedTemplates({
            module,
            templateIds,
            auditContext: new AuditContext({
              type: AuditType.Module,
              modelId: module.id,
              organizationId: organization.id,
              userId: user.id,
            }),
            isDelete: true,
          }),
        'updated affected templates'
      );
    }

    await module.destroy();

    return { deletedmoduleId: toGlobalId('Module', moduleEntityId) };
  },
});
