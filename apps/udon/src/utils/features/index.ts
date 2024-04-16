import { FeatureFlagNames } from 'bento-common/types';
import { featureFlag } from './api';
import { HARD_EXCLUDE_BRANCHING_TARGETING } from '../constants';

/*
 * Add new feature flags here
 *
 * They need to be added here to register with udon and forward to front-end
 */

export const enableCustomCSS = featureFlag(FeatureFlagNames.customCss);
export const enableWebhooks = featureFlag(FeatureFlagNames.webhooks);
export const enableAutolaunchCsv = featureFlag(FeatureFlagNames.autolaunchCsv);
export const enableStepProgressSyncing = featureFlag(
  FeatureFlagNames.stepProgressSyncing
);
export const enableBranchingSelectionTargeting = featureFlag(
  FeatureFlagNames.branchingSelectionTargeting,
  {
    /** Always disabled */
    override: HARD_EXCLUDE_BRANCHING_TARGETING ? false : undefined,
  }
);
export const enableInternalGuideNames = featureFlag(
  FeatureFlagNames.internalGuideNames
);
export const enableInlineEmbedAutoInjection = featureFlag(
  FeatureFlagNames.autoInjectInline
);
export const enableDynamicModules = featureFlag(
  FeatureFlagNames.dynamicModules
);
export const enableAnalyticsMaintenancePage = featureFlag(
  FeatureFlagNames.analyticsMaintenancePage
);
export const enableInternalGuideEvents = featureFlag(
  FeatureFlagNames.internalGuideEvents
);
export const enableGuideViewedEmails = featureFlag(
  FeatureFlagNames.guideViewedEmails
);
export const enableEndUserNudges = featureFlag(FeatureFlagNames.endUserNudges);
export const enableSerialCyoa = featureFlag(FeatureFlagNames.serialCyoa);
export const enableAdvancedInlineContextualCustomizations = featureFlag(
  FeatureFlagNames.advancedInlineContextualCustomizations
);
export const enableDiagnosticsOverride = featureFlag(
  FeatureFlagNames.overrideDiagnostics
);
export const enableHideSidebar = featureFlag(FeatureFlagNames.hideSidebar);
export const enableAdvancedSidebarSettings = featureFlag(
  FeatureFlagNames.advancedSidebarSettings
);
export const enableEasterEggs = featureFlag(FeatureFlagNames.easterEggs);
export const enableGuideSchedulingThrottling = featureFlag(
  FeatureFlagNames.guideSchedulingThrottling
);
export const enableZendesk = featureFlag(FeatureFlagNames.enableZendesk);
export const forceGoogleSSO = featureFlag(FeatureFlagNames.forceGoogleSSO);
export const enableGatedGuideAndStepPropagation = featureFlag(
  FeatureFlagNames.gatedGuideAndStepPropagation
);
export const enableSplitTesting = featureFlag(FeatureFlagNames.splitTesting);
export const enableTooltipInsideWindow = featureFlag(
  FeatureFlagNames.tooltipInsideWindow
);
export const enableDeferredPropagation = featureFlag(
  FeatureFlagNames.deferPropagation
);
export const enabledisableWindowScrollHook = featureFlag(
  FeatureFlagNames.disableWindowScrollHook
);
export const enableCustomVisualTag = featureFlag(
  FeatureFlagNames.customVisualTag
);
export const enableNpsSurveys = featureFlag(FeatureFlagNames.npsSurveys);
export const enableTargetingGpt = featureFlag(FeatureFlagNames.targetingGpt);
export const enableForcedAvailableGuidesHydration = featureFlag(
  FeatureFlagNames.forcedAvailableGuidesHydration
);
export const hideChartOfNewGuidesLaunched = featureFlag(
  FeatureFlagNames.hideChartOfNewGuidesLaunched
);
