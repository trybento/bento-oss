import React, { createContext, useEffect, useMemo, useRef } from 'react';

import {
  EmbedToggleStyle,
  SidebarStyle,
  SidebarPosition,
  Theme,
  CompletionStyle,
  GuideHeaderSettings,
  StepSeparationStyle,
  StepSeparationType,
  ActiveStepShadow,
  InlineContextualShadow,
  InlineContextualStyle,
  OrgAdditionalColor,
  AllGuidesStyle,
  QuickLinks,
  HelpCenter,
  TagVisibility,
  ModalsStyle,
  BannersStyle,
  TooltipsStyle,
  HelpCenterStyle,
  ResponsiveVisibility,
  VisualTagPulseLevel,
  CtasStyle,
} from 'bento-common/types';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  EmbedToggleBehavior,
  InlineEmptyBehaviour,
  SidebarAvailability,
  SidebarVisibility,
} from 'bento-common/types/shoyuUIState';
import { BentoUI } from 'bento-common/types/preview';
import { orgSettingsDefaults } from 'bento-common/data/orgSettingsDefaults';

import { FeatureFlags } from '../../types/global';
import { addAlpha, px } from '../lib/helpers';
import { FormFactorContextValue } from './FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import { forceHexColor } from 'bento-common/utils/color';

const CUSTOM_CSS_ID = 'customCss';

export type CustomUIProviderValue = {
  orgTheme: Theme;
  primaryColorHex: string;
  secondaryColorHex: string;
  isSecondaryColorDark: boolean;
  fontColorHex: string;
  borderColor: string;
  isFontColorDark: boolean;
  backgroundColor: string;
  cardBackgroundColor: string;
  isBackgroundDark: boolean;
  toggleStyle: EmbedToggleStyle;
  embedToggleBehavior: EmbedToggleBehavior;
  toggleColorHex: string;
  toggleTextColor: string;
  toggleText: string | null;
  sidebarSide: 'left' | 'right';
  sidebarStyle: SidebarStyle;
  isFloatingSidebar: boolean;
  appContainerIdentifier: string | null;
  sidebarVisibility: SidebarVisibility;
  sidebarAvailability: SidebarAvailability;
  isSidebarAutoOpenOnFirstViewDisabled: boolean;
  isEmbedToggleColorInverted: boolean;
  isBrightFontColorOnBrightSecondaryColor: boolean;
  tagLightPrimaryColor: string;
  tagPrimaryColor: string;
  tagTextColor: string;
  tagDotSize: number;
  tagPulseLevel: VisualTagPulseLevel;
  tagBadgeIconPadding: number;
  tagBadgeIconBorderRadius: number;
  tagCustomIconUrl: string | null;
  tagVisibility: TagVisibility;
  paragraphFontSize: number;
  paragraphLineHeight: number;
  cyoaOptionBorderColor: string;
  cyoaOptionShadow: string;
  cyoaOptionShadowHover: string;
  cyoaOptionBackgroundColor: string;
  isCyoaOptionBackgroundColorDark: boolean;
  cyoaTextColor: string;
  floatingAnchorXOffset: number;
  floatingAnchorYOffset: number;
  floatingDragDisabled: boolean;
  stepCompletionStyle: CompletionStyle;
  stepSeparationStyle: StepSeparationStyle;
  inlineContextualStyle: InlineContextualStyle;
  sidebarHeader: GuideHeaderSettings;
  inlineEmptyBehaviour: InlineEmptyBehaviour;
  featureFlags: FeatureFlags | undefined;
  additionalColors: OrgAdditionalColor[];
  allGuidesStyle: AllGuidesStyle;
  sidebarBlocklistedUrls: string[];
  quickLinks: QuickLinks;
  modalsStyle: ModalsStyle;
  tooltipsStyle: TooltipsStyle;
  ctasStyle: CtasStyle;
  bannersStyle: BannersStyle;
  ticketCreationEnabled: boolean;
  zendeskChatEnabled: boolean;
  kbSearchEnabled: boolean;
  helpCenter?: HelpCenter;
  helpCenterStyle: HelpCenterStyle;
  responsiveVisibility: ResponsiveVisibility;
};

