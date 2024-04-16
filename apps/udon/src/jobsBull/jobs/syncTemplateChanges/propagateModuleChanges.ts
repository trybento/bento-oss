import { Op } from 'sequelize';

import { withTransaction } from 'src/data';
import { Module } from 'src/data/models/Module.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import batchSyncTemplateChanges from 'src/interactions/library/batchSyncTemplateChanges';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

import { syncModuleChangesToBranchingModules } from './syncModuleChangesToBranchingModules';

type Args = {
  /**
   * Which module to sync changes from.
   */
  module: Module;
  /**
   * Which template to skip syncing changes to.
   * Useful to prevent duplicating sync jobs when editing a template, given its associated modules
   * will also queue sync jobs for each template associated with them.
   *
   * @default 0
   */
  skipTemplateId?: number;
};

/**
 * Sync changes across all templates using the given module, as well as branched instances.
 *
 * @todo solve for duplicate template sync jobs
 */
export async function propagateModuleChanges({
  module,
  skipTemplateId = 0,
}: Args) {
  return withSentrySpan(
    async () => {
      return withTransaction(async () => {
        const templateModules = await TemplateModule.findAll({
          where: {
            moduleId: module.id,
            templateId: {
              [Op.ne]: skipTemplateId,
            },
          },
          attributes: ['templateId'],
        });

        const templateIds = templateModules.map((tm) => tm.templateId);

        await batchSyncTemplateChanges({
          templateIds,
          queueName: `sync-module-${module.id}`,
          organizationId: module.organizationId,
        });

        await syncModuleChangesToBranchingModules({ module });
      });
    },
    {
      name: 'propagateModuleChanges',
      data: {
        moduleId: module.id,
        skipTemplateId,
      },
    }
  );
}
