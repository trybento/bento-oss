import { FeatureFlagNames } from 'bento-common/types';
import { useLoggedInUser } from 'providers/LoggedInUserProvider';

const useFeatureFlag = (name: FeatureFlagNames): boolean => {
  const { loggedInUser } = useLoggedInUser();
  const flags = loggedInUser?.organization?.enabledFeatureFlags;
  if (!flags) return false;
  return flags.includes(name);
};

/* New feature flags below */
export const useCustomCSSFlag = () =>
  useFeatureFlag(FeatureFlagNames.customCss);
export const useWebhooks = () => useFeatureFlag(FeatureFlagNames.webhooks);
export const useZendesk = () => useFeatureFlag(FeatureFlagNames.enableZendesk);
export const useAutolaunchCsv = () =>
  useFeatureFlag(FeatureFlagNames.autolaunchCsv);
export const useSerialCyoa = () => useFeatureFlag(FeatureFlagNames.serialCyoa);
export const useBranchingSelectionTargeting = () =>
  useFeatureFlag(FeatureFlagNames.branchingSelectionTargeting);
export const useInternalGuideNames = () =>
  useFeatureFlag(FeatureFlagNames.internalGuideNames);
export const useEndUserNudges = () =>
  useFeatureFlag(FeatureFlagNames.endUserNudges);
export const useAutoInjectInlineEmbed = () =>
  useFeatureFlag(FeatureFlagNames.autoInjectInline);
export const useDynamicModules = () =>
  useFeatureFlag(FeatureFlagNames.dynamicModules);
export const useGuideArchiving = () =>
  useFeatureFlag(FeatureFlagNames.guideArchiving);
export const useDiagnosticsOverride = () =>
  useFeatureFlag(FeatureFlagNames.overrideDiagnostics);
export const useHideSidebar = () =>
  useFeatureFlag(FeatureFlagNames.hideSidebar);
export const useAdvancedSidebarSettings = () =>
  useFeatureFlag(FeatureFlagNames.advancedSidebarSettings);
export const useEasterEggs = () => useFeatureFlag(FeatureFlagNames.easterEggs);
export const useAnalyticsMaintenancePage = () =>
  useFeatureFlag(FeatureFlagNames.analyticsMaintenancePage);
export const useAdvancedInlineContextualCustomizations = () =>
  useFeatureFlag(FeatureFlagNames.advancedInlineContextualCustomizations);
export const useGuideSchedulingThrottling = () =>
  useFeatureFlag(FeatureFlagNames.guideSchedulingThrottling);
export const useForceGoogleSSO = () =>
  useFeatureFlag(FeatureFlagNames.forceGoogleSSO);
export const useSplitTesting = () =>
  useFeatureFlag(FeatureFlagNames.splitTesting);
export const useNpsSurveys = () => useFeatureFlag(FeatureFlagNames.npsSurveys);
export const useTargetingGpt = () =>
  useFeatureFlag(FeatureFlagNames.targetingGpt);
export const useHideChartOfNewGuidesLaunched = () =>
  useFeatureFlag(FeatureFlagNames.hideChartOfNewGuidesLaunched);
