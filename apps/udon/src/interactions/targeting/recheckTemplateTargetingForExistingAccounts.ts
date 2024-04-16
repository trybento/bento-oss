import promises from 'src/utils/promises';
import { GuideBaseState } from 'bento-common/types';

import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { Account } from 'src/data/models/Account.model';
import { doesAccountMatchAutoLaunchRules } from './checkAndAutoLaunchGuideBaseFromTemplates';
import { logger } from 'src/utils/logger';
import { LaunchReport } from 'src/interactions/reporting/LaunchReport';
import { enableLaunchReportsMutation } from 'src/utils/internalFeatures/internalFeatures';
import { pauseGuideBase } from '../launching/pauseGuideBase';
import { unpauseGuideBase } from '../unpauseGuideBase';
import {
  getAudiencesForOrg,
  getTargetingForTemplate,
} from './targeting.helpers';

/**
 * Re-check accounts and pause guide bases that no longer match
 * @returns Guide bases that were checked
 */
export async function recheckTemplateTargetingForExistingAccounts({
  template,
}: {
  template: Template;
}): Promise<GuideBase[]> {
  logger.debug(`recheckTargetingForExistingAccounts: ${template.id}`);

  const guideBases = await GuideBase.scope({
    method: ['fromTemplate', template.id],
  }).findAll({
    include: [{ model: Account.scope('notArchived'), required: true }],
    attributes: ['id', 'organizationId', 'state'],
    where: { wasAutoLaunched: true },
  });

  logger.debug(
    `recheckTemplateTargetingForExistingAccounts: ${template.id}, ${guideBases.length}`
  );
  if (guideBases.length === 0) {
    return [];
  }
  const groupTargeting = await getTargetingForTemplate(template.id);
  const audiences = await getAudiencesForOrg(template.organizationId);

  logger.debug(
    `recheckTemplateTargetingForExistingAccounts: ${template.id} ${
      guideBases.length
    } ${groupTargeting.account.groups?.length ?? 0}`
  );

  const useLaunchReport = await enableLaunchReportsMutation.enabled();

  const launchReport = useLaunchReport
    ? new LaunchReport('template', template.id, template.organizationId)
    : undefined;

  await promises.each(guideBases, async (guideBase) => {
    const account = guideBase.account;
    const [matches] = doesAccountMatchAutoLaunchRules({
      account,
      rules: groupTargeting.account,
      extraAttributes: {
        audiences,
      },
      onDoneChecking: (results) => {
        launchReport?.addMatchLog('account', account.id, results);
      },
    });

    if (!matches) {
      logger.debug(
        `recheckTemplateTargetingForExistingAccounts: ${template.id} ${
          guideBases.length
        } ${groupTargeting.account.groups?.length ?? 0} ${
          account.id
        } fail, pausing`
      );

      /** Pause guide base if they no longer match rules */
      await pauseGuideBase(guideBase);

      return;
    } else if (guideBase.state === GuideBaseState.paused) {
      await unpauseGuideBase(guideBase);
    }

    launchReport?.write();
  });
  return guideBases;
}
