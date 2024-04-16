import { duplicateName } from 'bento-common/data/helpers';
import { Theme } from 'bento-common/types';

import { withTransaction } from 'src/data';
import duplicateStepPrototypes from './duplicateStepPrototypes';
import { ModuleStepPrototype } from 'src/data/models/ModuleStepPrototype.model';
import { Module } from 'src/data/models/Module.model';
import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';

type Args = {
  module: Module;
  theme: Theme | undefined;
  organization: Organization;
  user?: User;
  preserveName?: boolean;
};

export default async function duplicateModule({
  module,
  organization,
  theme,
  user,
  preserveName,
}: Args) {
  return withTransaction(async () => {
    const moduleStepPrototypes = await ModuleStepPrototype.scope([
      'withStepPrototype',
      'byOrderIndex',
    ]).findAll({ where: { moduleId: module.id } });

    const newModuleName =
      module.name || moduleStepPrototypes[0]?.stepPrototype!.name || '';
    const createdModule = await Module.create({
      name: preserveName ? newModuleName : duplicateName(newModuleName),
      description: module.description,
      isCyoa: module.isCyoa,
      createdFromFormFactor: module.createdFromFormFactor,
      organizationId: organization.id,
      createdByUserId: user?.id,
      updatedByUserId: user?.id,
    });

    await duplicateStepPrototypes({
      moduleStepPrototypes,
      theme,
      module: createdModule,
      organization,
      user,
    });

    return createdModule;
  });
}
