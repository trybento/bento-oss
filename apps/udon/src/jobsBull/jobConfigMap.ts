import { BackoffOptions } from 'bullmq';

import {
  GenerateReportCsvJob,
  Job,
  JobType,
  SyncTemplateChangesJob,
  UpdateGuideDataJob,
} from 'src/jobsBull/job';
import { RollupTypeEnum } from 'src/jobsBull/jobs/rollupTasks/rollup.constants';
import { QueueName } from './queueConfigMap';
import { INTEGRATION_FETCH_TIMEOUT } from 'src/utils/constants';

export interface JobConfig<J> {
  /**
   * The queue to which jobs of this type should be added. Will default to the
   * general background queue if not specified.
   */
  queueName?: QueueName;

  /**
   * Time in milliseconds before a soft timeout warning is raised for a job.
   * If not specified, no warning is raised.
   */
  softTimeoutMs?: number;

  /**
   * Whether to disable (true) transactions in the job scope or not (falsely). By default,
   * transactions are allowed.
   */
  disableTrx?: boolean;

  /**
   * The maximum number of attempts for the job.
   * @default 1
   */
  attempts?: number;

  /**
   * The total time in milliseconds to keep failed jobs in Redis for. If not set,
   * the job will automatically be removed on failure.
   *
   * WARNING: this should not be used for jobs which override the default job key,
   * as BullMQ counts failed jobs when determining uniqueness!
   */
  keepFailuresForMs?: number;

  /**
   * The total time in milliseconds to keep completed jobs in Redis for. If not set,
   * the job will automatically be removed on completion. In general, this should NOT
   * be set in order to keep memory usage down in Redis.
   *
   * WARNING: this should not be used for jobs which override the default job key,
   * as BullMQ counts completed jobs when determining uniqueness!
   */
  keepCompleteForMs?: number;

  /**
   * Retrieves a custom job ID to use when queuing the job. If omitted, BullMQ will
   * automatically generate a unique ID for the job.
   *
   * WARNING: this may result in jobs being dropped if there are multiple active
   * jobs in the queue with the same job ID. Be sure to carefully consider this
   * alongside settings like `keepFailuresForMs`, as well as recursive jobs (e.g.,
   * queuing sub-jobs per organization).
   */
  jobIdGetter?: (job: J) => Promise<string | undefined> | string | undefined;

  /**
   * Retrieves a group key to use when queueing the job. If omitted, the job will not
   * be queued in any group.
   */
  groupIdGetter?: (
    jobData: J
  ) => Promise<string | undefined> | string | undefined;

  /**
   * Determines the backoff strategy for failures. If this is omitted, jobs will be
   * retried immediately.
   *
   * See https://docs.bullmq.io/guide/retrying-failing-jobs for configuration options.
   */
  backoff?: BackoffOptions;
}

type JobConfigMap = {
  [T in JobType]: Job extends infer U
    ? U extends { jobType: JobType }
      ? T extends U['jobType']
        ? JobConfig<{ [K in keyof U]: U[K] }>
        : never
      : never
    : never;
};

