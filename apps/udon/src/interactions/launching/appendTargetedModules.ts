import { SelectedModelAttrs } from 'bento-common/types';

import promises from 'src/utils/promises';
import { Account } from 'src/data/models/Account.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { Module } from 'src/data/models/Module.model';
import { ModuleAutoLaunchRule } from 'src/data/models/ModuleAutoLaunchRule.model';
import { TriggeredDynamicModule } from 'src/data/models/TriggeredDynamicModule.model';
import { checkAttributeRulesMatch } from 'src/interactions/targeting/checkAttributeRulesMatch';
import createModuleBaseFromModule from './createModuleBaseFromModule';

type Args = {
  guideBase: SelectedModelAttrs<
    GuideBase,
    'id' | 'organizationId' | 'createdFromTemplateId'
  >;
  moduleCount: number;
  account?: Account;
};

/**
 * Append any dynamic step groups that may go to the guideBase
 */
export default async function appendTargetedModules({
  guideBase,
  account: loadedAccount,
  moduleCount,
}: Args) {
  const account = loadedAccount
    ? loadedAccount
    : await guideBase.$get('account');
  const added: GuideModuleBase[] = [];

  const targetTemplateId = guideBase.createdFromTemplateId;

  /* Not enough info to perform the lookup */
  if (!targetTemplateId || !account?.attributes) return added;

  const moduleCandidates = await ModuleAutoLaunchRule.findAll({
    where: {
      targetTemplateId,
      organizationId: guideBase.organizationId,
    },
    include: [{ model: Module }],
  });

  if (moduleCandidates.length === 0) return added;

  /** Track what not to add */
  const addedModuleIds = new Set<number>();

  /** Add current modules to blocklist */
  (guideBase.guideModuleBases
    ? guideBase.guideModuleBases
    : await guideBase.$get('guideModuleBases', {
        attributes: ['createdFromModuleId'],
      })
  ).forEach(
    (gmb) =>
      gmb.createdFromModuleId && addedModuleIds.add(gmb.createdFromModuleId)
  );

  await promises.map(moduleCandidates, async (moduleAutolaunchRule, idx) => {
    if (
      !moduleAutolaunchRule.module ||
      addedModuleIds.has(moduleAutolaunchRule.moduleId)
    )
      return;

    const match = checkAttributeRulesMatch({
      rules: moduleAutolaunchRule.rules,
      input: account,
    });

    if (!match) return;

    const orderIndex = moduleCount + idx;

    const { guideModuleBase: createdGuideModuleBase } =
      await createModuleBaseFromModule({
        orderIndex,
        guideBase,
        module: moduleAutolaunchRule.module,
        addedDynamically: true,
      });

    added.push(createdGuideModuleBase);

    if (createdGuideModuleBase) {
      await TriggeredDynamicModule.create({
        organizationId: account.organizationId,
        moduleAutoLaunchRuleId: moduleAutolaunchRule.id,
        createdGuideModuleBaseId: createdGuideModuleBase.id,
      });

      addedModuleIds.add(moduleAutolaunchRule.moduleId);
    }
  });

  return added;
}
