import { GraphQLNonNull } from 'graphql';

import ModuleType from 'src/graphql/Module/Module.graphql';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';

import duplicateModule from 'src/interactions/library/duplicateModule';
import { Module } from 'src/data/models/Module.model';

interface DuplicateModuleMutationArgs {
  entityId: string;
}

export default generateMutation({
  name: 'DuplicateModule',
  description: 'Duplicate an existing module',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    module: {
      type: ModuleType,
    },
  },
  mutateAndGetPayload: async (
    { entityId }: DuplicateModuleMutationArgs,
    { organization, user }
  ) => {
    const module = await Module.findOne({
      where: {
        entityId: entityId,
        organizationId: organization.id,
      },
    });

    if (!module) {
      throw new Error('Module not found');
    }

    const moduleCopy = await duplicateModule({
      module,
      organization,
      user,
      theme: undefined,
    });

    return { module: moduleCopy };
  },
});
