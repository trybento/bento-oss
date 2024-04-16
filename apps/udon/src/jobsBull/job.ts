import { GroupTargeting } from 'bento-common/types/targeting';
import { HandleIdentifyChecksPayload } from 'src/jobsBull/jobs/handleIdentifyChecks/identifyChecks.helpers';
import { EventHookJobPayload } from 'src/jobsBull/jobs/integrations/integrations.helpers';
import { AutoCompleteStepOnGuideCompletionArgs } from 'src/interactions/autoComplete/autoCompleteStepsOnGuideCompletion';
import { RollupTypeEnum } from 'src/jobsBull/jobs/rollupTasks/rollup.constants';
import { RollupQueryPayload } from './jobs/rollupTasks/rollup.helpers';
import { ResetLevel } from './jobs/guideReset/helpers';
import { DeleteLevel, DeleteStage } from './jobs/guideDeletion/helpers';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { DiagnosePayloadOption } from 'src/jobsBull/workerBull.helpers';
import { DeleteObjectType } from './jobs/cleanup/deleteObjects';
import { EndUserNudgePayload } from './jobs/sendEndUserNudges/helpers';
import { QueueCompletedNotificationPayload } from './jobs/notifications/types';
import { UpdateChangedBranchGuideAudienceArgs } from './jobs/updateChangedBranchGuideAudience/helpers';
import { WeeklyCleanupPayload } from './jobs/cleanup/helpers';
import { QueuedCleanupPayload } from 'src/data/models/Utility/QueuedCleanup.model';
import { AdminRequestMessage } from 'bento-common/types';
import { TemplatesAndOrgsList } from './jobs/guideScheduling/helpers';
import { AttributeRule } from 'src/interactions/targeting/types';

export enum JobType {
  HandleIdentifyChecks = 'handleIdentifyChecks',
  HandleEventHook = 'handleEventHook',
  AutoCompleteStepOnGuideCompletion = 'autoCompleteStepOnGuideCompletion',
  RunGuideRollups = 'runGuideRollups',
  RunAnalyticsRollups = 'runAnalyticsRollups',
  QueueRollup = 'queueRollup',
  RunDataUsageCache = 'runDataUsageCache',
  ExpireGuides = 'expireGuides',
  DeleteObjects = 'deleteObjects',
  TemplateExpirationChanged = 'templateExpirationChanged',
  ManageNpsSurveys = 'manageNpsSurveys',
  DeleteNpsSurvey = 'deleteNpsSurvey',
  UpdateGuideData = 'updateGuideData',
  GenerateReportCsv = 'generateReportCsv',
  CaptureTemplateAnalytics = 'captureTemplateAnalytics',
  UpdateStepData = 'updateStepData',
  UpdateAnnouncementData = 'updateAnnouncementData',
  UpdateAccountUserData = 'updateAccountUserData',
  ResetGuides = 'resetGuides',
  ResetGuidesForGuideBases = 'resetGuidesForGuideBases',
  DeleteGuides = 'deleteGuides',
  RemoveTemplate = 'removeTemplate',
  SyncStepPrototypeInputs = 'syncStepPrototypeInputs',
  SyncStepPrototypeCtas = 'syncStepPrototypeCtas',
  SyncTemplateChanges = 'syncTemplateChanges',
  SendEmail = 'sendEmail',
  SendGuideViewedEmail = 'sendGuideViewedEmail',
  SendForgotPasswordLinkEmail = 'sendForgotPasswordLinkEmail',
  SendEmailVerificationEmail = 'sendEmailVerificationEmail',
  SendEndUserNudgeSingle = 'sendEndUserNudgeSingle',
  SendEndUserNudgeWithTemplate = 'sendEndUserNudgeWithTemplate',
  SendEndUserNudgeBatch = 'sendEndUserNudgeBatch',
  HandleStepCompletedNotifications = 'handleStepCompletedNotifications',
  ApplyAudienceRulesToTemplate = 'applyAudienceRulesToTemplate',
  SendBatchedStepNotification = 'sendBatchedStepNotifications',
  RecheckTemplateTargeting = 'recheckTemplateTargeting',
  SyncStepProgress = 'syncStepProgress',
  PreCompleteSteps = 'preCompleteSteps',
  UpdateChangedBranchGuideAudience = 'updateChangedBranchGuideAudience',
  SendBatchedAlerts = 'sendBatchedAlerts',
  WeeklyCleanup = 'weeklyCleanup',
  DetachedGuideBaseCleanup = 'detachedGuideBaseCleanup',
  ProcessQueuedCleanups = 'processQueuedCleanups',
  DeleteExtensionData = 'deleteExtensionData',
  ApplyDynamicModules = 'applyDynamicModules',
  ManageOrgs = 'manageOrgs',
  SetupNewOrg = 'setupNewOrg',
  DeleteOrganization = 'deleteOrganization',
  UpdateScheduledGuides = 'updateScheduledGuides',
  PrelaunchScheduledGuide = 'prelaunchScheduledGuide',
  CleanupScheduledGuide = 'pauseScheduledGuide',
}

