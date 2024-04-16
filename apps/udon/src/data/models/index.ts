import { Event } from './Analytics/Event.model';
import { ReportDump } from './Audit/ReportDump.model';
import { LaunchReportLog } from './Audit/LaunchReport.model';
import { StepPrototypeAudit } from './Audit/StepPrototypeAudit.model';
import { ModuleAudit } from './Audit/ModuleAudit.model';
import { TemplateAudit } from './Audit/TemplateAudit.model';
import { RollupState } from './Analytics/RollupState.model';
import { ValueDataAggregate } from './Analytics/ValueDataAggregate.model';
import { ValueData } from './Analytics/ValueData.model';
import { GuideData } from './Analytics/GuideData.model';
import { OrganizationData } from './Analytics/OrganizationData.model';
import { DataUsage } from './Analytics/DataUsage.model';
import { AccountUserData } from './Analytics/AccountUserData.model';
import { AccountUserDailyLog } from './Analytics/AccountUserDailyLog.model';
import { StepEvent } from './Analytics/StepEvent.model';
import { GuideEvent } from './Analytics/GuideEvent.model';
import { AnnouncementDailyActivity } from './Analytics/AnnouncementDailyActivity.model';
import { StepData } from './Analytics/StepData.model';
import { TemplateData } from './Analytics/TemplateData.model';
import { AccountUserEvent } from './Analytics/AccountUserEvent.model';
import { CapturedGuideAnalytics } from './Analytics/CapturedGuideAnalytics.model';
import { Account } from './Account.model';
import { AccountAuditLog } from './AccountAuditLog.model';
import { AccountUser } from './AccountUser.model';
import { Audience } from './Audience.model';
import { BranchingPath } from './BranchingPath.model';
import { CustomAttribute } from './CustomAttribute.model';
import { CustomAttributeValue } from './CustomAttributeValue.model';
import { FileUpload } from './FileUpload.model';
import { GoogleDriveUploaderAuth } from './GoogleDriveUploaderAuth.model';
import { Guide } from './Guide.model';
import { GuideBase } from './GuideBase.model';
import { GuideModule } from './GuideModule.model';
import { GuideModuleBase } from './GuideModuleBase.model';
import { GuideParticipant } from './GuideParticipant.model';
import { GuideStepBase } from './GuideStepBase.model';
import { Module } from './Module.model';
import { ModuleStepPrototype } from './ModuleStepPrototype.model';
import { ModuleAutoLaunchRule } from './ModuleAutoLaunchRule.model';
import { Organization } from './Organization.model';
import { OrganizationSettings } from './OrganizationSettings.model';
import { OrganizationHost } from './OrganizationHost.model';
import OrganizationInlineEmbed from './OrganizationInlineEmbed.model';
import { SegmentApiKey } from './SegmentApiKey.model';
import { IntegrationApiKey } from './IntegrationApiKey.model';
import IntegrationTemplateSelection from './IntegrationTemplateSelection.model';
import { Step } from './Step.model';
import { StepEventMapping } from './StepEventMapping.model';
import { StepEventMappingRule } from './StepEventMappingRule.model';
import { StepPrototype } from './StepPrototype.model';
import { Template } from './Template.model';
import { TemplateAutoLaunchRule } from './TemplateAutoLaunchRule.model';
import { TemplateTarget } from './TemplateTarget.model';
import { TemplateModule } from './TemplateModule.model';
import { TemplateAudience } from './TemplateAudience.model';
import { TriggeredBranchingAction } from './TriggeredBranchingAction.model';
import { TriggeredBranchingPath } from './TriggeredBranchingPath.model';
import { TriggeredDynamicModule } from './TriggeredDynamicModule.model';
import { TriggeredLaunchCta } from './TriggeredLaunchCta.model';
import UserAuth from './UserAuth.model';
import { User } from './User.model';
import { UserOrganization } from './UserOrganization.model';
import { InternalFeatureFlag } from './Utility/InternalFeatureFlag.model';
import { FeatureFlag } from './FeatureFlag.model';
import { FeatureFlagEnabled } from './FeatureFlagEnabled.model';
import { AutoLaunchLog } from './AutoLaunchLog.model';
import { StepParticipant } from './StepParticipant.model';
import { BatchedNotification } from './BatchedNotifications.model';
import { CustomApiEvent } from './CustomApiEvent.model';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { StepTaggedElementParticipant } from 'src/data/models/StepTaggedElementParticipant.model';
import { GuideBaseStepCta } from './GuideBaseStepCta.model';
import { StepPrototypeCta } from './StepPrototypeCta.model';
import { StepAutoCompleteInteraction } from './StepAutoCompleteInteraction.model';
import { GuideBaseStepAutoCompleteInteraction } from './GuideBaseStepAutoCompleteInteraction.model';
import { StepPrototypeAutoCompleteInteraction } from './StepPrototypeAutoCompleteInteraction.model';
import { Webhook } from './Integrations/Webhook.model';
import { QueuedCleanup } from './Utility/QueuedCleanup.model';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import { InputStepBase } from 'src/data/models/inputStepBase.model';
import { InputStepAnswer } from 'src/data/models/inputStepAnswer.model';
import { TemplateSplitTarget } from 'src/data/models/TemplateSplitTarget.model';
import { AuthAudit } from './Audit/AuthAudit.model';
import DiagnosticsEvent from 'src/data/models/Analytics/DiagnosticsEvent.model';
import { FeatureEvent } from './Analytics/FeatureEvent.model';
import AutoCompleteInteraction from 'src/data/models/AutoCompleteInteraction.model';
import AutoCompleteInteractionGuideCompletion from 'src/data/models/AutoCompleteInteractionGuideCompletion.model';
import { UserDenyList } from 'src/data/models/UserDenyList.model';
import Media from './Media.model';
import MediaReference from './MediaReference.model';
import { AccountCustomApiEvent } from './AccountCustomApiEvent.model';
import { AccountUserCustomApiEvent } from './AccountUserCustomApiEvent.model';
import NpsSurvey from './NetPromoterScore/NpsSurvey.model';
import NpsSurveyInstance from './NetPromoterScore/NpsSurveyInstance.model';
import NpsParticipant from './NetPromoterScore/NpsParticipant.model';
import { AccountAudit } from './Audit/AccountAudit.model';
import { GuideBaseAudit } from './Audit/GuideBaseAudit.model';
import { VisualBuilderSession } from './VisualBuilderSession.model';

