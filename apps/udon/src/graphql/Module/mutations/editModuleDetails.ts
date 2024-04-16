import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import EntityId from 'bento-common/graphql/EntityId';

import ModuleType from 'src/graphql/Module/Module.graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { withTransaction } from 'src/data';
import { removeUndefined } from 'src/utils/helpers';
import { Module } from 'src/data/models/Module.model';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';

interface ModuleDetailsInput {
  entityId: string;
  name?: string;
  description?: string;
  displayTitle?: string;
}

interface EditModuleDetailsMutationArgs {
  moduleData: ModuleDetailsInput;
}

const EditModuleDetailsInputType = new GraphQLInputObjectType({
  name: 'EditModuleDetailsTemplateInput',
  fields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
    name: {
      type: GraphQLString,
    },
    /** @todo remove after D+14 */
    displayTitle: {
      type: GraphQLString,
      deprecationReason: 'Use `name` instead. This wont have any effect rn',
    },
    description: {
      type: GraphQLString,
    },
  },
});

/**
 * NOTE: Given a module can be used within multiple guides, affect too many end-users
 * and the only relevant change for them would be the "name", I've decided not to
 * trigger a "guideChanged" event just for that.
 *
 * @todo re-add "guideChanged" event in a performant way
 */
export default generateMutation({
  name: 'EditModuleDetails',
  description: 'Editing the details of an existing module',
  inputFields: {
    moduleData: {
      type: new GraphQLNonNull(EditModuleDetailsInputType),
    },
  },
  outputFields: {
    module: {
      type: ModuleType,
    },
  },
  mutateAndGetPayload: async (
    { moduleData }: EditModuleDetailsMutationArgs,
    { organization, user }
  ) => {
    const module = await Module.findOne({
      where: {
        entityId: moduleData.entityId,
        organizationId: organization.id,
      },
    });

    if (!module) return { errors: ['Module not found'] };

    await withTransaction(async () => {
      const data = {
        name: moduleData.name,
        description: moduleData.description,
        updatedByUserId: user.id,
      };

      removeUndefined(data);
      module.set(data as Module);

      if (module.changed()) {
        new AuditContext({
          type: AuditType.Module,
          modelId: module.id,
          organizationId: organization.id,
          userId: user.id,
        }).logEvent({ eventName: AuditEvent.contentChanged });
      }

      // Update module 'updatedAt' timestamp.
      module.changed('name', true);
      return module.save();
    });

    return { module };
  },
});
