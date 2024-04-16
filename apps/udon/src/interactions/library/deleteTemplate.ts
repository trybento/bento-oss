import promises from 'src/utils/promises';
import { logger } from 'src/utils/logger';
import { withTransaction } from 'src/data';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { Module } from 'src/data/models/Module.model';
import { deleteExistingInlineEmbed } from '../inlineEmbeds/deleteExistingInlineEmbeds';
import { syncTemplatePriorityRankings } from '../syncTemplatePriorityRankings';
import { Template } from 'src/data/models/Template.model';
import { Organization } from 'src/data/models/Organization.model';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { ModuleAutoLaunchRule } from 'src/data/models/ModuleAutoLaunchRule.model';
import { isSplitTestGuide } from 'bento-common/data/helpers';
import pauseSplitTestGuideBases from './pauseSplitTestGuideBases';

type Args = {
  template: Template;
  organization: Organization;
  deleteModules?: boolean;
};

export default async function deleteTemplate({
  organization,
  template,
  deleteModules,
}: Args) {
  await withTransaction(async () => {
    if (deleteModules) {
      const organizationId = organization.id;
      const modulesInTemplates = await TemplateModule.findAll({
        where: { templateId: template.id, organizationId },
      });

      const moduleIdsToDelete: number[] = [];

      await promises.map(modulesInTemplates, async ({ moduleId }) => {
        if (!moduleId) return;

        /* Delete if only this template uses the module */
        const usagesOfModule = await TemplateModule.count({
          where: { moduleId, organizationId },
        });

        /* Do not delete if module is targeted by branching */
        const branchingTargetingModule = await BranchingPath.count({
          where: { moduleId, organizationId },
        });

        /* Do not delete if module is used dynamically */
        const dynamicModuleTargets = await ModuleAutoLaunchRule.count({
          where: {
            moduleId,
            organizationId,
          },
        });

        if (
          usagesOfModule <= 1 &&
          branchingTargetingModule === 0 &&
          dynamicModuleTargets === 0
        )
          moduleIdsToDelete.push(moduleId);
      });

      if (moduleIdsToDelete.length) {
        const affected = await Module.destroy({
          where: { id: moduleIdsToDelete, organizationId },
        });

        logger.debug(
          `[deleteTemplate] deleted ${affected} modules with template`
        );
      }
    }

    if (isSplitTestGuide(template.type)) {
      await pauseSplitTestGuideBases({ splitTestTemplate: template });
    }

    await deleteExistingInlineEmbed({ template });

    await template.destroy({ force: true });

    await syncTemplatePriorityRankings({ organizationId: organization.id });
  });
}
