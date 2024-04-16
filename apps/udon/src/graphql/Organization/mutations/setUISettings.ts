import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import tinycolor from 'tinycolor2';
import { OrgAdditionalColor, Theme } from 'bento-common/types';
import {
  AdditionalColorsInputType,
  AllGuidesStyleInputType,
  GuideHeaderSettingsInputType,
  InlineContextualStyleInputType,
  InlineEmptyBehaviourType,
  SidebarVisibilityType,
  StepSeparationStyleInputType,
  QuickLinksInputType,
  HelpCenterInputType,
  EmbedToggleBehaviorType,
  TagVisibilityType,
  ModalsStyleStyleInputType,
  TooltipsStyleStyleInputType,
  BannersStyleStyleInputType,
  HelpCenterStyleInputType,
  ResponsiveVisibilityInputType,
  VisualTagPulseLevelType,
  CtasStyleStyleInputType,
  SidebarAvailabilityType,
} from 'bento-common/graphql/organizationSettings';

import generateMutation from 'src/graphql/helpers/generateMutation';
import { ThemeType } from '../Organization.graphql';
import { BRIGHT_COLOR_THRESHOLD } from 'src/utils/constants';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import {
  EmbedToggleBehavior,
  InlineEmptyBehaviour,
  SidebarAvailability,
  SidebarVisibility,
} from 'bento-common/types/shoyuUIState';
import { maxAdditionalColors } from 'bento-common/data/helpers';
import { orgSettingsDefaults } from 'bento-common/data/orgSettingsDefaults';
import { OrganizationUISettingsType } from '../OrganizationUISettings.graphql';

interface ValidatedColorProps {
  colorHex: string | null;
  shouldBeDark?: boolean;
  label: string;
  isRequired?: boolean;
}

const validatedColor = ({
  colorHex,
  shouldBeDark,
  label,
  isRequired,
}: ValidatedColorProps): { value: string | null; errors?: string[] } => {
  if (!isRequired && !colorHex) return { value: colorHex };

  const parsedColor = tinycolor(colorHex as string);

  if (!parsedColor.isValid()) {
    return {
      value: null,
      errors: [`${label} color is not valid`],
    };
  }

  if (shouldBeDark && parsedColor.getBrightness() > BRIGHT_COLOR_THRESHOLD) {
    return {
      value: null,
      errors: [`${label} color should be darker`],
    };
  }

  const withAlpha = !parsedColor.toHex8String().toLowerCase().endsWith('ff');
  return {
    value: withAlpha ? parsedColor.toHex8String() : parsedColor.toHexString(),
  };
};

/**
 * Utility used to deconstruct numeric values.
 * @param fieldName Name of field to deconstruct.
 * @param value
 * @returns Object with numeric value or empty object.
 */
const numberObject = (fieldName: string, value: number) => {
  return Number.isNaN(Number(value)) ? {} : { [fieldName]: value };
};

/**
 * Utility used to deconstruct values.
 * @param fieldName Name of field to deconstruct.
 * @param value
 * @returns Object with string value or empty object.
 */
const valueObject = (fieldName: string, value: any) => {
  return value ? { [fieldName]: value } : {};
};

const sanitizeColorHex = (colorHex: string | null): string | null => {
  if (!colorHex) {
    return null;
  }

  if (colorHex.indexOf('#') > -1) {
    return colorHex.replace('#', '');
  }

  return colorHex;
};