type OuterProps = {
  ui: BentoUI;
  featureFlags?: FeatureFlags;
};

type Props = OuterProps &
  Pick<FormFactorContextValue, 'embedFormFactorFlags' | 'isPreviewFormFactor'>;

/**
 * NOTE: Changes here should also probably apply to `orgSettingsDefaults`
 *
 * @todo finish syncing with `orgSettingsDefaults`
 */
export const defaultCustomUIContextValue: CustomUIProviderValue = {
  orgTheme: Theme.nested,
  primaryColorHex: forceHexColor(orgSettingsDefaults.primaryColorHex),
  secondaryColorHex: forceHexColor(orgSettingsDefaults.secondaryColorHex),
  isSecondaryColorDark: false,
  fontColorHex: 'black',
  borderColor: '#E2E8F0',
  isFontColorDark: false,
  backgroundColor: 'white',
  cardBackgroundColor: 'white',
  isBackgroundDark: false,
  toggleStyle: EmbedToggleStyle.progressRing,
  toggleColorHex: forceHexColor(orgSettingsDefaults.embedToggleColorHex),
  toggleTextColor: forceHexColor(orgSettingsDefaults.toggleTextColor),
  toggleText: null,
  sidebarSide: SidebarPosition.right,
  sidebarStyle: SidebarStyle.slideOut,
  isFloatingSidebar: false,
  appContainerIdentifier: null,
  sidebarVisibility: SidebarVisibility.show,
  sidebarAvailability: SidebarAvailability.default,
  isSidebarAutoOpenOnFirstViewDisabled: false,
  isEmbedToggleColorInverted: false,
  isBrightFontColorOnBrightSecondaryColor: false,
  tagLightPrimaryColor: 'white',
  tagPrimaryColor: forceHexColor(orgSettingsDefaults.tagPrimaryColor),
  tagTextColor: forceHexColor(orgSettingsDefaults.tagTextColor),
  embedToggleBehavior: orgSettingsDefaults.embedToggleBehavior,
  tagDotSize: 6,
  tagPulseLevel: orgSettingsDefaults.tagPulseLevel,
  tagBadgeIconPadding: 0,
  tagBadgeIconBorderRadius: 0,
  tagCustomIconUrl: null,
  tagVisibility: TagVisibility.always,
  paragraphFontSize: 14,
  paragraphLineHeight: 20,
  cyoaOptionBorderColor: '',
  cyoaOptionShadow: '',
  cyoaOptionShadowHover: '',
  cyoaOptionBackgroundColor: 'white',
  isCyoaOptionBackgroundColorDark: false,
  cyoaTextColor: 'black',
  floatingAnchorXOffset: 0,
  floatingAnchorYOffset: 0,
  floatingDragDisabled: false,
  stepCompletionStyle: CompletionStyle.lineThrough,
  stepSeparationStyle: {
    type: StepSeparationType.box,
    boxCompleteBackgroundColor: undefined,
    boxActiveStepShadow: ActiveStepShadow.standard,
    boxBorderRadius: 8,
  },
  inlineContextualStyle: {
    padding: 8,
    borderRadius: 8,
    shadow: InlineContextualShadow.none,
  },
  modalsStyle: orgSettingsDefaults.modalsStyle,
  bannersStyle: orgSettingsDefaults.bannersStyle,
  tooltipsStyle: orgSettingsDefaults.tooltipsStyle,
  ctasStyle: orgSettingsDefaults.ctasStyle,
  responsiveVisibility: orgSettingsDefaults.responsiveVisibility,
  sidebarHeader: orgSettingsDefaults.sidebarHeader,
  inlineEmptyBehaviour: InlineEmptyBehaviour.hide,
  featureFlags: undefined,
  additionalColors: [],
  allGuidesStyle: orgSettingsDefaults.allGuidesStyle,
  sidebarBlocklistedUrls: [],
  ticketCreationEnabled: false,
  zendeskChatEnabled: false,
  kbSearchEnabled: false,
  quickLinks: [],
  helpCenterStyle: orgSettingsDefaults.helpCenterStyle,
};

