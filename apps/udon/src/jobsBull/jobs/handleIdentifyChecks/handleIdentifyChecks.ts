import type { Logger } from 'src/jobsBull/logger';
import * as Sentry from '@sentry/node';
import { BentoEvents, DataSource } from 'bento-common/types';
import { LaunchFailureReason } from 'bento-common/types/diagnostics';

import addCreatedAccountUserAsParticipantToExistingAccountGuides from 'src/interactions/launching/addCreatedAccountUserAsParticipantToExistingAccountGuides';
import { autoCompleteStepsMappedToEvent } from 'src/interactions/autoCompleteStepsMappedToEvent';
import { autoLaunchGuidesForAccountIfAny } from 'src/interactions/autoLaunchGuidesForAccountIfAny';
import createIndividualGuidesForCreatedAccountUser from 'src/interactions/launching/createIndividualGuidesForCreatedAccountUser';
import recordAndSetCustomAttributes, {
  Attributes,
} from 'src/interactions/recordEvents/recordAndSetCustomAttributes';
import { addUserToGuidesBasedOnTargetedAttributes } from 'src/interactions/targeting/addUserToGuidesBasedOnTargetedAttributes';
import {
  getDataSourceType,
  HandleIdentifyChecksPayload,
} from './identifyChecks.helpers';
import {
  availableGuidesChanged,
  inlineEmbedsForAccountUserChanged,
  stepAutoCompleteInteractionsChanged,
} from 'src/data/events';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';
import { enableLaunchReportsIdentify } from 'src/utils/internalFeatures/internalFeatures';
import { LaunchReport } from 'src/interactions/reporting/LaunchReport';
import detachPromise from 'src/utils/detachPromise';
import NoAccountError from 'src/errors/NoAccountError';
import NoAccountUserError from 'src/errors/NoAccountUserError';
import {
  isCacheHit,
  recordCache,
} from 'src/interactions/caching/identifyChecksCache';
import { enableDynamicModules } from 'src/utils/features';
import checkAccountsGuidesForNewDynamicModules from 'src/interactions/launching/checkAccountsGuidesForNewDynamicModules';
import { Step } from 'src/data/models/Step.model';
import { recheckAccountTargetingForExistingGuideBases } from 'src/interactions/targeting/recheckAccountTargetingForExistingGuideBases';
import { recheckAccountUserTargetingForExistingGuides } from 'src/interactions/targeting/recheckAccountUserTargetingForExistingGuides';
import { recordIdentifyCheckFinished } from 'src/interactions/embed/identifyChecks';
import { JobHandler } from 'src/jobsBull/handler';
import { HandleIdentifyChecksJob } from 'src/jobsBull/job';
import { withTransaction } from 'src/data';
import { autoCompleteStepsMappedToGuideCompletion } from 'src/interactions/autoComplete/autoCompleteStepsMappedToGuideCompletion';
import addUsersToNpsSurveysBasedOnTargeting from 'src/interactions/netPromoterScore/addUsersToNpsSurveysBasedOnTargeting';

/** Checks to run after an account is updated */
export const doAccountChecks = async ({
  organization,
  account,
  attributes,
  logger,
  source = DataSource.snippet,
  accountChanged,
  withLaunchReport = false,
  withAttributeRecording = true,
}: {
  organization: Organization;
  account: Account;
  attributes: Attributes;
  logger: Logger;
  source?: DataSource;
  accountChanged?: boolean;
  withLaunchReport?: boolean;
  withAttributeRecording?: boolean;
}) => {
  if (account.blockedAt) {
    if (!withLaunchReport) return true;

    void new LaunchReport('account', account.id, account.organizationId)
      .addDataLog(LaunchFailureReason.blocked, true)
      .write();
    return true;
  }

  let attrsChanged = false;

  // if any attribute has been set
  if (withAttributeRecording) {
    attrsChanged = await recordAndSetCustomAttributes(
      { obj: account, attributes, source },
      { logger }
    );

    if (attrsChanged) await account.reload();
  }

  const skipLaunching = await isCacheHit(
    organization,
    account,
    !!(attrsChanged || accountChanged)
  );

  // short-circuit launching logic if cache is not stale
  if (skipLaunching && !withLaunchReport) {
    logger?.debug('[handleIdentifyChecks] Skipping account guide launching');
    return true;
  }

  const useLaunchReport =
    withLaunchReport || (await enableLaunchReportsIdentify.enabled());

  const launchReport = useLaunchReport
    ? new LaunchReport('account', account.id, account.organizationId)
    : undefined;

  launchReport?.addDataLog(LaunchFailureReason.cache, skipLaunching);

  const launchedGuideBases = await autoLaunchGuidesForAccountIfAny({
    account,
    launchReport,
  });

  /** @todo fully remove - GH#10705 */
  if (attrsChanged && (await enableDynamicModules.enabled(organization))) {
    /** See if we now qualify for new modules */
    await checkAccountsGuidesForNewDynamicModules({ account });
  }

  // handles obsoleting guide bases if the targeting no longer matches
  await recheckAccountTargetingForExistingGuideBases({
    account,
    excludeGuideIds: launchedGuideBases.map((gb) => gb.id),
    launchReport,
  });

  launchReport?.write();
  // record caching
  detachPromise(async () => {
    await recordCache(organization, account);
  }, 'handleIdentifyChecks record account cache');

  return skipLaunching;
};

