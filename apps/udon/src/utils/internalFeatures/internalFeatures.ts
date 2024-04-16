import { internalFeatureFlag } from './api';

export enum InternalFeatureFlagNames {
  processingThreads = 'enable processing threads',
  updateAccountUserData = 'enable update account user data',
  identifyLaunchReport = 'enable launch report for identify',
  mutationLaunchReport = 'enable launch report for mutations',
  workerWatchdog = 'enable worker watchdog',
  videoAlerts = 'enable video alerts',
  customersTableMaterializedView = 'enable materialized view for customers table',
  externalWebscraper = 'use external webscraper',
  cachedTemplateData = 'use cached template data',
  identifyDiagnostics = 'identify diagnostics',
  persistentAttributes = 'persistent attributes',
  identifyTransactions = 'use trx for identify checks',
  readFromReplica = 'read from replica',
  createEventMetadata = 'create event metadata',
}

/**
 * Updates account user analytics
 * Option to disable was created when servers were overwhelmed
 */
export const enableUpdateAccountUserData = internalFeatureFlag(
  InternalFeatureFlagNames.updateAccountUserData
);

/**
 * Run processing heavy methods in another thread
 * Doesn't work that well with node-ts, let's keep it off for now
 */
export const enableProcessingThreads = internalFeatureFlag(
  InternalFeatureFlagNames.processingThreads
);

/**
 * Trace whether or not we should save and log how we determine launching through identify
 * We should not have this on except for local/staging debugging
 */
export const enableLaunchReportsIdentify = internalFeatureFlag(
  InternalFeatureFlagNames.identifyLaunchReport
);

/**
 * Trace whether or not we should save and log how we determine launching through mutations
 * We should not have this on except for local/staging debugging
 */
export const enableLaunchReportsMutation = internalFeatureFlag(
  InternalFeatureFlagNames.mutationLaunchReport
);

/**
 * Refresh the workers if they haven't processed a job in a long time
 */
export const enableWorkerWatchdog = internalFeatureFlag(
  InternalFeatureFlagNames.workerWatchdog
);

/**
 * Send alerts on video links being seemingly broken
 */
export const enableVideoAlerts = internalFeatureFlag(
  InternalFeatureFlagNames.videoAlerts
);

/**
 * Enables using transactions for the handleIdentifyChecks job
 */
export const enableMaterializedViewForCustomersTable = internalFeatureFlag(
  InternalFeatureFlagNames.customersTableMaterializedView
);

/**
 * Use rolled up rows over live counting guide bases
 */
export const enableCachedTemplateData = internalFeatureFlag(
  InternalFeatureFlagNames.cachedTemplateData
);

/**
 * Repurposed to control if we use premium options on our external webscraper
 */
export const enableExternalWebscraper = internalFeatureFlag(
  InternalFeatureFlagNames.externalWebscraper
);

/**
 * Enables running diagnostic checks for attribute data types from within
 * /identify
 */
export const enableIdentifyDiagnostics = internalFeatureFlag(
  InternalFeatureFlagNames.identifyDiagnostics
);

/**
 * Always keep attributes, so if there are consecutive identify/group pings with different
 *   attributes, they won't cancel each other out if the properties aren't complete
 */
export const enablePersistentAttributes = internalFeatureFlag(
  InternalFeatureFlagNames.persistentAttributes
);

/**
 * Enables the use of transactins for identify checks jobs
 */
export const enableIdentifyTransactions = internalFeatureFlag(
  InternalFeatureFlagNames.identifyTransactions
);

/**
 * Enables forcing read queries to always use the replica db
 */
export const enableReadFromReplica = internalFeatureFlag(
  InternalFeatureFlagNames.readFromReplica
);

/**
 * Enables creating account and account user event metadata
 */
export const enableCreateEventMetadata = internalFeatureFlag(
  InternalFeatureFlagNames.createEventMetadata
);
