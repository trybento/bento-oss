import { Account } from 'src/data/models/Account.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Organization } from 'src/data/models/Organization.model';
import { updateManualLaunchFlagForTemplates } from './library.helpers';
import { DeleteLevel } from 'src/jobsBull/jobs/guideDeletion/helpers';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

type Args = {
  account: Account;
  organization: Organization;
};

/**
 * Clears out guide bases, updates template manual launches and queues a cleanup
 */
export default async function deleteGuideBasesForAccount({
  account,
  organization,
}: Args) {
  const manuallyLaunchedTemplateIds = (
    await GuideBase.findAll({
      where: {
        accountId: account.id,
        organizationId: organization.id,
        wasAutoLaunched: false,
      },
      attributes: ['createdFromTemplateId'],
      group: 'createdFromTemplateId',
    })
  ).flatMap((gb) =>
    gb.createdFromTemplateId ? [gb.createdFromTemplateId] : []
  );

  await GuideBase.destroy({
    where: { accountId: account.id, organizationId: organization.id },
  });

  await updateManualLaunchFlagForTemplates({
    templateIds: manuallyLaunchedTemplateIds,
  });

  await queueJob({
    jobType: JobType.DeleteGuides,
    organizationId: organization.id,
    deleteLevel: DeleteLevel.Account,
    deleteObjectId: account.id,
  });
}