export type ApplyAudienceRulesToTemplatesJob = {
  jobType: JobType.ApplyAudienceRulesToTemplate;
  targeting: GroupTargeting<AttributeRule>;
  userId?: number;
  templateIds: number[];
  /** Deletes this audience if given when done processing */
  deleteAudienceId?: number;
};

export type DeleteObjectsJob = {
  jobType: JobType.DeleteObjects;
  type: DeleteObjectType;
  organizationId: number;
  objectIds: number[];
};

export type ManageNpsSurveysJob = {
  jobType: JobType.ManageNpsSurveys;
};

export type HandleIdentifyChecksJob = HandleIdentifyChecksPayload & {
  jobType: JobType.HandleIdentifyChecks;
};

export type HandleEventHookJob = EventHookJobPayload & {
  jobType: JobType.HandleEventHook;
};

export type AutoCompleteStepOnGuideCompletionJob =
  AutoCompleteStepOnGuideCompletionArgs & {
    jobType: JobType.AutoCompleteStepOnGuideCompletion;
  };

export type RunGuideRollupsJob = RollupQueryPayload & {
  jobType: JobType.RunGuideRollups;
  rollupType: RollupTypeEnum;
};

export type RunAnalyticsRollupsJob = RollupQueryPayload & {
  jobType: JobType.RunAnalyticsRollups;
};

export type QueueRollupJob = {
  jobType: JobType.QueueRollup;
  rollupType: RollupTypeEnum;
};

export type RunDataUsageCacheJob = {
  jobType: JobType.RunDataUsageCache;
  organizationId?: number;
  offset?: number;
};

export type ExpireGuidesJob = {
  jobType: JobType.ExpireGuides;
};

export type TemplateExpirationChangedJob = {
  jobType: JobType.TemplateExpirationChanged;
  /** Template id from which guides need to be updated */
  templateId: number;
  /** Last guide id updated, when handling chunks */
  lastGuideId?: number;
};

export type DeleteNpsSurveyJob = {
  jobType: JobType.DeleteNpsSurvey;
  organizationId: number;
  npsSurveyId: number;
};

export type UpdateGuideDataJob = {
  jobType: JobType.UpdateGuideData;
  /** Targeting a specific subset */
  templateId?: number;
  accountId?: number;
  guideBaseId?: number;
  organizationId?: number;
  /** Needs to be lookback format in minutes: eg. last 5 minutes */
  date?: string;
  lookback?: string;
  /** Delete old guide data before adding */
  recreate?: boolean;
  /** Close off guide data with template data */
  aggregateTemplates?: boolean;
  /** Used for chunking */
  offset?: number;
  isLastJob?: boolean;
} & (
  | { guideBaseIds: number[]; isLastJob: boolean }
  | { guideBaseIds?: never; isLastJob?: never }
);

export type GenerateReportCsvJob = AdminRequestMessage & {
  jobType: JobType.GenerateReportCsv;
  requesterEmail: string;
  filename: string;
};

export type CaptureTemplateAnalyticsJob = {
  jobType: JobType.CaptureTemplateAnalytics;
  templateIds: number[];
};

export type UpdateStepDataJob = {
  jobType: JobType.UpdateStepData;
  stepPrototypeIds?: number[];
  organizationId?: number;

  /** Needs to be lookback format in minutes: eg. last 5 minutes */
  date?: string;
  lookback?: string;
};

export type UpdateAnnouncementDataJob = {
  jobType: JobType.UpdateAnnouncementData;
  date: string;
  lookback?: string;
  trim?: boolean;
  templateIds?: number[];
};

