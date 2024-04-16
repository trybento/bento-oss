import {
  defaultCyoaOptionBorderColor,
  DefaultCyoaOptionShadow,
} from '../frontend/constants';
import {
  ActiveStepShadow,
  AnnouncementShadow,
  BannerPadding,
  CompletionStyle,
  EmbedSidebarSide,
  EmbedToggleStyle,
  GuideHeaderCloseIcon,
  GuideHeaderProgressBar,
  GuideHeaderType,
  SidebarStyle,
  StepSeparationType,
  VisualTagPulseLevel,
} from '../types';
import {
  EmbedToggleBehavior,
  InlineEmptyBehaviour,
  ResponsiveVisibilityBehavior,
  SidebarAvailability,
  SidebarVisibility,
} from '../types/shoyuUIState';

const BENTO_PRIMARY_COLOR_DEFAULT = '73A4FC';
const BENTO_SECONDARY_COLOR_DEFAULT = 'EFF5FF';
const BENTO_SIDEBAR_BACKGROUND_COLOR_DEFEAULT = 'FFFFFF';
const BENTO_INLINE_BACKGROUND_COLOR_DEFEAULT = '00000000'; // means transparent
const BENTO_CARD_BACKGROUND_COLOR_DEFAULT = 'FFFFFF';

/**
 * NOTE: Changes applied here probably also need to be applied
 * as column defaults in the form of a migration.
 */
export const orgSettingsDefaults = {
  primaryColorHex: BENTO_PRIMARY_COLOR_DEFAULT,
  secondaryColorHex: BENTO_SECONDARY_COLOR_DEFAULT,
  sidebarBackgroundColor: BENTO_SIDEBAR_BACKGROUND_COLOR_DEFEAULT,
  embedBackgroundHex: BENTO_INLINE_BACKGROUND_COLOR_DEFEAULT,
  cardBackgroundColor: BENTO_CARD_BACKGROUND_COLOR_DEFAULT,
  embedToggleStyle: EmbedToggleStyle.progressRing,
  toggleTextColor: '000000',
  embedSidebarSide: EmbedSidebarSide.Right,
  embedToggleColorHex: BENTO_PRIMARY_COLOR_DEFAULT,
  sidebarStyle: SidebarStyle.slideOut,
  sidebarVisibility: SidebarVisibility.show,
  sidebarAvailability: SidebarAvailability.default,
  tagPrimaryColor: 'E19E1A',
  tagTextColor: 'FFFFFF',
  tagPulseLevel: VisualTagPulseLevel.standard,
  cyoaBackgroundColor: 'FFFFFF',
  cyoaOptionBackgroundColor: 'FFFFFF',
  cyoaTextColor: '2D3748',
  stepCompletionStyle: CompletionStyle.lineThrough,
  cyoaOptionBorderColor: defaultCyoaOptionBorderColor,
  cyoaOptionShadow: DefaultCyoaOptionShadow.default,
  cyoaOptionShadowHover: DefaultCyoaOptionShadow.hover,
  inlineEmptyBehaviour: InlineEmptyBehaviour.hide,
  borderColor: 'E2E8F0',
  stepSeparationStyle: {
    type: StepSeparationType.box,
    boxCompleteBackgroundColor: '#f9fafb',
    boxActiveStepShadow: ActiveStepShadow.standard,
    boxBorderRadius: 8,
  },
  sidebarHeader: {
    type: GuideHeaderType.bright,
    closeIcon: GuideHeaderCloseIcon.minimize,
    showModuleNameInStepView: false,
    progressBar: GuideHeaderProgressBar.sections,
  },
  additionalColors: [],
  allGuidesStyle: {
    allGuidesTitle: 'Resource center',
    activeGuidesTitle: 'Active guides',
    previousGuidesTitle: 'Previous guides',
    previousAnnouncementsTitle: 'Previous announcements',
  },
  inlineContextualStyle: {
    borderRadius: 8,
    padding: 16,
  },
  modalsStyle: {
    paddingX: 36,
    paddingY: 24,
    borderRadius: 8,
    shadow: AnnouncementShadow.standard,
    backgroundOverlayColor: '#171923',
    backgroundOverlayOpacity: 0.3,
  },
  helpCenterStyle: {
    supportTicketTitle: 'Report an issue',
    chatTitle: 'Chat with support',
  },
  tooltipsStyle: {
    paddingX: 36,
    paddingY: 24,
    borderRadius: 8,
    shadow: AnnouncementShadow.standard,
  },
  ctasStyle: {
    fontSize: 16,
    lineHeight: 24,
    borderRadius: 4,
    paddingX: 16,
    paddingY: 8,
  },
  bannersStyle: {
    padding: BannerPadding.medium,
    borderRadius: 8,
    shadow: AnnouncementShadow.standard,
  },
  responsiveVisibility: {
    all: ResponsiveVisibilityBehavior.hide,
  },
  embedToggleBehavior: EmbedToggleBehavior.default,
};
