import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { EnumColumn } from 'bento-common/utils/sequelize';
import { orgSettingsDefaults } from 'bento-common/data/orgSettingsDefaults';
import {
  AllGuidesStyle,
  BannersStyle,
  CompletionStyle,
  CtasStyle,
  EmbedSidebarSide,
  EmbedToggleStyle,
  GuideHeaderSettings,
  HelpCenter,
  HelpCenterStyle,
  InlineContextualStyle,
  ModalsStyle,
  OrgAdditionalColor,
  QuickLinks,
  ResponsiveVisibility,
  SidebarStyle,
  StepSeparationStyle,
  TagVisibility,
  Theme,
  TooltipsStyle,
  VisualTagPulseLevel,
} from 'bento-common/types';
import {
  EmbedToggleBehavior,
  InlineEmptyBehaviour,
  SidebarAvailability,
  SidebarVisibility,
} from 'bento-common/types/shoyuUIState';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Organization } from './Organization.model';

export const getOrgSettings = async (organization: Organization) =>
  organization.organizationSettings ||
  (await organization.$get('organizationSettings'));

export function sidebarBlocklistedUrlsGetter(
  this: OrganizationSettings
): string[] {
  return this.getDataValue('sidebarBlocklistedUrls') || [];
}

export function sidebarBlocklistedUrlsSetter(
  this: OrganizationSettings,
  values: Array<null | undefined | string>
) {
  this.setDataValue('sidebarBlocklistedUrls', values.filter(Boolean));
}