export type UpdateAccountUserDataJob = {
  jobType: JobType.UpdateAccountUserData;
  accountUserEntityIds: string[];
};

export type ResetGuidesJob = {
  jobType: JobType.ResetGuides;
  organizationId: number;
  resetLevel: ResetLevel;
  resetObjectId: number;

  /**
   * Fields set by the job itself to control recursive calls
   */
  _internal?: {
    maximumGuideBaseId?: number;
    lastGuideBaseId?: number;
  };
};

export type ResetGuidesForGuideBasesJob = {
  jobType: JobType.ResetGuidesForGuideBases;
  organizationId: number;
  guideBases: { guideBaseId: number; branched: boolean }[];
  isLastJob: boolean;

  /**
   * Will be copied over from the ResetGuides job
   */
  resetLevel?: ResetLevel;
  resetObjectId?: number;

  /**
   * Fields set by the job itself to control recursive calls
   */
  _internal?: {
    maximumGuideId?: number;
    lastGuideId?: number;
  };
};

export type DeleteGuidesJob = {
  jobType: JobType.DeleteGuides;
  organizationId: number;
  deleteLevel: DeleteLevel;
  deleteObjectId: number;
  _internal?: {
    stage: DeleteStage;
  };
};

export type RemoveTemplateJob = {
  jobType: JobType.RemoveTemplate;
  organizationId: number;
  templateId: number;
  userId: number;
};

export type SyncStepPrototypeInputsJob = {
  jobType: JobType.SyncStepPrototypeInputs;
  /** Organization id */
  organizationId: number;
  /** Step Prototype id */
  stepPrototypeId: number;
  /** List of updated Input Step Prototype ids */
  updated: number[];
  /** List of created Input Step Prototype ids */
  created: number[];
};

export type SyncStepPrototypeCtasJob = DiagnosePayloadOption & {
  jobType: JobType.SyncStepPrototypeCtas;
  organizationId: number;
  stepPrototypeId: number;
  guideStepBaseIds?: number[];
};

export type SyncTemplateChangesJob = {
  jobType: JobType.SyncTemplateChanges;
  organizationId: number;
} & (
  | {
      type: 'template';
      templateId: number;
      /** For sub-batching chunks of guide bases to sync to */
      lastGuideBaseId?: number;
    }
  | {
      type: 'module';
      moduleId: number;
      skipTemplateId?: number;
    }
  | {
      type: 'guideBase';
      guideBaseId: number;
      /** Allow for guide base jobs to queue themselves based on this key */
      continue?: keyof GuideBase;
      /** Prevent 'continue' types from exceeding a certain number of sub-queues */
      remaining?: number;
      /** For sub-batching chunks of guides to sync to */
      lastGuideId?: number;
    }
);

export type SendEmailJob = {
  jobType: JobType.SendEmail;
  to: string | { name: string; email: string };
  from?: string | { name: string; email: string };
  subject: string;
  text: string;
  html: string;
  asm?: {
    groupId: number;
    groupsToDisplay: number[];
  };
};

export type SendGuideViewedEmailJob = {
  jobType: JobType.SendGuideViewedEmail;
  guideEntityId: string;
  accountUserEntityId: string;
};

export type SendForgotPasswordLinkEmailJob = {
  jobType: JobType.SendForgotPasswordLinkEmail;
  email: string;
  originRequestId?: string;
};

export type SendEmailVerificationEmailJob = {
  jobType: JobType.SendEmailVerificationEmail;
  email: string;
};

export type SendEndUserNudgeSingleJob = {
  jobType: JobType.SendEndUserNudgeSingle;
} & EndUserNudgePayload;

export type SendEndUserNudgeWithTemplateJob = {
  jobType: JobType.SendEndUserNudgeWithTemplate;
} & EndUserNudgePayload;

export type SendEndUserNudgeBatchJob = {
  jobType: JobType.SendEndUserNudgeBatch;
};

export type HandleStepCompletedNotificationsJob = {
  jobType: JobType.HandleStepCompletedNotifications;
} & QueueCompletedNotificationPayload;

export type SendBatchedStepNotificationJob = {
  jobType: JobType.SendBatchedStepNotification;
  recipientEmail: string;
  recipientEntityId: string;
};

export type RecheckTemplateTargetingJob = {
  jobType: JobType.RecheckTemplateTargeting;
  templateId: number;
  organizationId: number;
};