export const customUIContextKeys = Object.keys(defaultCustomUIContextValue);

export const CustomUIContext = createContext<CustomUIProviderValue>(
  defaultCustomUIContextValue
);

export const CustomUIProviderInner = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ value: CustomUIProviderValue }>
>(function CustomUIProviderInnerComponent({ value, children }, ref) {
  return (
    // @ts-ignore
    <CustomUIContext.Provider value={value}>
      <div
        ref={ref}
        style={
          {
            // Allows Bento to inherit whatever font our customer's app is using
            fontFamily: 'inherit',
            '--app-background-color': value.backgroundColor || '#FFFFFF',
            // Fix for safari not supporting gradients with rgba.
            '--app-background-color-transparent':
              `${value.backgroundColor}00` || '#FFFFFF00',
            '--card-background-color': value.cardBackgroundColor || '#FFFFFF',
            // Fix for safari not supporting gradients with rgba.
            '--card-background-color-transparent':
              `${value.cardBackgroundColor}00` || '#FFFFFF00',
            '--primary-color': value.primaryColorHex || '#FFFFFF',
            // Fix for safari not supporting gradients with rgba.
            '--primary-color-transparent':
              `${value.primaryColorHex}00` || '#FFFFFF00',
            '--shimmer-border-radius': px(value.tagBadgeIconBorderRadius),
            '--shimmer-shadow-color': value.tagPrimaryColor,
            '--shimmer-shadow-color-step-1': addAlpha(
              value.tagPrimaryColor,
              0.6
            ),
            '--shimmer-shadow-color-step-2': addAlpha(
              value.tagPrimaryColor,
              0.04
            ),
            '--shimmer-shadow-color-step-3': addAlpha(
              value.tagPrimaryColor,
              0.08
            ),
            '--cyoa-option-border-color': value.cyoaOptionBorderColor,
            '--cyoa-option-shadow': value.cyoaOptionShadow || 'none',
            '--cyoa-option-shadow-hover': value.cyoaOptionShadowHover || 'none',
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </CustomUIContext.Provider>
  );
});

const CustomUIProviderComponent: React.FC<React.PropsWithChildren<Props>> = ({
  ui,
  isPreviewFormFactor,
  embedFormFactorFlags: { isInline, isSidebar },
  children,
  featureFlags,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const {
    theme: orgTheme,
    primaryColorHex,
    secondaryColorHex,
    isSecondaryColorDark,
    fontColorHex,
    borderColor,
    isFontColorDark,
    backgroundColor,
    embedToggleBehavior,
    sidebarBackgroundColor,
    cardBackgroundColor,
    isBackgroundDark,
    isSidebarBackgroundDark,
    toggleStyle,
    toggleColorHex,
    toggleTextColor,
    toggleText,
    sidebarSide,
    sidebarStyle,
    appContainerIdentifier,
    embedCustomCss,
    sidebarVisibility,
    sidebarAvailability,
    isSidebarAutoOpenOnFirstViewDisabled,
    isEmbedToggleColorInverted,
    tagLightPrimaryColor,
    tagPrimaryColor,
    tagTextColor,
    tagDotSize,
    tagPulseLevel,
    tagBadgeIconPadding,
    tagBadgeIconBorderRadius,
    tagCustomIconUrl,
    tagVisibility,
    paragraphFontSize,
    paragraphLineHeight,
    cyoaOptionBorderColor,
    cyoaOptionShadow,
    cyoaOptionShadowHover,
    cyoaOptionBackgroundColor,
    isCyoaOptionBackgroundColorDark,
    cyoaTextColor,
    floatingAnchorXOffset,
    floatingAnchorYOffset,
    stepCompletionStyle,
    stepSeparationStyle,
    inlineContextualStyle,
    sidebarHeader,
    inlineEmptyBehaviour,
    additionalColors,
    allGuidesStyle,
    sidebarBlocklistedUrls,
    quickLinks,
    ticketCreationEnabled,
    zendeskChatEnabled,
    kbSearchEnabled,
    helpCenter,
    helpCenterStyle,
    tooltipsStyle,
    ctasStyle,
    modalsStyle,
    bannersStyle,
    responsiveVisibility,
  } = ui;

  const _backgroundColor = isInline ? backgroundColor : sidebarBackgroundColor;
  const _isBackgroundDark = isInline
    ? isBackgroundDark
    : isSidebarBackgroundDark;

  const isBrightFontColorOnBrightSecondaryColor =
    !!fontColorHex && !!secondaryColorHex && !isSecondaryColorDark;

  // Inject customized CSS rules.
  useEffect(() => {
    if (featureFlags?.isCustomCSSFlagEnabled && embedCustomCss) {
      const shadowRoot = ref?.current?.getRootNode();

      if (shadowRoot) {
        const styleNode =
          (shadowRoot as Document).getElementById(CUSTOM_CSS_ID) ||
          document.createElement('style');

        styleNode.innerHTML = '';
        styleNode.id = CUSTOM_CSS_ID;
        styleNode.appendChild(document.createTextNode(embedCustomCss));

        shadowRoot.appendChild(styleNode);
      }
    }
  }, [embedCustomCss]);

  const isFloatingSidebar = useMemo(
    () => isSidebar && sidebarStyle === SidebarStyle.floating,
    [sidebarStyle, isSidebar]
  );

  return (
    // @ts-ignore
    <CustomUIProviderInner
      value={{
        orgTheme,
        primaryColorHex,
        secondaryColorHex,
        isSecondaryColorDark,
        fontColorHex,
        borderColor,
        isFontColorDark,
        helpCenterStyle,
        backgroundColor: _backgroundColor,
        cardBackgroundColor,
        isBackgroundDark: _isBackgroundDark,
        toggleStyle: toggleStyle || EmbedToggleStyle.progressRing,
        toggleTextColor,
        toggleColorHex: toggleColorHex || primaryColorHex,
        toggleText,
        sidebarSide: sidebarSide || 'right',
        sidebarStyle,
        isFloatingSidebar,
        appContainerIdentifier,
        sidebarVisibility,
        sidebarAvailability,
        isSidebarAutoOpenOnFirstViewDisabled,
        isEmbedToggleColorInverted,
        isBrightFontColorOnBrightSecondaryColor,
        tagLightPrimaryColor,
        tagPrimaryColor,
        tagTextColor,
        tagDotSize,
        tagPulseLevel,
        tagBadgeIconPadding,
        tagBadgeIconBorderRadius,
        tagCustomIconUrl,
        tagVisibility,
        embedToggleBehavior,
        paragraphFontSize,
        paragraphLineHeight,
        cyoaOptionBorderColor,
        cyoaOptionShadow,
        cyoaOptionShadowHover,
        cyoaOptionBackgroundColor,
        isCyoaOptionBackgroundColorDark,
        cyoaTextColor,
        floatingAnchorXOffset,
        floatingAnchorYOffset,
        floatingDragDisabled: isPreviewFormFactor,
        stepCompletionStyle,
        stepSeparationStyle,
        inlineContextualStyle,
        sidebarHeader,
        inlineEmptyBehaviour,
        featureFlags,
        additionalColors,
        allGuidesStyle,
        sidebarBlocklistedUrls,
        ticketCreationEnabled,
        zendeskChatEnabled,
        kbSearchEnabled,
        quickLinks,
        helpCenter,
        tooltipsStyle,
        ctasStyle,
        modalsStyle,
        bannersStyle,
        responsiveVisibility,
      }}
      ref={ref}
    >
      {children}
    </CustomUIProviderInner>
  );
};

export default composeComponent<React.PropsWithChildren<OuterProps>>([
  withFormFactor,
])(CustomUIProviderComponent);