@Table({ schema: 'core', tableName: 'organization_settings' })
export class OrganizationSettings extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @AllowNull(false)
  @Default(orgSettingsDefaults.primaryColorHex)
  @Column({ field: 'primary_color_hex', type: DataType.TEXT })
  readonly primaryColorHex!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.secondaryColorHex)
  @Column({ field: 'secondary_color_hex', type: DataType.TEXT })
  readonly secondaryColorHex!: string;

  @AllowNull(true)
  @Column({ field: 'embed_font_color_hex', type: DataType.TEXT })
  readonly fontColorHex?: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.sidebarBackgroundColor)
  @Column({ field: 'sidebar_background_color', type: DataType.TEXT })
  readonly sidebarBackgroundColor!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.embedBackgroundHex)
  @Column({ field: 'embed_background_hex', type: DataType.TEXT })
  readonly embedBackgroundHex!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.cardBackgroundColor)
  @Column({ field: 'card_background_color', type: DataType.TEXT })
  readonly cardBackgroundColor!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.embedToggleStyle)
  @EnumColumn('embed_toggle_style', EmbedToggleStyle)
  readonly embedToggleStyle!: EmbedToggleStyle;

  @AllowNull(false)
  @Default(orgSettingsDefaults.embedToggleBehavior)
  @EnumColumn('embed_toggle_behavior', EmbedToggleBehavior)
  readonly embedToggleBehavior!: EmbedToggleBehavior;

  @AllowNull(false)
  @Default(orgSettingsDefaults.embedToggleColorHex)
  @Column({ field: 'embed_toggle_color_hex', type: DataType.TEXT })
  readonly embedToggleColorHex!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.toggleTextColor)
  @Column({ field: 'toggle_text_color', type: DataType.TEXT })
  readonly toggleTextColor!: string;

  @AllowNull(true)
  @Column({ field: 'embed_toggle_text', type: DataType.TEXT })
  readonly embedToggleText?: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.embedSidebarSide)
  @EnumColumn('embed_sidebar_side', EmbedSidebarSide)
  readonly embedSidebarSide!: EmbedSidebarSide;

  @AllowNull(true)
  @Column({ field: 'app_container_identifier', type: DataType.TEXT })
  readonly appContainerIdentifier?: string;

  @AllowNull(true)
  @Column({ field: 'embed_custom_css', type: DataType.TEXT })
  readonly embedCustomCss?: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.sidebarStyle)
  @EnumColumn('sidebar_style', SidebarStyle)
  readonly sidebarStyle!: SidebarStyle;

  @AllowNull(false)
  @Default(false)
  @Column({ field: 'is_embed_toggle_color_inverted', type: DataType.BOOLEAN })
  readonly isEmbedToggleColorInverted!: boolean;

  @AllowNull(true)
  @Column({ field: 'primary_guide_url', type: DataType.TEXT })
  readonly primaryGuideUrl?: string;

  @AllowNull(true)
  @Column({ field: 'logo_file_name', type: DataType.TEXT })
  readonly logoFileName?: string;

  @AllowNull(true)
  @Column({ field: 'onboarding_url_path', type: DataType.TEXT })
  readonly onboardingUrlPath?: string;

  @AllowNull(true)
  @Column({ field: 'fallback_comments_email', type: DataType.TEXT })
  readonly fallbackCommentsEmail?: string;

  @AllowNull(false)
  @Default(false)
  @Column({ field: 'send_email_notifications', type: DataType.BOOLEAN })
  readonly sendEmailNotifications!: boolean;

  @AllowNull(true)
  @Column({ field: 'google_drive_shared_folder_id', type: DataType.TEXT })
  /** @deprecated remove after D+7 */
  readonly googleDriveSharedFolderId?: string;

  @AllowNull(false)
  @Default(false)
  @Column({ field: 'send_account_user_nudges', type: DataType.BOOLEAN })
  readonly sendAccountUserNudges!: boolean;

  @AllowNull(true)
  @Column({ field: 'default_user_notification_url', type: DataType.STRING })
  readonly defaultUserNotificationURL?: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.tagPrimaryColor)
  @Column({ field: 'tag_primary_color', type: DataType.TEXT })
  readonly tagPrimaryColor!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.tagTextColor)
  @Column({ field: 'tag_text_color', type: DataType.TEXT })
  readonly tagTextColor!: string;

  @AllowNull(false)
  @Default(6)
  @Column({ field: 'tag_dot_size', type: DataType.FLOAT })
  readonly tagDotSize!: number;

  @AllowNull(false)
  @Default(orgSettingsDefaults.tagPulseLevel)
  @EnumColumn('tag_pulse_level', VisualTagPulseLevel)
  readonly tagPulseLevel!: VisualTagPulseLevel;

  @AllowNull(false)
  @Default(0)
  @Column({ field: 'tag_badge_icon_padding', type: DataType.FLOAT })
  readonly tagBadgeIconPadding!: number;

  @AllowNull(false)
  @Default(20)
  @Column({ field: 'tag_badge_icon_border_radius', type: DataType.FLOAT })
  readonly tagBadgeIconBorderRadius!: number;

  @AllowNull(true)
  @Column({ field: 'tag_custom_icon_url', type: DataType.TEXT })
  readonly tagCustomIconUrl?: string;

  @AllowNull(false)
  @Default(TagVisibility.always)
  @EnumColumn('tag_visibility', TagVisibility)
  readonly tagVisibility!: TagVisibility;

  @AllowNull(false)
  @Default(14)
  @Column({ field: 'paragraph_font_size', type: DataType.FLOAT })
  readonly paragraphFontSize!: number;

  @AllowNull(false)
  @Default(20)
  @Column({ field: 'paragraph_line_height', type: DataType.FLOAT })
  readonly paragraphLineHeight!: number;

  @AllowNull(false)
  @Default(orgSettingsDefaults.cyoaBackgroundColor)
  @Column({ field: 'cyoa_background_color', type: DataType.TEXT })
  readonly cyoaBackgroundColor!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.cyoaOptionBackgroundColor)
  @Column({ field: 'cyoa_option_background_color', type: DataType.TEXT })
  readonly cyoaOptionBackgroundColor!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.cyoaTextColor)
  @Column({ field: 'cyoa_text_color', type: DataType.TEXT })
  readonly cyoaTextColor!: string;

  @AllowNull(false)
  @Default(Theme.nested)
  @EnumColumn('theme', Theme)
  readonly theme!: Theme;

  @AllowNull(false)
  @Default(0)
  @Column({ field: 'floating_anchor_x_offset', type: DataType.FLOAT })
  readonly floatingAnchorXOffset!: number;

  @AllowNull(false)
  @Default(0)
  @Column({ field: 'floating_anchor_y_offset', type: DataType.FLOAT })
  readonly floatingAnchorYOffset!: number;

  @AllowNull(false)
  @Default(orgSettingsDefaults.stepCompletionStyle)
  @Column({ field: 'step_completion_style', type: DataType.TEXT })
  readonly stepCompletionStyle!: CompletionStyle;

  @AllowNull(false)
  @Default(true)
  @Column({ field: 'inject_sidebar', type: DataType.BOOLEAN })
  readonly injectSidebar!: boolean;

  @AllowNull(false)
  @Default(orgSettingsDefaults.cyoaOptionBorderColor)
  @Column({ field: 'cyoa_option_border_color', type: DataType.TEXT })
  readonly cyoaOptionBorderColor!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.cyoaOptionShadow)
  @Column({ field: 'cyoa_option_shadow', type: DataType.TEXT })
  readonly cyoaOptionShadow!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.cyoaOptionShadowHover)
  @Column({ field: 'cyoa_option_shadow_hover', type: DataType.TEXT })
  readonly cyoaOptionShadowHover!: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.sidebarHeader)
  @Column({ field: 'sidebar_header', type: DataType.JSONB })
  readonly sidebarHeader?: GuideHeaderSettings;

  @AllowNull(false)
  @Default(orgSettingsDefaults.inlineEmptyBehaviour)
  @EnumColumn('inline_empty_behavior', InlineEmptyBehaviour)
  readonly inlineEmptyBehaviour!: InlineEmptyBehaviour;

  @AllowNull(false)
  @Default(orgSettingsDefaults.sidebarVisibility)
  @EnumColumn('sidebar_visibility', SidebarVisibility)
  readonly sidebarVisibility!: SidebarVisibility;

  @AllowNull(false)
  @Default(orgSettingsDefaults.sidebarAvailability)
  @EnumColumn('sidebar_availability', SidebarAvailability)
  readonly sidebarAvailability!: SidebarAvailability;

  @AllowNull(false)
  @Default(orgSettingsDefaults.borderColor)
  @Column({ field: 'border_color', type: DataType.TEXT })
  readonly borderColor?: string;

  @AllowNull(false)
  @Default(orgSettingsDefaults.stepSeparationStyle)
  @Column({ field: 'step_separation_style', type: DataType.JSONB })
  readonly stepSeparationStyle?: StepSeparationStyle;

  @AllowNull(false)
  @Column({ field: 'inline_contextual_style', type: DataType.JSONB })
  readonly inlineContextualStyle!: InlineContextualStyle;

  @AllowNull(false)
  @Default(orgSettingsDefaults.additionalColors)
  @Column({ field: 'additional_colors', type: DataType.JSONB })
  readonly additionalColors!: OrgAdditionalColor[];

  @AllowNull(true)
  @Column({
    field: 'sidebar_blocklisted_urls',
    type: DataType.JSONB,
    get: sidebarBlocklistedUrlsGetter,
    set: sidebarBlocklistedUrlsSetter,
  })
  readonly sidebarBlocklistedUrls!: string[];

  @AllowNull(false)
  @Column({ field: 'all_guides_style', type: DataType.JSONB })
  readonly allGuidesStyle!: AllGuidesStyle;

  @AllowNull(false)
  @Default([])
  @Column({ field: 'quick_links', type: DataType.JSONB })
  readonly quickLinks!: QuickLinks;

  @AllowNull(true)
  @Column({ field: 'help_center', type: DataType.JSONB })
  readonly helpCenter?: HelpCenter;

  @AllowNull(true)
  @Column({
    field: 'help_center_style',
    type: DataType.JSONB,
    get: function helpCenterStyleGetter(
      this: OrganizationSettings
    ): HelpCenterStyle {
      const { chatTitle, supportTicketTitle } = (this.getDataValue(
        'helpCenterStyle'
      ) || {}) as HelpCenterStyle;

      return {
        chatTitle: chatTitle ?? orgSettingsDefaults.helpCenterStyle.chatTitle,
        supportTicketTitle:
          supportTicketTitle ??
          orgSettingsDefaults.helpCenterStyle.supportTicketTitle,
      };
    },
  })
  readonly helpCenterStyle!: HelpCenterStyle;

  @AllowNull(true)
  @Column({
    field: 'modals_style',
    type: DataType.JSONB,
    get: function modalsStyleGetter(this: OrganizationSettings): ModalsStyle {
      const {
        borderRadius,
        shadow,
        paddingX,
        paddingY,
        backgroundOverlayColor,
        backgroundOverlayOpacity,
      } = (this.getDataValue('modalsStyle') || {}) as Partial<ModalsStyle>;

      return {
        borderRadius:
          borderRadius ?? orgSettingsDefaults.modalsStyle.borderRadius,
        shadow: shadow ?? orgSettingsDefaults.modalsStyle.shadow,
        paddingX: paddingX ?? orgSettingsDefaults.modalsStyle.paddingX,
        paddingY: paddingY ?? orgSettingsDefaults.modalsStyle.paddingY,
        backgroundOverlayColor:
          backgroundOverlayColor ??
          orgSettingsDefaults.modalsStyle.backgroundOverlayColor,
        backgroundOverlayOpacity:
          backgroundOverlayOpacity ??
          orgSettingsDefaults.modalsStyle.backgroundOverlayOpacity,
      };
    },
  })
  readonly modalsStyle!: ModalsStyle;

  @AllowNull(true)
  @Column({
    field: 'banners_style',
    type: DataType.JSONB,
    get: function bannersStyleGetter(this: OrganizationSettings): BannersStyle {
      const { borderRadius, shadow, padding } = (this.getDataValue(
        'bannersStyle'
      ) || {}) as BannersStyle;

      return {
        borderRadius:
          borderRadius ?? orgSettingsDefaults.bannersStyle.borderRadius,
        shadow: shadow ?? orgSettingsDefaults.bannersStyle.shadow,
        padding: padding ?? orgSettingsDefaults.bannersStyle.padding,
      };
    },
  })
  readonly bannersStyle!: ModalsStyle;

  @Column({
    field: 'tooltips_style',
    type: DataType.JSONB,
    get: function tooltipsStyleGetter(
      this: OrganizationSettings
    ): TooltipsStyle {
      const { borderRadius, shadow, paddingX, paddingY } = (this.getDataValue(
        'tooltipsStyle'
      ) || {}) as TooltipsStyle;

      return {
        borderRadius:
          borderRadius ?? orgSettingsDefaults.tooltipsStyle.borderRadius,
        shadow: shadow ?? orgSettingsDefaults.tooltipsStyle.shadow,
        paddingX: paddingX ?? orgSettingsDefaults.tooltipsStyle.paddingX,
        paddingY: paddingY ?? orgSettingsDefaults.tooltipsStyle.paddingY,
      };
    },
  })
  readonly tooltipsStyle!: TooltipsStyle;

  @Column({
    field: 'ctas_style',
    type: DataType.JSONB,
    get: function ctasStyleGetter(this: OrganizationSettings): CtasStyle {
      const { borderRadius, lineHeight, paddingX, paddingY, fontSize } =
        (this.getDataValue('ctasStyle') || {}) as CtasStyle;

      return {
        borderRadius:
          borderRadius ?? orgSettingsDefaults.ctasStyle.borderRadius,
        lineHeight: lineHeight ?? orgSettingsDefaults.ctasStyle.lineHeight,
        paddingX: paddingX ?? orgSettingsDefaults.ctasStyle.paddingX,
        paddingY: paddingY ?? orgSettingsDefaults.ctasStyle.paddingY,
        fontSize: fontSize ?? orgSettingsDefaults.ctasStyle.fontSize,
      };
    },
  })
  readonly ctasStyle!: CtasStyle;

  @AllowNull(true)
  @Column({
    field: 'responsive_visibility',
    type: DataType.JSONB,
    get: function responsiveVisibilityGetter(
      this: OrganizationSettings
    ): ResponsiveVisibility {
      const { all } = (this.getDataValue('responsiveVisibility') ||
        {}) as ResponsiveVisibility;

      return {
        all: all ?? orgSettingsDefaults.responsiveVisibility.all,
      };
    },
  })
  readonly responsiveVisibility!: ResponsiveVisibility;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