export type SyncStepProgressJob = {
  jobType: JobType.SyncStepProgress;
  stepId: number;
  accountUserId?: number;
  userId?: number;
};

export type PreCompleteStepsJob = {
  jobType: JobType.PreCompleteSteps;
  guideId: number;
  accountUserId: number;
};

export type UpdateChangedBranchGuideAudienceJob = {
  jobType: JobType.UpdateChangedBranchGuideAudience;
} & UpdateChangedBranchGuideAudienceArgs;

export type SendBatchedAlertsJob = {
  jobType: JobType.SendBatchedAlerts;
};

export type WeeklyCleanupJob = {
  jobType: JobType.WeeklyCleanup;
} & WeeklyCleanupPayload;

export type DetachedGuideBaseCleanupJob = {
  jobType: JobType.DetachedGuideBaseCleanup;
  batchSize?: number;
};

export type ProcessQueuedCleanupsJob = {
  jobType: JobType.ProcessQueuedCleanups;
} & QueuedCleanupPayload;

export type DeleteExtensionDataJob = {
  jobType: JobType.DeleteExtensionData;
  organizationId: number;
  cutoffMinutes?: number;
};

export type ApplyDynamicModulesJob = {
  jobType: JobType.ApplyDynamicModules;
  templateId: number;
  lastGuideBaseId?: number;
};

export type ManageOrgsJob = {
  jobType: JobType.ManageOrgs;
  forceDeleteCheck?: boolean;
};

export type DeleteOrganizationJob = {
  jobType: JobType.DeleteOrganization;
  stepNumber?: number;
  organizationId: number;
  rowsRemoved?: number;
};

export type SetupNewOrgJob = {
  jobType: JobType.SetupNewOrg;
  orgId: number;
};

export type UpdateScheduledGuidesJob = {
  jobType: JobType.UpdateScheduledGuides;
};

export type PrelaunchScheduledGuideJob = {
  jobType: JobType.PrelaunchScheduledGuide;
  templatesAndOrgs: TemplatesAndOrgsList;
  batchSize?: number;
  lastAccountId?: number;
};

export type CleanupScheduledGuideJob = {
  jobType: JobType.CleanupScheduledGuide;
  templateIds: number[];
  batchSize?: number;
  lastGuideBaseId?: number;
};

export type Job =
  | HandleIdentifyChecksJob
  | HandleEventHookJob
  | ManageNpsSurveysJob
  | AutoCompleteStepOnGuideCompletionJob
  | RunGuideRollupsJob
  | RunAnalyticsRollupsJob
  | QueueRollupJob
  | RunDataUsageCacheJob
  | ExpireGuidesJob
  | DeleteObjectsJob
  | TemplateExpirationChangedJob
  | DeleteNpsSurveyJob
  | UpdateGuideDataJob
  | GenerateReportCsvJob
  | CaptureTemplateAnalyticsJob
  | UpdateStepDataJob
  | UpdateAnnouncementDataJob
  | UpdateAccountUserDataJob
  | ResetGuidesJob
  | ResetGuidesForGuideBasesJob
  | DeleteGuidesJob
  | RemoveTemplateJob
  | SyncStepPrototypeInputsJob
  | SyncStepPrototypeCtasJob
  | SyncTemplateChangesJob
  | SendEmailJob
  | SendGuideViewedEmailJob
  | SendForgotPasswordLinkEmailJob
  | SendEmailVerificationEmailJob
  | SendEndUserNudgeSingleJob
  | SendEndUserNudgeWithTemplateJob
  | SendEndUserNudgeBatchJob
  | HandleStepCompletedNotificationsJob
  | SendBatchedStepNotificationJob
  | RecheckTemplateTargetingJob
  | SyncStepProgressJob
  | PreCompleteStepsJob
  | UpdateChangedBranchGuideAudienceJob
  | SendBatchedAlertsJob
  | WeeklyCleanupJob
  | DetachedGuideBaseCleanupJob
  | ProcessQueuedCleanupsJob
  | DeleteExtensionDataJob
  | ApplyDynamicModulesJob
  | ManageOrgsJob
  | DeleteOrganizationJob
  | SetupNewOrgJob
  | ApplyAudienceRulesToTemplatesJob
  | UpdateScheduledGuidesJob
  | PrelaunchScheduledGuideJob
  | CleanupScheduledGuideJob;