/** Checks to run after an accountUser is created */
export const doAccountUserChecks = async ({
  organization,
  accountUser,
  attributes,
  logger,
  source = DataSource.snippet,
  accountUserChanged,
  withLaunchReport = false,
  withAttributeRecording = true,
}: {
  organization: Organization;
  accountUser: AccountUser;
  attributes: Attributes;
  logger: Logger;
  source?: DataSource;
  accountUserChanged?: boolean;
  withLaunchReport?: boolean;
  withAttributeRecording?: boolean;
}) => {
  let attrsChanged = false;

  // if any attribute has been set
  if (withAttributeRecording) {
    attrsChanged = await recordAndSetCustomAttributes(
      { obj: accountUser, attributes, source },
      { logger }
    );

    if (attrsChanged) await accountUser.reload();
  }

  const skipLaunching = await isCacheHit(
    organization,
    accountUser,
    !!(attrsChanged || accountUserChanged)
  );

  // short-circuit launching logic if cache is not stale
  if (skipLaunching && !withLaunchReport) {
    logger?.debug(
      '[handleIdentifyChecks] Skipping account user guide launching'
    );
    return true;
  }

  const useLaunchReport =
    withLaunchReport || (await enableLaunchReportsIdentify.enabled());

  const launchReport = useLaunchReport
    ? new LaunchReport(
        'accountUser',
        accountUser.id,
        accountUser.organizationId
      )
    : undefined;

  launchReport?.addDataLog(LaunchFailureReason.cache, skipLaunching);

  const addedToAccountGuides =
    await addCreatedAccountUserAsParticipantToExistingAccountGuides(
      accountUser,
      launchReport
    );

  const newGuides = await createIndividualGuidesForCreatedAccountUser(
    accountUser,
    launchReport
  );

  const addedToUserGuides = await addUserToGuidesBasedOnTargetedAttributes(
    accountUser,
    launchReport
  );

  const addedGuides = [
    ...addedToAccountGuides,
    ...newGuides,
    ...addedToUserGuides,
  ];

  await recheckAccountUserTargetingForExistingGuides(
    accountUser,
    launchReport,
    addedGuides.map((g) => g.id)
  );

  await addUsersToNpsSurveysBasedOnTargeting({ accountUser });

  launchReport?.write();
  // record caching
  detachPromise(async () => {
    await recordCache(organization, accountUser);
  }, 'handleIdentifyChecks record accountUser cache');

  return skipLaunching;
};

/**
 * When a user logs in, check if they need to be added to any guides
 * while also handling associated auto-completes.
 */
