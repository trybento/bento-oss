import { AttributeRuleArgs, TargetingType } from 'bento-common/types';
import { Module } from 'src/data/models/Module.model';
import { ModuleAutoLaunchRule } from 'src/data/models/ModuleAutoLaunchRule.model';
import { Template } from 'src/data/models/Template.model';
import { JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import { formatTargetRulesFromArgs } from './formatTargetRulesFromArgs';

export type ModuleTargetingData = {
  targetTemplate: string;
  autoLaunchRules?: {
    ruleType: TargetingType;
    rules: AttributeRuleArgs[];
  }[];
};

type Args = {
  module: Module;
  targetingData: ModuleTargetingData;
};

/**
 * Set a module's targeting and check for templates to apply it to
 * This is also called on edit because we don't have proper edit functionality with
 *   complex rule objects.
 */
export default async function setTargetingForModule({
  module,
  targetingData,
}: Args) {
  const { targetTemplate: templateEntityId, autoLaunchRules } = targetingData;

  const targetTemplate = await Template.findOne({
    where: { entityId: templateEntityId },
    attributes: ['id'],
  });

  if (!targetTemplate) throw 'Target template not found!';

  if (!autoLaunchRules) return;

  for (const autoLaunchRule of autoLaunchRules) {
    const rules = formatTargetRulesFromArgs(autoLaunchRule.rules);

    await ModuleAutoLaunchRule.create({
      moduleId: module.id,
      targetTemplateId: targetTemplate.id,
      organizationId: module.organizationId,
      state: 'active',
      rules,
    });
  }

  await queueJob({
    jobType: JobType.ApplyDynamicModules,
    templateId: targetTemplate.id,
  });
}
