import { queryRunner } from 'src/data';
import { enableLaunchReportsIdentify } from 'src/utils/internalFeatures/internalFeatures';
import { LaunchReport } from 'src/interactions/reporting/LaunchReport';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import addCreatedAccountUserAsParticipantToExistingAccountGuides from 'src/interactions/launching/addCreatedAccountUserAsParticipantToExistingAccountGuides';
import createIndividualGuidesForCreatedAccountUser from 'src/interactions/launching/createIndividualGuidesForCreatedAccountUser';
import { addUserToGuidesBasedOnTargetedAttributes } from 'src/interactions/targeting/addUserToGuidesBasedOnTargetedAttributes';
import { availableGuidesChanged } from 'src/data/events';
import { checkAndAutoLaunchGuideBaseFromTemplates } from 'src/interactions/targeting/checkAndAutoLaunchGuideBaseFromTemplates';
import { AttributeRule } from 'src/interactions/targeting/types';
import { JobHandler } from 'src/jobsBull/handler';
import { UpdateChangedBranchGuideAudienceJob } from 'src/jobsBull/job';
import { UpdateChangedBranchGuideAudienceArgs } from './helpers';
import { Logger } from 'src/jobsBull/logger';

/**
 * Autolaunch templates that are based on a branching choice
 *   This behavior mimics branching to a guide but with the ability to handle
 *   more than just the targeted branching path guide.
 */
export const updateChangedBranchGuideAudience = async (
  { accountId, accountUserId }: UpdateChangedBranchGuideAudienceArgs,
  logger: Logger
): Promise<void> => {
  const account = await Account.findByPk(accountId);
  if (!account) {
    logger.warn(`Account ${accountId} not found`);
    return;
  }
  const accountUser = await AccountUser.findByPk(accountUserId);
  if (!accountUser) {
    logger.warn(`AccountUser ${accountUserId} not found`);
    return;
  }

  type Row = {
    template_id: number;
    all_rules: AttributeRule[][];
  };
  const templateRules = (await queryRunner({
    sql: `--sql
        SELECT
          templates.id AS template_id,
          json_agg(talr.rules) AS all_rules
        FROM core.accounts
        JOIN core.templates
          ON accounts.organization_id = templates.organization_id
        JOIN core.template_auto_launch_rules AS talr
          ON talr.template_id = templates.id
        LEFT JOIN core.guide_bases
          ON guide_bases.created_from_template_id = templates.id
            AND guide_bases.account_id = accounts.id
            AND guide_bases.state IN ('active', 'paused')
        WHERE
          accounts.deleted_at IS NULL
          AND accounts.id = :accountId
          AND templates.is_auto_launch_enabled
          AND talr.rule_type = 'attribute_rules'
          AND guide_bases.id IS NULL
        GROUP BY templates.id
      `,
    replacements: {
      accountId,
    },
  })) as Row[];

  // Find just the templates that could be launched now due to a branching selection.
  const templateIdsToLaunch = templateRules
    .filter(({ all_rules }) =>
      all_rules.some((rules) =>
        rules.some((r) => r.attribute === 'branchingPath')
      )
    )
    .map(({ template_id }) => template_id);

  if (!templateIdsToLaunch.length) {
    return;
  }

  const useLaunchReport = await enableLaunchReportsIdentify.enabled();

  const launchReport = useLaunchReport
    ? new LaunchReport('account', account.id, account.organizationId)
    : undefined;

  await checkAndAutoLaunchGuideBaseFromTemplates(
    {
      templatesAndAccounts: templateIdsToLaunch.map((templateId) => ({
        templateId,
        account,
      })),
      organizationId: account.organizationId,
    },
    { launchReport }
  );

  await addCreatedAccountUserAsParticipantToExistingAccountGuides(
    accountUser,
    launchReport
  );

  await createIndividualGuidesForCreatedAccountUser(accountUser, launchReport);

  await addUserToGuidesBasedOnTargetedAttributes(accountUser, launchReport);

  launchReport?.write();

  if (accountUser.externalId) {
    availableGuidesChanged(accountUser.externalId);
  }
};

const handler: JobHandler<UpdateChangedBranchGuideAudienceJob> = async (
  job,
  logger
) => {
  await updateChangedBranchGuideAudience(job.data, logger);
};

export default handler;
