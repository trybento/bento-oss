import { object } from 'superstruct';
import { Model } from 'sequelize';

import { Uuid } from 'bento-common/validation/customRules';
import {
  LaunchDiagnosticsResult,
  LaunchMethod,
  LaunchReportPayload,
} from 'bento-common/types/diagnostics';
import { GroupTargeting, RawRule } from 'bento-common/types/targeting';

import { logger } from 'src/utils/logger';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';
import { Account } from 'src/data/models/Account.model';
import { Guide } from 'src/data/models/Guide.model';
import NoAccountUserError from 'src/errors/NoAccountUserError';
import { handleIdentifyChecks } from 'src/jobsBull/jobs/handleIdentifyChecks/handleIdentifyChecks';
import { findAvailableGuidesForAccountUser } from 'src/data/loaders/Guide/availableGuidesForAccountUser.loader';
import { Template } from 'src/data/models/Template.model';
import NoContentError from 'src/errors/NoContentError';
import { getTargetingForTemplateWithAudience } from 'src/interactions/targeting/targeting.helpers';
import { clsNamespace } from 'src/utils/cls';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Event } from 'src/data/models/Analytics/Event.model';
import detachPromise from 'src/utils/detachPromise';
import {
  getFailureReason,
  getFilteredAccountUser,
  getFocusedParticipant,
} from './troubleshooter.helpers';

const LOG_RESULTS = process.env.LOG_TROUBLESHOOTING === 'true';

export const launchingDiagnosticsInput = object({
  accountUserEntityId: Uuid,
});

type LaunchDiagnosticsArgs = {
  accountUserEntityId: string;
  searchableOrgIds: number[];
};

export const runLaunchingDiagnostics = async ({
  accountUserEntityId,
  searchableOrgIds,
}: LaunchDiagnosticsArgs) => {
  const accountUser = await AccountUser.findOne({
    where: {
      entityId: accountUserEntityId,
      /**
       * SECURITY WARNING: This is needed to restrict the search to only account users
       * within orgs that are accessible by the authenticated user.
       */
      organizationId: searchableOrgIds,
    },
    include: [
      {
        model: Organization,
        required: true,
      },
      {
        model: Account.scope('notArchived'),
        required: true,
      },
    ],
  });

  if (!accountUser) {
    throw new NoAccountUserError(accountUserEntityId);
  }

  const {
    reports: { account: acLaunchReport, accountUser: auLaunchReport },
  } = await withReportsHook(() =>
    handleIdentifyChecks(
      {
        behavior: {
          checkAccounts: true,
          checkAccountUsers: true,
          accountChanged: false,
          accountUserChanged: false,
        },
        accountEntityId: accountUser.account.entityId,
        accountAttributes: accountUser.account.attributes,
        accountUserEntityId: accountUser.entityId,
        accountUserAttributes: accountUser.attributes,
        withLaunchReport: true,
      },
      logger
    )
  );

  return {
    auLaunchReport,
    acLaunchReport,
    accountUser,
    account: accountUser.account,
  };
};

export const runAvailableGuides = async ({
  accountUser,
  stripModels = true,
}: {
  accountUser: AccountUser;
  stripModels?: boolean;
}) => {
  const guides = await findAvailableGuidesForAccountUser([accountUser.id]);

  if (stripModels) {
    return guides.map((g) => g.toJSON<Omit<Guide, keyof Model>>());
  }

  return guides;
};

/**
 * Given a specific account user and template
 * Return what rules would fail this user's launching
 *
 * Also returns additional data to help fill out the display
 *   for the diagnostics UI.
 */
