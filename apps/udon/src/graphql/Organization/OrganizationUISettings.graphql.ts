import tinycolor from 'tinycolor2';
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  AdditionalColorsType,
  AllGuidesStyleType,
  GuideHeaderSettingsType,
  InlineContextualStyleType,
  InlineEmptyBehaviourType,
  SidebarVisibilityType,
  StepSeparationStyleType,
  QuickLinksType,
  HelpCenterType,
  EmbedToggleBehaviorType,
  TagVisibilityType,
  TooltipsStyleStyleType,
  ModalsStyleStyleType,
  BannersStyleStyleType,
  HelpCenterStyleType,
  ResponsiveVisibilityType,
  VisualTagPulseLevelType,
  CtasStyleStyleType,
  SidebarAvailabilityType,
} from 'bento-common/graphql/organizationSettings';
import { GraphQLContext } from 'src/graphql/types';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { DARK_COLOR_THRESHOLD } from 'src/utils/constants';
import { formatColor } from 'src/utils/helpers';
import { ThemeType } from './Organization.graphql';

export const OrganizationUISettingsType = new GraphQLObjectType<
  OrganizationSettings,
  GraphQLContext
>({
  name: 'OrganizationUISettings',
  description: '/styles customizations',
  fields: () => ({
    primaryColorHex: {
      type: GraphQLString,
      description: 'The primary brand color of this organization',
      resolve: (organizationSettings) =>
        `#${organizationSettings.primaryColorHex}`,
    },
    secondaryColorHex: {
      type: GraphQLString,
      description: 'The secondary brand color of this organization',
      resolve: (organizationSettings) =>
        `#${organizationSettings.secondaryColorHex}`,
    },
    fontColorHex: {
      type: GraphQLString,
      description: 'The embeddable font color of this organization',
      resolve: (organizationSettings) =>
        formatColor(organizationSettings.fontColorHex),
    },
    toggleColorHex: {
      type: GraphQLString,
      description: 'The color used for the sidebar toggle button in HEX format',
      resolve: (organizationSettings) =>
        formatColor(organizationSettings.embedToggleColorHex),
    },
    toggleTextColor: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The color used for the sidebar text toggle button in HEX format',
      resolve: (organizationSettings) =>
        formatColor(organizationSettings.toggleTextColor),
    },
    sidebarBackgroundColor: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The sidebar background color of this organization',
      resolve: (organizationSettings) =>
        formatColor(organizationSettings.sidebarBackgroundColor),
    },
    embedBackgroundHex: {
      type: GraphQLString,
      description: 'The embeddable background color of this organization',
      resolve: (organizationSettings) =>
        formatColor(organizationSettings.embedBackgroundHex),
    },
    cardBackgroundColor: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The background color of cards in the embeddable for this organization',
      resolve: (organizationSettings) =>
        formatColor(organizationSettings.cardBackgroundColor),
    },
    toggleStyle: {
      type: GraphQLString,
      description: 'The toggle style of the organization',
      resolve: (organizationSettings) =>
        `${organizationSettings.embedToggleStyle}`,
    },
    toggleText: {
      type: GraphQLString,
      description: 'The toggle text of the organization',
      resolve: (organizationSettings) =>
        organizationSettings.embedToggleText
          ? `${organizationSettings.embedToggleText}`
          : 'Onboarding',
    },
    sidebarSide: {
      type: GraphQLString,
      description: 'The sidebar side of the organization',
      resolve: (organizationSettings) =>
        `${organizationSettings.embedSidebarSide}`,
    },
    isEmbedToggleColorInverted: {
      type: GraphQLBoolean,
      description: 'Whether the toggles color is inverted of the organization',
      resolve: (organizationSettings) =>
        `${organizationSettings.isEmbedToggleColorInverted}` === 'true',
    },
    isSidebarAutoOpenOnFirstViewDisabled: {
      type: GraphQLBoolean,
      deprecationReason:
        'No longer an org setting, but dependent on user states',
      description:
        'If the viewer has not seen the guide before and the sidebar is present, is the auto-open functionality disabled',
      resolve: () => false,
    },
    appContainerIdentifier: {
      type: GraphQLString,
      description: `The app container that the sidebar should change`,
      resolve: (organizationSettings) =>
        organizationSettings.appContainerIdentifier,
    },
    sidebarStyle: {
      type: GraphQLString,
      description: 'The style of the sidebar',
      resolve: (organizationSettings) => organizationSettings.sidebarStyle,
    },
    embedCustomCss: {
      type: GraphQLString,
      description: 'Custom CSS rules set by the organization',
      resolve: (organizationSettings) => organizationSettings.embedCustomCss,
    },
    tagPrimaryColor: {
      type: GraphQLString,
      description: 'The primary color for contextual tags',
      resolve: (organizationSettings) =>
        `#${organizationSettings.tagPrimaryColor}`,
    },
    tagTextColor: {
      type: GraphQLString,
      description: 'The text color for contextual tags',
      resolve: (organizationSettings) =>
        `#${organizationSettings.tagTextColor}`,
    },
    tagDotSize: {
      type: GraphQLFloat,
      description: 'The size of dot type tags',
      resolve: (organizationSettings) => organizationSettings.tagDotSize,
    },
    tagPulseLevel: {
      type: VisualTagPulseLevelType,
      description: 'The pulse level for dot type tags',
      resolve: (organizationSettings) => organizationSettings.tagPulseLevel,
    },
    tagBadgeIconPadding: {
      type: GraphQLFloat,
      description: 'The padding for badge and icon type tags',
      resolve: (organizationSettings) =>
        organizationSettings.tagBadgeIconPadding,
    },
    tagBadgeIconBorderRadius: {
      type: GraphQLFloat,
      description: 'The border radius for badge and icon type tags',
      resolve: (organizationSettings) =>
        organizationSettings.tagBadgeIconBorderRadius,
    },
    tagCustomIconUrl: {
      type: GraphQLString,
      description: 'The custom icon URL for icon type tags',
      resolve: (organizationSettings) =>
        organizationSettings.tagCustomIconUrl || null,
    },
    tagVisibility: {
      type: new GraphQLNonNull(TagVisibilityType),
      description: 'Determine the visibility behavior of visual tags',
    },
    paragraphFontSize: {
      type: GraphQLFloat,
      description: 'The font size for step content in a guide',
      resolve: (organizationSettings) => organizationSettings.paragraphFontSize,
    },
    paragraphLineHeight: {
      type: GraphQLFloat,
      description: 'The line height for step content in a guide',
      resolve: (organizationSettings) =>
        organizationSettings.paragraphLineHeight,
    },
    cyoaBackgroundColor: {
      type: GraphQLString,
      description: 'The background hex color for CYOA guides',
      resolve: (organizationSettings) =>
        `#${organizationSettings.cyoaBackgroundColor}`,
    },
    cyoaOptionBackgroundColor: {
      type: GraphQLString,
      description: 'The background hex color for CYOA guide cards',
      resolve: (organizationSettings) =>
        `#${organizationSettings.cyoaOptionBackgroundColor}`,
    },
    isCyoaOptionBackgroundColorDark: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether the CYOA guide cards background color is dark',
      resolve: (organizationSettings) =>
        !!organizationSettings.fontColorHex &&
        tinycolor(
          organizationSettings.cyoaOptionBackgroundColor
        ).getBrightness() < DARK_COLOR_THRESHOLD,
    },
    cyoaTextColor: {
      type: GraphQLString,
      description: 'The text hex color for CYOA guides',
      resolve: (organizationSettings) =>
        `#${organizationSettings.cyoaTextColor}`,
    },
    theme: {
      type: new GraphQLNonNull(ThemeType),
      description: 'The guides themes for this organization',
    },
    floatingAnchorXOffset: {
      type: new GraphQLNonNull(GraphQLFloat),
      description:
        'The offset in pixels for the X anchor of floating components',
    },
    floatingAnchorYOffset: {
      type: new GraphQLNonNull(GraphQLFloat),
      description:
        'The offset in pixels for the Y anchor of floating components',
    },
    stepCompletionStyle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Visual style of a completed step in the embeddable',
    },
    injectSidebar: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        "Whether the sidebar should be auto-injected on the customer's page",
    },
    inlineEmptyBehaviour: {
      type: new GraphQLNonNull(InlineEmptyBehaviourType),
      description:
        'Determines the inline component behaviour when no onboarding guides are available',
    },
    sidebarVisibility: {
      type: new GraphQLNonNull(SidebarVisibilityType),
      description:
        'Determines the sidebar visibility under specific conditions',
    },
    sidebarAvailability: {
      type: new GraphQLNonNull(SidebarAvailabilityType),
      description: 'Determines if the sidebar is available to the user',
    },
    embedToggleBehavior: {
      type: new GraphQLNonNull(EmbedToggleBehaviorType),
      description: 'Determines the behavior of the sidebar toggle when clicked',
    },
    cyoaOptionBorderColor: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The border color of a CYOA card',
      resolve: ({ cyoaOptionBorderColor }) =>
        cyoaOptionBorderColor ? `#${cyoaOptionBorderColor}` : '',
    },
    cyoaOptionShadow: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The shadow of a CYOA card',
    },
    cyoaOptionShadowHover: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The shadow of a CYOA card when hovered.',
    },
    sidebarHeader: {
      type: new GraphQLNonNull(GuideHeaderSettingsType),
      description: 'The header settings for sidebars',
    },
    borderColor: {
      type: GraphQLString,
      description:
        'The step separator borders and dividers color in HEX format',
      resolve: (organizationSettings) =>
        formatColor(organizationSettings.borderColor),
    },
    stepSeparationStyle: {
      type: StepSeparationStyleType,
      description: 'The Step separation style',
    },
    inlineContextualStyle: {
      type: InlineContextualStyleType,
      description: 'The Inline contextual style',
    },
    additionalColors: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AdditionalColorsType))
      ),
      description: 'Additional branding colors of an org',
    },
    allGuidesStyle: {
      type: new GraphQLNonNull(AllGuidesStyleType),
    },
    sidebarBlocklistedUrls: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      description: 'URLs where the sidebar component shoud not appear',
    },
    quickLinks: {
      type: new GraphQLNonNull(QuickLinksType),
      description: 'Quick links defined by the org',
    },
    helpCenter: {
      type: HelpCenterType,
      description: 'Help center settings for the org',
    },
    helpCenterStyle: {
      type: new GraphQLNonNull(HelpCenterStyleType),
      description: 'Help center styles for the org',
    },
    tooltipsStyle: {
      type: TooltipsStyleStyleType,
      description: 'The org tooltips styles',
    },
    ctasStyle: {
      type: CtasStyleStyleType,
      description: 'The org cta styles',
    },
    modalsStyle: {
      type: ModalsStyleStyleType,
      description: 'The org modals styles',
    },
    bannersStyle: {
      type: BannersStyleStyleType,
      description: 'The org banners styles',
    },
    responsiveVisibility: {
      type: ResponsiveVisibilityType,
      description: 'The responsive settings for the embed in narrow containers',
    },
  }),
});
