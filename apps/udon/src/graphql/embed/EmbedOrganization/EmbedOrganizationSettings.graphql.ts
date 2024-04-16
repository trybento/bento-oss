import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import tinycolor from 'tinycolor2';
import {
  AdditionalColorsType,
  AllGuidesStyleType,
  BannersStyleStyleType,
  CtasStyleStyleType,
  EmbedToggleBehaviorType,
  GuideHeaderSettingsType,
  HelpCenterStyleType,
  HelpCenterType,
  InlineContextualStyleType,
  InlineEmptyBehaviourType,
  ModalsStyleStyleType,
  QuickLinksType,
  ResponsiveVisibilityType,
  SidebarAvailabilityType,
  SidebarVisibilityType,
  StepSeparationStyleType,
  TagVisibilityType,
  TooltipsStyleStyleType,
  VisualTagPulseLevelType,
} from 'bento-common/graphql/organizationSettings';
import { interpolateAttributes } from 'bento-common/data/helpers';
import { isTransparent } from 'bento-common/utils/color';
import { AllGuidesStyle, IntegrationType } from 'bento-common/types';
import { ZendeskOptions } from 'bento-common/types/integrations';
import { TAG_PRIMARY_COLOR_BRIGHTNESS } from 'bento-common/frontend/constants';

import { DARK_COLOR_THRESHOLD } from 'src/utils/constants';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { ThemeType } from 'src/graphql/Organization/Organization.graphql';
import { EmbedContext } from 'src/graphql/types';
import { formatColor } from 'src/utils/helpers';
import { fetchAndMapDynamicAttributes } from 'src/interactions/replaceDynamicAttributes';
import { dynamicAttributesResolver } from 'src/graphql/embed/resolvers';
import { IntegrationApiKey } from 'src/data/models/IntegrationApiKey.model';

const allGuidesDynamicFields = [
  'allGuidesTitle',
  'activeGuidesTitle',
  'previousGuidesTitle',
  'previousAnnouncementsTitle',
].reduce((a, k) => {
  a[k] = true;
  return a;
}, {} as Record<keyof AllGuidesStyle, boolean>);

export const EmbedOrganizationUISettingsType = new GraphQLObjectType<
  OrganizationSettings,
  EmbedContext
