import {
  AllGuidesStyle,
  CompletionStyle,
  EmbedToggleStyle,
  GuideHeaderSettings,
  HelpCenter,
  InlineContextualStyle,
  OrgAdditionalColor,
  QuickLinks,
  StepSeparationStyle,
  SidebarStyle,
  Theme,
  TagVisibility,
  ModalsStyle,
  TooltipsStyle,
  BannersStyle,
  HelpCenterStyle,
  ResponsiveVisibility,
  VisualTagPulseLevel,
  CtasStyle,
} from '.';
import { BranchingPathWithResource, FullGuide } from './globalShoyuState';
import {
  EmbedToggleBehavior,
  InlineEmptyBehaviour,
  SidebarAvailability,
  SidebarVisibility,
  View,
} from './shoyuUIState';

/**
 * @todo move somewhere more appropriate
 */
export type BentoUI = {
  additionalColors: OrgAdditionalColor[];
  allGuidesStyle: AllGuidesStyle;
  appContainerIdentifier: string | null;
  backgroundColor: string;
  borderColor: string;
  cardBackgroundColor: string;
  cyoaBackgroundColor: string;
  cyoaOptionBackgroundColor: string;
  cyoaOptionBorderColor: string;
  cyoaOptionShadow: string;
  cyoaOptionShadowHover: string;
  cyoaTextColor: string;
  embedBackgroundHex?: string;
  embedCustomCss: string | null;
  floatingAnchorXOffset: number;
  floatingAnchorYOffset: number;
  fontColorHex: string;
  injectSidebar: boolean;
  inlineContextualStyle: InlineContextualStyle;
  inlineEmptyBehaviour: InlineEmptyBehaviour;
  embedToggleBehavior: EmbedToggleBehavior;
  isBackgroundDark: boolean;
  isCyoaOptionBackgroundColorDark: boolean;
  isEmbedToggleColorInverted: boolean;
  isFontColorDark: boolean;
  isSecondaryColorDark: boolean;
  isSidebarAutoOpenOnFirstViewDisabled: boolean;
  isSidebarBackgroundDark: boolean;
  sidebarVisibility: SidebarVisibility;
  sidebarAvailability: SidebarAvailability;
  paragraphFontSize: number;
  paragraphLineHeight: number;
  primaryColorHex: string;
  secondaryColorHex: string;
  sidebarBackgroundColor: string;
  sidebarHeader: GuideHeaderSettings;
  sidebarSide: 'left' | 'right';
  sidebarStyle: SidebarStyle;
  /** URLs where the sidebar should not appear */
  sidebarBlocklistedUrls: string[];
  stepCompletionStyle: CompletionStyle;
  stepSeparationStyle: StepSeparationStyle;
  tagBadgeIconBorderRadius: number;
  tagBadgeIconPadding: number;
  tagCustomIconUrl: string | null;
  tagDotSize: number;
  tagPulseLevel: VisualTagPulseLevel;
  tagLightPrimaryColor: string;
  tagPrimaryColor: string;
  tagTextColor: string;
  tagVisibility: TagVisibility;
  theme: Theme;
  toggleColorHex: string;
  toggleTextColor: string;
  toggleStyle: EmbedToggleStyle;
  toggleText: string | null;
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

export type PreviewDataPack = {
  /** The full guide to preview */
  guide: FullGuide | undefined;
  /** Enabled feature flags for the current org */
  enabledFeatureFlags: string[];
  /** Other guides other than the active one */
  additionalGuides?: FullGuide[];
  /** UI settings that should override actual settings */
  uiSettings: Partial<BentoUI>;
  /** All available branching paths and the template/module each branches to */
  branchingPaths?: BranchingPathWithResource[];
  /** Determines if the sidebar should always be expanded and can't be collapsed */
  sidebarAlwaysExpanded?: boolean;
  /** Determines if the sidebar should start already open */
  sidebarInitiallyExpanded?: boolean;
  /** Whether or not to set up to render an auto-injected inline or inline context guide */
  injectInlineEmbed?: boolean;
  /** Wether to preview a specific view */
  view?: View;
};

export type PreviewSettings = {
  /** Actual preview data to mock previews with */
  dataPack?: PreviewDataPack; // trace and replace InitializationData
};
