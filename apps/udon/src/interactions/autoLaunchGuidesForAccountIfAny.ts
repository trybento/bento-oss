import { QueryDatabase, queryRunner } from 'src/data';

import { LaunchFailureReason } from 'bento-common/types/diagnostics';

import { LaunchReport } from './reporting/LaunchReport';
import { Organization } from 'src/data/models/Organization.model';
import { Account } from 'src/data/models/Account.model';
import { checkAndAutoLaunchGuideBaseFromTemplates } from './targeting/checkAndAutoLaunchGuideBaseFromTemplates';

type Args = {
  account: Account;
  launchReport?: LaunchReport;
};

export async function autoLaunchGuidesForAccountIfAny({
  account,
  launchReport,
}: Args) {
  const organization = await Organization.findOne({
    where: {
      id: account.organizationId,
    },
  });

  if (!organization) {
    throw new Error('Organization not found.');
  }

  // UPDATED LOGIC
  const autoLaunchEnabledTemplatesRows = (await queryRunner({
    sql: `--sql
        SELECT
          t.id as template_id
        FROM core.accounts a
        JOIN core.templates t
        	ON a.organization_id = t.organization_id
        LEFT JOIN core.guide_bases gb
          ON gb.created_from_template_id = t.id
            AND gb.account_id = a.id
            AND gb.state IN ('active', 'paused')
        LEFT JOIN core.auto_launch_log alog
          ON alog.template_id = t.id
          AND alog.account_id = a.id
        WHERE t.is_auto_launch_enabled IS TRUE
					AND t.archived_at IS NULL
          AND t.deleted_at IS NULL
					AND a.deleted_at IS NULL
					AND a.id = :accountId
					AND gb.id IS NULL
          AND alog.id IS NULL
      `,
    replacements: {
      accountId: account.id,
    },
    queryDatabase: QueryDatabase.primary,
  })) as { template_id: number }[];

  const templateIds = autoLaunchEnabledTemplatesRows.map(
    (row) => row.template_id
  );

  if (templateIds.length === 0) {
    launchReport?.addDataLog(LaunchFailureReason.autoLaunchedAccountGuides);
  }

  const launchedGuideBases = await checkAndAutoLaunchGuideBaseFromTemplates(
    {
      templatesAndAccounts: templateIds.map((templateId) => ({
        templateId,
        account,
      })),
      organizationId: account.organizationId,
    },
    { launchReport }
  );

  return launchedGuideBases;
}