export const runDiagnosticsForTemplateAndUser = async ({
  accountEntityId,
  accountUserEntityId,
  templateEntityId,
  organization,
}: {
  templateEntityId: string;
  accountUserEntityId: string;
  accountEntityId: string;
  organization: Organization;
}): Promise<LaunchDiagnosticsResult> => {
  const organizationId = organization.id;

  const filterAu = await getFilteredAccountUser({
    accountEntityId,
    accountUserEntityId,
    organizationId,
  });

  if (!filterAu) throw new NoAccountUserError(accountUserEntityId);

  const template = await Template.findOne({
    where: {
      organizationId,
      entityId: templateEntityId,
    },
    attributes: ['id', 'entityId', 'isAutoLaunchEnabled', 'manuallyLaunched'],
  });

  if (!template) throw new NoContentError(templateEntityId, 'template');

  const {
    reports: { account: acLaunchReport, accountUser: auLaunchReport },
    fnResult: { account, accountUser },
  } = await withReportsHook(() =>
    runLaunchingDiagnostics({
      accountUserEntityId: filterAu.entityId,
      searchableOrgIds: [organizationId],
    })
  );

  const key = `template_${template.id}`;
  /* Filter tests by above template ID */
  const accountChecks = acLaunchReport?.checks[key];
  const accountUserChecks = auLaunchReport?.checks[key];

  const participant = await getFocusedParticipant({
    organizationId,
    templateEntityId: template.entityId,
    accountUserId: accountUser.id,
  });

  let launchMethod: LaunchMethod = LaunchMethod.auto;
  let guideBase: GuideBase | null = null;

  if (!template.isAutoLaunchEnabled) {
    /* Check for a guide base */
    guideBase = await GuideBase.findOne({
      where: {
        createdFromTemplateId: template.id,
        accountId: account.id,
      },
      attributes: ['id', 'excludeFromUserTargeting', 'state'],
    });

    launchMethod = guideBase?.excludeFromUserTargeting
      ? LaunchMethod.action
      : LaunchMethod.manual;
  }

  const guideState = participant?.guide?.state;
  const targets = await getTargetingForTemplateWithAudience(template.id);

  const failureReason = getFailureReason({
    participant,
    guideBase,
    launchMethod,
    accountUser: filterAu,
  });

  const res = {
    reports: {
      account: accountChecks,
      accountUser: accountUserChecks,
    },
    launchMethod,
    failureReason,
    guideState,
    accountAttributes: account.attributes,
    accountUserAttributes: accountUser.attributes,
    accountEntityId: account.entityId,
    accountName: account.name || account.externalId!,
    accountUserEntityId: accountUser.entityId,
    accountUserName:
      accountUser.fullName || accountUser.email || accountUser.externalId!,
    targets: targets as GroupTargeting<RawRule>,
    obsoletedAt: participant?.obsoletedAt as Date | undefined,
  };

  if (LOG_RESULTS)
    detachPromise(
      () =>
        Event.create({
          eventName: 'troubleshoot_results',
          data: {
            ...res,
            templateEntityId,
            auLaunchReport,
            acLaunchReport,
            key,
          },
          organizationEntityId: organization.entityId,
        }),
      'staging troubleshooter log'
    );

  return res;
};

type ExtractedLaunchReports = {
  [key in LaunchReportPayload['type']]?: LaunchReportPayload;
};

const clsReportKey = 'alReports';

/**
 * Use a local context in all nested launch reports, instead of
 *   writing to the database.
 */
export const withReportsHook = async <T>(cb: () => Promise<T>) =>
  clsNamespace.runAndReturn(async () => {
    const reports: ExtractedLaunchReports = existingReportCtx() ?? {};
    clsNamespace.set(clsReportKey, reports);

    const fnResult = await cb();

    return {
      reports,
      fnResult,
    };
  });

const existingReportCtx = () => clsNamespace.get(clsReportKey);

/**
 * If a context for reporting exists, store it there
 * @returns If we ended up adding a report to a context
 */
export const addLaunchReportToContext = (launchReport: LaunchReportPayload) => {
  const reports = clsNamespace.get(clsReportKey) as ExtractedLaunchReports;

  if (!reports) return false;

  logger.debug(
    `[addReport] report context detected, adding report for ${launchReport.type}`
  );

  reports[launchReport.type] = launchReport;

  return true;
};