export const handleIdentifyChecks = async (
  payload: HandleIdentifyChecksPayload,
  logger: Logger
) => {
  const {
    initId: bentoInitId,
    accountEntityId,
    accountUserEntityId,
    accountAttributes = {},
    accountUserAttributes = {},
    eventName,
    behavior: customBehavior,
    integrationType,
    withLaunchReport = false,
  } = payload;
  const behavior: HandleIdentifyChecksPayload['behavior'] = {
    checkAccounts: false,
    checkAccountUsers: false,
    recordAttributes: true,
    accountChanged: false,
    accountUserChanged: false,
    emitSocketEvents: true,
    ...customBehavior,
  };

  // Shouldn't get here, job should've not queued
  if (!accountEntityId && !accountUserEntityId) return;

  const autocompletesMatched: Step[] = [];
  let accountUser: AccountUser | null = null;
  let account: Account | null = null;
  let organization: Organization | null = null;

  /* Populate account & accountUser */
  if (accountUserEntityId) {
    accountUser = await AccountUser.findOne({
      where: {
        entityId: accountUserEntityId,
      },
      include: [
        { model: Account.scope('notArchived'), required: true },
        Organization,
      ],
    });

    if (!accountUser) throw new NoAccountUserError(accountUserEntityId);
    ({ account, organization } = accountUser);
  } else if (accountEntityId) {
    account = await Account.scope('notArchived').findOne({
      where: { entityId: accountEntityId },
      include: [Organization],
    });
    if (!account) throw new NoAccountError(accountUserEntityId);
    ({ organization } = account);
  }

  if (!account) throw new NoAccountError();
  if (!organization) throw new Error('how is there no org?');

  Sentry.setTag('organization', organization?.slug);
  Sentry.setContext('account', { id: account?.id });

  const source = getDataSourceType(integrationType);

  let cacheHit = true;

  /* Handle updating and launching */
  await withTransaction(async () => {
    if (behavior.checkAccounts) {
      const accountCacheHit = await doAccountChecks({
        organization: organization!,
        account: account!,
        attributes: accountAttributes,
        logger,
        source,
        accountChanged: behavior.accountChanged,
        withLaunchReport,
        withAttributeRecording: behavior.recordAttributes,
      });
      cacheHit = cacheHit && accountCacheHit;
    }

    if (accountUser && behavior.checkAccountUsers) {
      const accountUserCacheHit = await doAccountUserChecks({
        organization: organization!,
        accountUser,
        attributes: accountUserAttributes,
        logger,
        source,
        accountUserChanged:
          behavior.accountUserChanged || behavior.accountChanged,
        withLaunchReport,
        withAttributeRecording: behavior.recordAttributes,
      });
      cacheHit = cacheHit && accountUserCacheHit;
    }
  });

  /* Handle auto-completing */
  if (accountUser) {
    // auto-complete steps based on guide completion
    await autoCompleteStepsMappedToGuideCompletion(
      {
        account,
        accountUser,
      },
      logger
    );

    if (behavior.checkAccounts && !eventName) {
      autocompletesMatched.push(
        ...(await autoCompleteStepsMappedToEvent({
          accountUserExternalId: accountUser.externalId,
          eventName: BentoEvents.account,
          eventProperties: accountAttributes,
          organization,
          accountExternalId: account!.externalId,
        }))
      );
    }

    if (behavior.checkAccountUsers && !eventName) {
      autocompletesMatched.push(
        ...(await autoCompleteStepsMappedToEvent({
          accountUserExternalId: accountUser.externalId,
          eventName: BentoEvents.user,
          eventProperties: accountUserAttributes,
          organization,
          accountExternalId: account!.externalId,
        }))
      );
    }

    /* Track event based auto-completions */
    if (eventName) {
      if (accountUserAttributes || accountAttributes) {
        autocompletesMatched.push(
          ...(await autoCompleteStepsMappedToEvent({
            accountUserExternalId: accountUser.externalId,
            eventName,
            eventProperties: (accountUserAttributes || accountAttributes)!,
            organization,
            accountExternalId: account!.externalId,
          }))
        );
      }
    }
  }

  /**
   * WARNING: The initialization flow does not depend on subscriptions anymore,
   * but there are still expected notifications to come from identify jobs queued
   * as a result of integrations, therefore this can't yet be removed.
   */
  if (behavior.emitSocketEvents && accountUser) {
    detachPromise(async () => {
      availableGuidesChanged(accountUser!.externalId);
      inlineEmbedsForAccountUserChanged(accountUser!.externalId);
      stepAutoCompleteInteractionsChanged(accountUser!.externalId);
    }, 'handleIdentifyChecks subscription update events');
  }

  // record as finished
  await recordIdentifyCheckFinished(bentoInitId);
};

const handler: JobHandler<HandleIdentifyChecksJob> = async (job, logger) => {
  await handleIdentifyChecks(job.data, logger);
};

export default handler;
