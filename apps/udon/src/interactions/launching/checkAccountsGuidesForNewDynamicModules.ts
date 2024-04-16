import promises from 'src/utils/promises';

import { guideBaseChanged } from 'src/data/events';
import { Account } from 'src/data/models/Account.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import appendTargetedModules from './appendTargetedModules';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

type Args = {
  account: Account;
};

/**
 * Check an account's guide bases for new dynamic modules
 */
export default async function checkAccountsGuidesForNewDynamicModules({
  account,
}: Args) {
  /* Get account's guide bases */
  const guideBases = await GuideBase.findAll({
    where: {
      accountId: account.id,
    },
    include: [{ model: GuideModuleBase, attributes: ['createdFromModuleId'] }],
  });

  /* Allow some concurrency to slow down identify less, but not put too much load */
  await promises.map(
    guideBases,
    async (guideBase) => {
      const newModules = await appendTargetedModules({
        guideBase,
        account,
        moduleCount: guideBase.guideModuleBases.length,
      });

      if (newModules.length) {
        guideBaseChanged(guideBase.entityId);

        await queueJob({
          jobType: JobType.SyncTemplateChanges,
          type: 'guideBase',
          guideBaseId: guideBase.id,
          organizationId: account.organizationId,
        });
      }
    },
    { concurrency: 3 }
  );
}