export default generateMutation({
  name: 'SetUISettings',
  inputFields: {
    primaryColorHex: {
      type: GraphQLString,
    },
    secondaryColorHex: {
      type: GraphQLString,
    },
    fontColorHex: {
      type: GraphQLString,
    },
    toggleStyle: {
      type: GraphQLString,
    },
    toggleColorHex: {
      type: GraphQLString,
    },
    toggleText: {
      type: GraphQLString,
    },
    toggleTextColor: {
      type: GraphQLString,
    },
    sidebarSide: {
      type: GraphQLString,
    },
    embedToggleBehavior: {
      type: EmbedToggleBehaviorType,
    },
    sidebarStyle: {
      type: GraphQLString,
    },
    appContainerIdentifier: {
      type: GraphQLString,
    },
    embedCustomCss: {
      type: GraphQLString,
    },
    embedBackgroundHex: {
      type: GraphQLString,
    },
    sidebarBackgroundColor: {
      type: GraphQLString,
    },
    cardBackgroundColor: {
      type: GraphQLString,
    },
    isEmbedToggleColorInverted: {
      type: GraphQLBoolean,
    },
    tagPrimaryColor: {
      type: GraphQLString,
    },
    tagTextColor: {
      type: GraphQLString,
    },
    tagDotSize: {
      type: GraphQLFloat,
    },
    tagPulseLevel: {
      type: VisualTagPulseLevelType,
    },
    tagBadgeIconPadding: {
      type: GraphQLFloat,
    },
    tagBadgeIconBorderRadius: {
      type: GraphQLFloat,
    },
    tagShadow: {
      type: GraphQLString,
    },
    tagCustomIconUrl: {
      type: GraphQLString,
    },
    tagVisibility: {
      type: TagVisibilityType,
    },
    paragraphFontSize: {
      type: GraphQLFloat,
    },
    paragraphLineHeight: {
      type: GraphQLFloat,
    },
    cyoaBackgroundColor: {
      type: GraphQLString,
    },
    cyoaOptionBackgroundColor: {
      type: GraphQLString,
    },
    cyoaTextColor: {
      type: GraphQLString,
    },
    theme: {
      type: ThemeType,
    },
    floatingAnchorXOffset: {
      type: GraphQLFloat,
    },
    floatingAnchorYOffset: {
      type: GraphQLFloat,
    },
    stepCompletionStyle: {
      type: GraphQLString,
    },
    cyoaOptionBorderColor: {
      type: GraphQLString,
    },
    cyoaOptionShadow: {
      type: GraphQLString,
    },
    cyoaOptionShadowHover: {
      type: GraphQLString,
    },
    sidebarHeader: {
      type: GuideHeaderSettingsInputType,
    },
    inlineEmptyBehaviour: {
      type: InlineEmptyBehaviourType,
    },
    sidebarVisibility: {
      type: SidebarVisibilityType,
    },
    sidebarAvailability: {
      type: SidebarAvailabilityType,
    },
    borderColor: {
      type: GraphQLString,
    },
    stepSeparationStyle: {
      type: StepSeparationStyleInputType,
    },
    inlineContextualStyle: {
      type: InlineContextualStyleInputType,
    },
    additionalColors: {
      type: new GraphQLList(new GraphQLNonNull(AdditionalColorsInputType)),
    },
    allGuidesStyle: {
      type: AllGuidesStyleInputType,
    },
    sidebarBlocklistedUrls: {
      type: new GraphQLList(GraphQLString),
    },
    quickLinks: { type: new GraphQLNonNull(QuickLinksInputType) },
    helpCenter: { type: HelpCenterInputType },
    helpCenterStyle: { type: HelpCenterStyleInputType },
    modalsStyle: {
      type: ModalsStyleStyleInputType,
    },
    tooltipsStyle: {
      type: TooltipsStyleStyleInputType,
    },
    ctasStyle: {
      type: CtasStyleStyleInputType,
    },
    bannersStyle: {
      type: BannersStyleStyleInputType,
    },
    responsiveVisibility: {
      type: ResponsiveVisibilityInputType,
    },
  },
  outputFields: {
    uiSettings: {
      type: OrganizationUISettingsType,
    },
  },
  /**
   * @todo replace manual validations by yup
   */
  mutateAndGetPayload: async (args, { organization }) => {
    const colorsToValidate = {
      primaryColorHex: {
        label: 'Primary',
        isRequired: true,
        shouldBeDark: true,
      },
      fontColorHex: {
        label: 'Font',
      },
      borderColor: {
        label: 'Border',
        isRequired: true,
      },
      secondaryColorHex: {
        label: 'Secondary',
      },
      toggleColorHex: {
        label: 'Toggle',
        isRequired: true,
        shouldBeDark: true,
      },
      toggleTextColor: {
        label: 'Toggle text color',
        isRequired: true,
      },
      embedBackgroundHex: {
        label: 'Embeddable background',
      },
      sidebarBackgroundColor: {
        label: 'Sidebar background',
      },
      cardBackgroundColor: {
        label: 'Embeddable card background',
      },
      tagPrimaryColor: {
        label: 'Tag primary color',
      },
      tagTextColor: {
        label: 'Tag text color',
      },
      cyoaBackgroundColor: {
        label: 'CYOA background color',
      },
      cyoaOptionBackgroundColor: {
        label: 'CYOA card background color',
      },
      cyoaTextColor: {
        label: 'CYOA text color',
      },
      cyoaOptionBorderColor: {
        label: 'CYOA border color',
      },
    };

    const validatedColorValues: Partial<
      Record<keyof typeof colorsToValidate, string>
    > = {};
    for (const [colorKey, colorSettings] of Object.entries(colorsToValidate)) {
      const validatedColorResult = validatedColor({
        ...colorSettings,
        colorHex: args[colorKey],
      });
      if (validatedColorResult?.errors)
        return { errors: validatedColorResult.errors };
      else validatedColorValues[colorKey] = validatedColorResult.value;
    }

    for (const additionalColor in (args.additionalColors ||
      []) as OrgAdditionalColor[]) {
      const colorHex =
        (additionalColor as unknown as OrgAdditionalColor).value || '';
      const validatedAdditionalColor = validatedColor({
        label: `Additional color: ${colorHex}`,
        colorHex: colorHex,
      });
      if (validatedAdditionalColor?.errors)
        return { errors: validatedAdditionalColor.errors };
    }

    const [, [updatedUISettings]] = await OrganizationSettings.update(
      {
        theme: args.theme || Theme.nested,
        floatingAnchorXOffset: args.floatingAnchorXOffset || 0,
        floatingAnchorYOffset: args.floatingAnchorYOffset || 0,
        primaryColorHex: sanitizeColorHex(
          validatedColorValues.primaryColorHex!
        ),
        fontColorHex: sanitizeColorHex(validatedColorValues.fontColorHex!),
        borderColor: sanitizeColorHex(validatedColorValues.borderColor!),
        secondaryColorHex: sanitizeColorHex(
          validatedColorValues.secondaryColorHex!
        ),
        embedBackgroundHex: sanitizeColorHex(
          validatedColorValues.embedBackgroundHex!
        ),
        sidebarBackgroundColor: sanitizeColorHex(
          validatedColorValues.sidebarBackgroundColor!
        ),
        cardBackgroundColor: sanitizeColorHex(
          validatedColorValues.cardBackgroundColor!
        ),
        embedToggleStyle: args.toggleStyle,
        embedToggleColorHex: sanitizeColorHex(args.toggleColorHex),
        embedToggleText: args.toggleText,
        toggleTextColor: sanitizeColorHex(
          validatedColorValues.toggleTextColor! ||
            orgSettingsDefaults.toggleTextColor
        ),
        embedSidebarSide: args.sidebarSide,
        sidebarStyle: args.sidebarStyle,
        appContainerIdentifier: args.appContainerIdentifier,
        embedCustomCss: args.embedCustomCss,
        isEmbedToggleColorInverted: args.isEmbedToggleColorInverted,
        ...valueObject(
          'tagPrimaryColor',
          sanitizeColorHex(validatedColorValues.tagPrimaryColor!)
        ),
        ...valueObject(
          'tagTextColor',
          sanitizeColorHex(validatedColorValues.tagTextColor!)
        ),
        ...numberObject('tagDotSize', args.tagDotSize),
        ...numberObject('tagBadgeIconPadding', args.tagBadgeIconPadding),
        ...numberObject(
          'tagBadgeIconBorderRadius',
          args.tagBadgeIconBorderRadius
        ),
        tagPulseLevel: args.tagPulseLevel || orgSettingsDefaults.tagPulseLevel,
        tagCustomIconUrl: args.tagCustomIconUrl || null,
        tagVisibility: args.tagVisibility,
        ...numberObject('paragraphFontSize', args.paragraphFontSize),
        ...numberObject('paragraphLineHeight', args.paragraphLineHeight),
        ...valueObject(
          'cyoaBackgroundColor',
          sanitizeColorHex(validatedColorValues.cyoaBackgroundColor!)
        ),
        ...valueObject(
          'cyoaOptionBackgroundColor',
          sanitizeColorHex(validatedColorValues.cyoaOptionBackgroundColor!)
        ),
        ...valueObject(
          'cyoaTextColor',
          sanitizeColorHex(validatedColorValues.cyoaTextColor!)
        ),
        stepCompletionStyle: args.stepCompletionStyle,
        cyoaOptionBorderColor: sanitizeColorHex(
          validatedColorValues.cyoaOptionBorderColor!
        ),
        cyoaOptionShadow: args.cyoaOptionShadow || '',
        cyoaOptionShadowHover: args.cyoaOptionShadowHover || '',
        sidebarHeader: args.sidebarHeader || orgSettingsDefaults.sidebarHeader,
        stepSeparationStyle: args.stepSeparationStyle || null,
        inlineContextualStyle: args.inlineContextualStyle,
        additionalColors: (args.additionalColors || []).slice(
          0,
          maxAdditionalColors
        ),
        inlineEmptyBehaviour:
          args.inlineEmptyBehaviour || InlineEmptyBehaviour.hide,
        sidebarVisibility: args.sidebarVisibility || SidebarVisibility.show,
        sidebarAvailability:
          args.sidebarAvailability || SidebarAvailability.default,
        embedToggleBehavior:
          args.embedToggleBehavior || EmbedToggleBehavior.default,
        sidebarBlocklistedUrls: args.sidebarBlocklistedUrls || [],
        allGuidesStyle:
          args.allGuidesStyle || orgSettingsDefaults.allGuidesStyle,
        quickLinks: args.quickLinks,
        helpCenter: args.helpCenter,
        helpCenterStyle: args.helpCenterStyle,
        tooltipsStyle: args.tooltipsStyle,
        ctasStyle: args.ctasStyle,
        modalsStyle: args.modalsStyle
          ? {
              ...args.modalsStyle,
              backgroundOverlayOpacity: args.modalsStyle
                ?.backgroundOverlayOpacity
                ? args.modalsStyle.backgroundOverlayOpacity / 100
                : orgSettingsDefaults.modalsStyle.backgroundOverlayOpacity,
            }
          : args.modalsStyle,
        bannersStyle: args.bannersStyle,
        responsiveVisibility: args.responsiveVisibility,
      },
      {
        where: {
          organizationId: organization.id,
        },
        returning: true,
      }
    );

    return {
      uiSettings: updatedUISettings,
    };
  },
});