export const jobConfigMap: JobConfigMap = {
  [JobType.ManageNpsSurveys]: {
    attempts: 3,
    keepFailuresForMs: 60 * 60 * 48 * 1000, // 48h
  },
  [JobType.HandleIdentifyChecks]: {
    queueName: QueueName.GeneralPriority,
    softTimeoutMs: 2 * 1000, // 2s,
    attempts: 10,
    groupIdGetter: (job) =>
      `identify-${job.accountUserEntityId || job.accountEntityId}`,
  },
  [JobType.HandleEventHook]: {
    softTimeoutMs: INTEGRATION_FETCH_TIMEOUT + 1000,
  },
  [JobType.AutoCompleteStepOnGuideCompletion]: {
    attempts: 3,
  },
  [JobType.RunGuideRollups]: {
    queueName: QueueName.Analytics,
    softTimeoutMs: 4 * 60 * 1000, // 4min
    groupIdGetter: (job) =>
      job.rollupType === RollupTypeEnum.GuideDailyRollups
        ? 'rollup_guide_daily'
        : 'rollup_guide',
  },
  [JobType.RunDataUsageCache]: {
    groupIdGetter: (job) => {
      if (job.organizationId) {
        return `data_usage_${job.organizationId}`;
      }

      return 'data_usage';
    },
  },
  [JobType.RunAnalyticsRollups]: {
    queueName: QueueName.Analytics,
    groupIdGetter: () => 'rollup_analytics',
    softTimeoutMs: 4 * 60 * 1000, // 4min
  },
  [JobType.QueueRollup]: {
    queueName: QueueName.Analytics,
    groupIdGetter: (job) => {
      if (job.rollupType === RollupTypeEnum.AnalyticRollups) {
        return 'queue_rollup_analytics';
      }

      if (job.rollupType === RollupTypeEnum.GuideRollups) {
        return 'queue_rollup_guide';
      }

      if (job.rollupType === RollupTypeEnum.GuideDailyRollups) {
        return 'queue_rollup_guide_daily';
      }

      return 'queue_rollup';
    },
  },
  [JobType.ExpireGuides]: {
    attempts: 3,
    softTimeoutMs: 60 * 1000, // 60s
    groupIdGetter: () => `expire-guides`,
  },
  [JobType.TemplateExpirationChanged]: {
    attempts: 3,
    softTimeoutMs: 60 * 1000, // 60s
    groupIdGetter: (job) => `template-expiration-changed-${job.templateId}`,
  },
  [JobType.DeleteNpsSurvey]: {
    groupIdGetter: (job) => `delete_nps_survey_${job.organizationId}`,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 10_000, // 10s, 20s, 40s
    },
  },
  [JobType.DeleteObjects]: {
    groupIdGetter: (job) => `delete-objects-${job.organizationId}`,
  },
  [JobType.UpdateGuideData]: {
    queueName: QueueName.Analytics,
    /**
     * If we have guide base IDs, then run sequentially
     */
    groupIdGetter: (job: UpdateGuideDataJob) =>
      job.guideBaseIds ? `update_guide_data` : undefined,
  },
  [JobType.GenerateReportCsv]: {
    groupIdGetter: (job: GenerateReportCsvJob) =>
      `generate-report-${job.organizationEntityId}`,
  },
  [JobType.CaptureTemplateAnalytics]: {
    queueName: QueueName.Analytics,
  },
  [JobType.UpdateStepData]: {
    queueName: QueueName.Analytics,
  },
  [JobType.UpdateAnnouncementData]: {
    queueName: QueueName.Analytics,
  },
  [JobType.UpdateAccountUserData]: {
    queueName: QueueName.Analytics,
    softTimeoutMs: 30 * 1000, // 30 seconds
  },
  [JobType.ResetGuides]: {},
  [JobType.ResetGuidesForGuideBases]: {
    groupIdGetter: (job) => `reset-guides-${job.organizationId}`,
  },
  [JobType.DeleteGuides]: {
    groupIdGetter: (job) => `delete-guides-${job.organizationId}`,
  },
  [JobType.RemoveTemplate]: {
    groupIdGetter: (job) => `archive-template-${job.organizationId}`,
  },
  /**
   * Perform sync template changes for a given template, guide base, or module.
   *
   * @todo consider throttling duplicate propagation jobs
   * @see https://docs.bullmq.io/patterns/throttle-jobs
   */
  [JobType.SyncTemplateChanges]: {
    queueName: QueueName.Propagation,
    /**
     * Regardless of which type of job this is, we wanna group them by organization so
     * that we can better control the concurrency of these jobs on a per Org basis.
     *
     * This is important to not overload the DB with too many sync jobs at any given
     * time.
     */
    groupIdGetter: (job: SyncTemplateChangesJob) => {
      return `sync-template-changes-${job.organizationId}`;
    },
  },
  [JobType.SyncStepPrototypeCtas]: {
    queueName: QueueName.Propagation,
    groupIdGetter: (job) => `sync-step-prototype-ctas-${job.organizationId}`,
  },
  [JobType.SyncStepPrototypeInputs]: {
    queueName: QueueName.Propagation,
    groupIdGetter: (job) => `sync-step-prototype-inputs-${job.organizationId}`,
  },
  [JobType.SendEmail]: {},
  [JobType.SendGuideViewedEmail]: {
    softTimeoutMs: 5 * 1000, // 5s
    jobIdGetter: (job) =>
      `guide-viewed-email-${job.guideEntityId}-${job.accountUserEntityId}`,
  },
  [JobType.SendForgotPasswordLinkEmail]: {
    queueName: QueueName.GeneralPriority,
    softTimeoutMs: 5 * 1000, // 5s
  },
  [JobType.SendEmailVerificationEmail]: {
    queueName: QueueName.GeneralPriority,
    softTimeoutMs: 5 * 1000, // 5s
  },
  [JobType.SendEndUserNudgeSingle]: {},
  [JobType.SendEndUserNudgeWithTemplate]: {},
  [JobType.SendEndUserNudgeBatch]: {},
  [JobType.ApplyAudienceRulesToTemplate]: {
    keepFailuresForMs: 60 * 60 * 24 * 1000, //12h
    attempts: 3,
  },
  [JobType.HandleStepCompletedNotifications]: {
    groupIdGetter: (job) =>
      `step-completed-${job.stepEntityId}-${
        job.completedByAccountUserId || job.completedByUserId
      }}`,
  },
  [JobType.SendBatchedStepNotification]: {
    groupIdGetter: (job) => `step-notification-${job.recipientEntityId}`,
  },
  [JobType.RecheckTemplateTargeting]: {},
  [JobType.SyncStepProgress]: {},
  [JobType.PreCompleteSteps]: {},
  [JobType.UpdateChangedBranchGuideAudience]: {
    groupIdGetter: (job) =>
      `update-changed-branch-guide-audience-${job.accountUserId}`,
  },
  [JobType.SendBatchedAlerts]: {},
  [JobType.WeeklyCleanup]: {
    softTimeoutMs: 4 * 60 * 1000, // 4min
  },
  [JobType.DetachedGuideBaseCleanup]: {},
  [JobType.ProcessQueuedCleanups]: {
    softTimeoutMs: 2 * 60 * 1000, // 2min
  },
  [JobType.DeleteExtensionData]: {},
  [JobType.ApplyDynamicModules]: {},
  [JobType.DeleteOrganization]: {
    softTimeoutMs: 4 * 60 * 1000, //4min
  },
  [JobType.ManageOrgs]: {},
  [JobType.SetupNewOrg]: {},
  [JobType.CleanupScheduledGuide]: {},
  [JobType.PrelaunchScheduledGuide]: {},
  [JobType.UpdateScheduledGuides]: {},
};
