import { Job, JobType } from 'src/jobsBull/job';
import { JobHandler } from 'src/jobsBull/handler';
import handleIdentifyChecks from 'src/jobsBull/jobs/handleIdentifyChecks/handleIdentifyChecks';
import handleEventHook from 'src/jobsBull/jobs/integrations/handleEventHook';
import autoCompleteStepsAfterGuideCompletion from 'src/jobsBull/jobs/autoCompletion/autoCompleteStepsAfterGuideCompletion';
import runGuideRollups from 'src/jobsBull/jobs/rollupTasks/runGuideRollups';
import runDataUsageCache from 'src/jobsBull/jobs/rollupTasks/runDataUsageCache';
import runAnalyticsRollups from 'src/jobsBull/jobs/rollupTasks/runAnalyticsRollups';
import queueRollupTask from 'src/jobsBull/jobs/rollupTasks/queueRollupTask';
import expireGuides from './jobs/guideExpiry/expireGuides';
import deleteObjects from './jobs/cleanup/deleteObjects';
import templateExpirationChanged from './jobs/guideExpiry/templateExpirationChanged';
import manageNpsSurveys from './jobs/guideExpiry/manageNpsSurveys';
import deleteNpsSurvey from './jobs/nps/deleteNpsSurvey';
import updateGuideData from 'src/jobsBull/jobs/analytics/updateGuideData';
import generateReportCsv from 'src/jobsBull/jobs/analytics/generateReportCsv';
import captureTemplateAnalyticsTask from 'src/jobsBull/jobs/analytics/captureTemplateAnalyticsTask';
import updateStepData from 'src/jobsBull/jobs/analytics/updateStepData';
import updateAnnouncementData from 'src/jobsBull/jobs/analytics/updateAnnouncementData';
import updateAccountUserData from 'src/jobsBull/jobs/analytics/updateAccountUserData';
import resetGuides from './jobs/guideReset/resetGuides';
import resetGuidesForGuideBases from './jobs/guideReset/resetGuidesForGuideBases';
import deleteGuides from './jobs/guideDeletion/deleteGuides';
import removeTemplate from './jobs/templates/removeTemplate';
import syncTemplateChanges from './jobs/syncTemplateChanges/syncTemplateChanges';
import syncStepPrototypeCtas from './jobs/syncTemplateChanges/syncStepPrototypeCtas';
import syncStepPrototypeInputs from './jobs/syncTemplateChanges/syncStepPrototypeInputs';
import sendEmail from './jobs/sendSingleNotification/sendEmail';
import sendGuideViewedEmail from './jobs/notifications/sendGuideViewedEmail';
import sendForgotPasswordLinkEmail from './jobs/notifications/sendForgotPasswordLinkEmail';
import sendEmailVerificationEmail from './jobs/notifications/sendEmailVerificationEmail';
import sendEndUserNudgeBatch from './jobs/sendEndUserNudges/sendEndUserNudgeBatch';
import sendEndUserNudgeSingle from './jobs/sendEndUserNudges/sendEndUserNudgeSingle';
import sendEndUserNudgeWithTemplate from './jobs/sendEndUserNudges/sendEndUserNudgeWithTemplate';
import handleStepCompletedNotifications from './jobs/notifications/handleStepCompletedNotifications';
import sendBatchedStepNotifications from './jobs/notifications/sendBatchedStepNotifications';
import recheckTemplateTargeting from './jobs/recheckTemplateTargeting';
import syncStepProgress from './jobs/syncStepProgress/syncStepProgress';
import preCompleteSteps from './jobs/syncStepProgress/preCompleteSteps';
import updateChangedBranchGuideAudience from './jobs/updateChangedBranchGuideAudience/updateChangedBranchGuideAudience';
import sendBatchedAlerts from './jobs/sendBatchedAlerts/sendBatchedAlerts';
import weeklyCleanup from './jobs/cleanup/weeklyCleanup';
import detachedGuideBaseCleanup from './jobs/cleanup/detachedGuideBaseCleanup';
import processQueuedCleanups from './jobs/cleanup/processQueuedCleanups';
import deleteExtensionData from './jobs/cleanup/deleteExtensionData';
import applyDynamicModules from './jobs/library/applyDynamicModules';
import manageOrgs from './jobs/manageOrgs/manageOrgs';
import setupNewOrg from './jobs/manageOrgs/setupNewOrg';
import deleteOrganization from './jobs/manageOrgs/deleteOrganization';
import applyAudienceRulesToTemplates from './jobs/library/applyAudienceRulesToTemplates';
import cleanupScheduledGuide from './jobs/guideScheduling/cleanupScheduledGuide';
import prelaunchScheduledGuide from './jobs/guideScheduling/prelaunchScheduledGuide';
import updateScheduledGuides from './jobs/guideScheduling/updateScheduledGuides';

