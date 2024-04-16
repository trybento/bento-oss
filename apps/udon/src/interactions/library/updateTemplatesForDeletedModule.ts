import { uniq } from 'lodash';

import { Module } from 'src/data/models/Module.model';
import { Organization } from 'src/data/models/Organization.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import batchSyncTemplateChanges from './batchSyncTemplateChanges';

type Args = {
  module: Module;
  organization: Organization;
};

export default async function updateTemplatesForDeletedModule({
  module,
  organization,
}: Args) {
  const templateModules = await TemplateModule.findAll({
    where: {
      moduleId: module.id,
      organizationId: organization.id,
    },
    attributes: ['templateId'],
  });

  if (!templateModules.length) return [];

  const templateIds = uniq(templateModules.map((tm) => tm.templateId));

  await batchSyncTemplateChanges({
    templateIds,
    queueName: `sync-module-${module.id}`,
    organizationId: organization.id,
  });

  return templateIds;
}