const models = {
  Event,
  StepEvent,
  AccountUserEvent,
  FeatureEvent,
  AccountUserData,
  CapturedGuideAnalytics,
  DataUsage,
  OrganizationData,
  GuideData,
  ValueData,
  ValueDataAggregate,
  RollupState,
  TemplateAudit,
  ModuleAudit,
  StepPrototypeAudit,
  StepData,
  TemplateData,
  GuideEvent,
  AnnouncementDailyActivity,
  LaunchReportLog,
  ReportDump,
  Account,
  AccountAuditLog,
  AccountUser,
  Audience,
  AutoLaunchLog,
  AccountUserDailyLog,
  BatchedNotification,
  BranchingPath,
  CustomAttribute,
  CustomAttributeValue,
  CustomApiEvent,
  FeatureFlag,
  FeatureFlagEnabled,
  InternalFeatureFlag,
  IntegrationApiKey,
  FileUpload,
  GoogleDriveUploaderAuth,
  Guide,
  GuideBase,
  GuideBaseStepCta,
  GuideBaseStepAutoCompleteInteraction,
  GuideModule,
  GuideModuleBase,
  GuideParticipant,
  GuideStepBase,
  IntegrationTemplateSelection,
  Media,
  MediaReference,
  Module,
  ModuleStepPrototype,
  ModuleAutoLaunchRule,
  Organization,
  OrganizationSettings,
  OrganizationHost,
  OrganizationInlineEmbed,
  SegmentApiKey,
  Step,
  StepEventMapping,
  StepEventMappingRule,
  StepAutoCompleteInteraction,
  StepParticipant,
  StepPrototype,
  StepPrototypeCta,
  StepPrototypeAutoCompleteInteraction,
  StepPrototypeTaggedElement,
  StepTaggedElement,
  StepTaggedElementParticipant,
  Template,
  TemplateAutoLaunchRule,
  TemplateModule,
  TemplateTarget,
  TemplateAudience,
  TemplateSplitTarget,
  TriggeredBranchingAction,
  TriggeredBranchingPath,
  TriggeredDynamicModule,
  TriggeredLaunchCta,
  UserAuth,
  User,
  UserOrganization,
  Webhook,
  QueuedCleanup,
  InputStepPrototype,
  InputStepBase,
  InputStepAnswer,
  AuthAudit,
  DiagnosticsEvent,
  AutoCompleteInteraction,
  AutoCompleteInteractionGuideCompletion,
  UserDenyList,
  AccountCustomApiEvent,
  AccountUserCustomApiEvent,
  NpsSurvey,
  NpsSurveyInstance,
  NpsParticipant,
  AccountAudit,
  GuideBaseAudit,
  VisualBuilderSession,
};

export default models;
