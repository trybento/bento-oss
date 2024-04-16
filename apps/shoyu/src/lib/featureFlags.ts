import { FeatureFlagNames } from 'bento-common/types';

import sessionStore from '../stores/sessionStore';
import { FeatureFlags } from '../../types/global';

function featureFlagFactory(flagName: FeatureFlagNames) {
  return (enabledFeatureFlags?: string[] | null) =>
    !!enabledFeatureFlags && enabledFeatureFlags.includes(flagName);
}

export const enabledCustomCSS = featureFlagFactory(FeatureFlagNames.customCss);
export const enableTooltipInsideWindow = featureFlagFactory(
  FeatureFlagNames.tooltipInsideWindow
);
export const enableDisableWindowScrollHook = featureFlagFactory(
  FeatureFlagNames.disableWindowScrollHook
);

export const enableHideSidebar = featureFlagFactory(
  FeatureFlagNames.hideSidebar
);

export const enabledNpsSurveys = featureFlagFactory(
  FeatureFlagNames.npsSurveys
);

export const enableForcedAvailableGuidesHydration = featureFlagFactory(
  FeatureFlagNames.forcedAvailableGuidesHydration
);

export const observeStylingAttributes = featureFlagFactory(
  FeatureFlagNames.observeStylingAttributes
);

export default function getFeatureFlags(
  previewId: string | undefined
): FeatureFlags {
  const ffs = previewId
    ? sessionStore.getState().previewSessions[previewId]?.enabledFeatureFlags ||
      []
    : sessionStore.getState().enabledFeatureFlags;

  return {
    isCustomCSSFlagEnabled: enabledCustomCSS(ffs),
    isTooltipInsideWindowEnabled: enableTooltipInsideWindow(ffs),
    isDisableWindowScrollHookEnabled: enableDisableWindowScrollHook(ffs),
    isNpsSurveysEnabled: enabledNpsSurveys(ffs),
    isSidebarDisabled: enableHideSidebar(ffs),
    isForcedAvailableGuidesHydrationEnabled:
      enableForcedAvailableGuidesHydration(ffs),
    observeStylingAttributes: observeStylingAttributes(ffs),
  };
}
