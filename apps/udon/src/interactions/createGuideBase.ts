import { GuideBaseState } from 'bento-common/types';

import { withTransaction } from 'src/data';
import { User } from 'src/data/models/User.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { Account } from 'src/data/models/Account.model';
import { GuideData } from 'src/data/models/Analytics/GuideData.model';
import createModuleBaseFromModule from './launching/createModuleBaseFromModule';
import { enableDynamicModules } from 'src/utils/features';
import appendTargetedModules from './launching/appendTargetedModules';

type CreateGuideBaseArgs = {
  account: Account;
  templateEntityId: string;
  wasAutoLaunched?: boolean;
  user?: User;
  createdFromSplitTestId?: number;
  excludeFromUserTargeting?: boolean;
};

/**
 * Creates a pending guide base (i.e., with status = 'draft') that will wait for settings
 * to be adjusted before final launch.
 * The launch needs to happen separately for allow rules to be set as appropriate.
 */
export async function createGuideBase({
  account,
  templateEntityId,
  wasAutoLaunched,
  user,
  createdFromSplitTestId,
  excludeFromUserTargeting = false,
}: CreateGuideBaseArgs): Promise<GuideBase> {
  const organizationId = account.organizationId;
  const guideBase = (await withTransaction(async () => {
    const template = await Template.scope('withTemplateModules').findOne({
      where: { entityId: templateEntityId, organizationId },
    });

    if (!template) {
      throw new Error(`Template ${templateEntityId} not found`);
    }

    const [guideBase] = await GuideBase.upsert(
      {
        state: GuideBaseState.draft,
        wasAutoLaunched: wasAutoLaunched || false,
        accountId: account.id,
        organizationId,
        createdFromTemplateId: template.id,
        createdFromSplitTestId,
        createdByUserId: user?.id,
        updatedByUserId: user?.id,
        excludeFromUserTargeting,
      },
      {
        returning: true,
        // NOTE: sequelize is wrongly expecting model's attrs instead of sql fields
        conflictFields: ['account_id', 'created_from_template_id'] as any,
      }
    );

    for (const { module, orderIndex } of template.templateModules) {
      await createModuleBaseFromModule({ guideBase, module, orderIndex, user });
    }

    const useDynamicModules = await enableDynamicModules.enabled(
      account.organizationId
    );

    if (useDynamicModules) {
      await appendTargetedModules({
        guideBase,
        account,
        moduleCount: template.templateModules.length,
      });
    }

    await GuideData.findOrCreate({
      where: {
        organizationId: account.organizationId,
        guideBaseId: guideBase.id,
      },
    });

    await template.update({ lastUsedAt: new Date() });

    return guideBase;
  })) as GuideBase;

  return guideBase;
}