type JobHandlerMap = {
  [T in JobType]: Job extends infer U
    ? U extends { jobType: JobType }
      ? T extends U['jobType']
        ? JobHandler<{ [K in keyof U]: U[K] }>
        : never
      : never
    : never;
};

export const jobHandlerMap: JobHandlerMap = {
  [JobType.HandleIdentifyChecks]: handleIdentifyChecks,
  [JobType.HandleEventHook]: handleEventHook,
  [JobType.AutoCompleteStepOnGuideCompletion]:
    autoCompleteStepsAfterGuideCompletion,
  [JobType.RunGuideRollups]: runGuideRollups,
  [JobType.RunDataUsageCache]: runDataUsageCache,
  [JobType.RunAnalyticsRollups]: runAnalyticsRollups,
  [JobType.QueueRollup]: queueRollupTask,
  [JobType.ExpireGuides]: expireGuides,
  [JobType.DeleteObjects]: deleteObjects,
  [JobType.TemplateExpirationChanged]: templateExpirationChanged,
  [JobType.ManageNpsSurveys]: manageNpsSurveys,
  [JobType.DeleteNpsSurvey]: deleteNpsSurvey,
  [JobType.UpdateGuideData]: updateGuideData,
  [JobType.GenerateReportCsv]: generateReportCsv,
  [JobType.CaptureTemplateAnalytics]: captureTemplateAnalyticsTask,
  [JobType.UpdateStepData]: updateStepData,
  [JobType.UpdateAnnouncementData]: updateAnnouncementData,
  [JobType.UpdateAccountUserData]: updateAccountUserData,
  [JobType.ResetGuides]: resetGuides,
  [JobType.ResetGuidesForGuideBases]: resetGuidesForGuideBases,
  [JobType.DeleteGuides]: deleteGuides,
  [JobType.RemoveTemplate]: removeTemplate,
  [JobType.SyncTemplateChanges]: syncTemplateChanges,
  [JobType.SyncStepPrototypeCtas]: syncStepPrototypeCtas,
  [JobType.SyncStepPrototypeInputs]: syncStepPrototypeInputs,
  [JobType.SendEmail]: sendEmail,
  [JobType.SendGuideViewedEmail]: sendGuideViewedEmail,
  [JobType.SendForgotPasswordLinkEmail]: sendForgotPasswordLinkEmail,
  [JobType.SendEmailVerificationEmail]: sendEmailVerificationEmail,
  [JobType.SendEndUserNudgeBatch]: sendEndUserNudgeBatch,
  [JobType.SendEndUserNudgeSingle]: sendEndUserNudgeSingle,
  [JobType.SendEndUserNudgeWithTemplate]: sendEndUserNudgeWithTemplate,
  [JobType.HandleStepCompletedNotifications]: handleStepCompletedNotifications,
  [JobType.SendBatchedStepNotification]: sendBatchedStepNotifications,
  [JobType.RecheckTemplateTargeting]: recheckTemplateTargeting,
  [JobType.SyncStepProgress]: syncStepProgress,
  [JobType.PreCompleteSteps]: preCompleteSteps,
  [JobType.UpdateChangedBranchGuideAudience]: updateChangedBranchGuideAudience,
  [JobType.SendBatchedAlerts]: sendBatchedAlerts,
  [JobType.WeeklyCleanup]: weeklyCleanup,
  [JobType.DetachedGuideBaseCleanup]: detachedGuideBaseCleanup,
  [JobType.ProcessQueuedCleanups]: processQueuedCleanups,
  [JobType.DeleteExtensionData]: deleteExtensionData,
  [JobType.ApplyDynamicModules]: applyDynamicModules,
  [JobType.ManageOrgs]: manageOrgs,
  [JobType.SetupNewOrg]: setupNewOrg,
  [JobType.DeleteOrganization]: deleteOrganization,
  [JobType.ApplyAudienceRulesToTemplate]: applyAudienceRulesToTemplates,
  [JobType.CleanupScheduledGuide]: cleanupScheduledGuide,
  [JobType.PrelaunchScheduledGuide]: prelaunchScheduledGuide,
  [JobType.UpdateScheduledGuides]: updateScheduledGuides,
};