>({
  name: 'EmbedOrganizationUISettings',
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
    sidebarBackgroundColor: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The sidebar background color of this organization',
      resolve: (organizationSettings) =>
        formatColor(organizationSettings.sidebarBackgroundColor),
    },
    backgroundColor: {
      type: GraphQLString,
      description: 'The embeddable background color of this organization',
      resolve: (organizationSettings) =>
        organizationSettings.embedBackgroundHex
          ? `#${organizationSettings.embedBackgroundHex}`
          : '#FFFFFF',
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
    toggleColorHex: {
      type: GraphQLString,
      description: 'The color used for the sidebar toggle button in HEX format',
      resolve: (organizationSettings) =>
        formatColor(
          organizationSettings.embedToggleColorHex ||
            organizationSettings.primaryColorHex
        ),
    },
    toggleTextColor: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The color used for the sidebar text toggle button in HEX format',
      resolve: (organizationSettings) =>
        formatColor(organizationSettings.toggleTextColor),
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
    sidebarStyle: {
      type: GraphQLString,
      description: 'The style of the sidebar',
      resolve: (organizationSettings) => organizationSettings.sidebarStyle,
    },
    isEmbedToggleColorInverted: {
      type: GraphQLBoolean,
      description: 'Whether the toggles color is inverted of the organization',
      resolve: (organizationSettings) =>
        `${organizationSettings.isEmbedToggleColorInverted}` === 'true',
    },
    appContainerIdentifier: {
      type: GraphQLString,
      description: `The container's identifier of the organization's app`,
      resolve: (organizationSettings) =>
        organizationSettings.appContainerIdentifier,
    },
    embedCustomCss: {
      type: GraphQLString,
      description: 'Custom CSS rules set by the organization',
      resolve: (organizationSettings) => organizationSettings.embedCustomCss,
    },
    isFontColorDark: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether the font color is dark',
      resolve: (organizationSettings) =>
        !!organizationSettings.fontColorHex &&
        tinycolor(organizationSettings.fontColorHex).getBrightness() <
          DARK_COLOR_THRESHOLD,
    },
    isSecondaryColorDark: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether the secondary color is dark',
      resolve: (organizationSettings) =>
        !!organizationSettings.secondaryColorHex &&
        tinycolor(organizationSettings.secondaryColorHex).getBrightness() <
          DARK_COLOR_THRESHOLD,
    },
    isBackgroundDark: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether the background color is dark',
      resolve: ({ embedBackgroundHex }) =>
        !!embedBackgroundHex &&
        !isTransparent(embedBackgroundHex) &&
        tinycolor(embedBackgroundHex).getBrightness() < DARK_COLOR_THRESHOLD,
    },
    isSidebarBackgroundDark: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether the sidebar background color is dark',
      resolve: ({ sidebarBackgroundColor }) =>
        !!sidebarBackgroundColor &&
        !isTransparent(sidebarBackgroundColor) &&
        tinycolor(sidebarBackgroundColor).getBrightness() <
          DARK_COLOR_THRESHOLD,
    },
    isSidebarAutoOpenOnFirstViewDisabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'If the viewer has not seen a guide before and the sidebar is present, is the auto-open functionality disabled',
      resolve: (_, _args, { accountUser }) =>
        !accountUser.properties || accountUser.properties.onboardedSidebar,
    },
    tagLightPrimaryColor: {
      type: GraphQLString,
      description: 'A brigther tone of the primary color for contextual tags',
      resolve: (organizationSettings) =>
        tinycolor(`#${organizationSettings.tagPrimaryColor || 'FFFFFF'}`)
          .lighten(TAG_PRIMARY_COLOR_BRIGHTNESS)
          .toString(),
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
      resolve: async (organizationSettings, _, { account, accountUser }) => {
        const attrs = await fetchAndMapDynamicAttributes(account, accountUser);

        return Object.entries(organizationSettings.allGuidesStyle).reduce(
          (result, [k, v]) => {
            result[k] =
              v && allGuidesDynamicFields[k]
                ? interpolateAttributes(v, attrs)
                : v;
            return result;
          },
          {} as AllGuidesStyle
        );
      },
    },
    sidebarBlocklistedUrls: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      description: 'URLs where the sidebar component shoud not appear',
      resolve: async (settings, _args, { account, accountUser }) =>
        settings.sidebarBlocklistedUrls &&
        settings.sidebarBlocklistedUrls.map((url) =>
          dynamicAttributesResolver(url, account, accountUser)
        ),
    },
    quickLinks: {
      type: new GraphQLNonNull(QuickLinksType),
      description: 'Quick links defined by the org',
    },
    ticketCreationEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'If creating issues/tickets via integration is enabled',
      resolve: async (_settings, _, { loaders, accountUser, organization }) => {
        const integrations =
          await loaders.integrationsForAccountUserLoader.load(accountUser);
        const zendeskIntegration = integrations.find(
          (integration) => integration.type === IntegrationType.zendesk
        ) as IntegrationApiKey<ZendeskOptions>;

        const orgSettings =
          await loaders.organizationSettingsOfOrganizationLoader.load(
            organization.id
          );

        return (
          !!orgSettings?.helpCenter?.issueSubmission && !!zendeskIntegration
        );
      },
    },
    zendeskChatEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether Zendesk chat is enabled',
      resolve: async (_settings, _, { loaders, accountUser, organization }) => {
        const integrations =
          await loaders.integrationsForAccountUserLoader.load(accountUser);
        const zendeskIntegration = integrations.find(
          (integration) => integration.type === IntegrationType.zendesk
        ) as IntegrationApiKey<ZendeskOptions>;

        const orgSettings =
          await loaders.organizationSettingsOfOrganizationLoader.load(
            organization.id
          );

        return !!orgSettings?.helpCenter?.liveChat && !!zendeskIntegration;
      },
    },
    kbSearchEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether (currently, Zendesk) kb search is enabled',
      resolve: async (_settings, _, { loaders, accountUser }) => {
        const integrations =
          await loaders.integrationsForAccountUserLoader.load(accountUser);
        const zendeskIntegration = integrations.find(
          (integration) => integration.type === IntegrationType.zendesk
        ) as IntegrationApiKey<ZendeskOptions>;

        return !!zendeskIntegration?.options?.kbSearch;
      },
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
    ctasStyle: { type: CtasStyleStyleType, description: 'The org cta styles' },
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
