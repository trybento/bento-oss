import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import {
  ActiveStepShadow,
  AllGuidesStyle,
  AnnouncementShadow,
  BannerPadding,
  BannersStyle,
  CtasStyle,
  GuideHeaderCloseIcon,
  GuideHeaderProgressBar,
  GuideHeaderType,
  HelpCenterSource,
  InlineContextualShadow,
  InlineContextualStyle,
  ModalsStyle,
  OrgAdditionalColor,
  StepSeparationStyle,
  StepSeparationType,
  TagVisibility,
  TargetingType,
  TooltipsStyle,
  VisualTagPulseLevel,
} from '../types';
import { InputFieldConfigMap, FieldConfigMap } from '../types/graphql';
import {
  EmbedToggleBehavior,
  InlineEmptyBehaviour,
  ResponsiveVisibilityBehavior,
  SidebarAvailability,
  SidebarVisibility,
} from '../types/shoyuUIState';
import { enumToGraphqlEnum } from '../utils/graphql';
import {
  TargetAttributeRuleFields,
  TargetAttributeRuleInputFields,
} from './targeting';

export const ResponsiveVisibilityBehaviorType = enumToGraphqlEnum({
  name: 'ResponsiveVisibilityBehaviorType',
  enumType: ResponsiveVisibilityBehavior,
});

export const AnnouncementShadowType = enumToGraphqlEnum({
  name: 'AnnouncementShadowType',
  description: 'The box shadow for announcements',
  enumType: AnnouncementShadow,
});

export const BannerPaddingType = enumToGraphqlEnum({
  name: 'BannerPaddingType',
  description: 'The inner padding of banners',
  enumType: BannerPadding,
});

export const InlineEmptyBehaviourType = enumToGraphqlEnum({
  name: 'InlineEmptyBehaviourType',
  description: 'The inline behaviour when no onboarding guides are available',
  enumType: InlineEmptyBehaviour,
});

export const SidebarVisibilityType = enumToGraphqlEnum({
  name: 'SidebarVisibilityType',
  description: 'The toggle visibility under specific conditions',
  enumType: SidebarVisibility,
});

export const SidebarAvailabilityType = enumToGraphqlEnum({
  name: 'SidebarAvailabilityType',
  description: 'Whether or not the sidebar is available to users',
  enumType: SidebarAvailability,
});

export const TagVisibilityType = enumToGraphqlEnum({
  name: 'TagVisibilityType',
  description: 'Determine the visibility behavior of visual tags',
  enumType: TagVisibility,
});

export const VisualTagPulseLevelType = enumToGraphqlEnum({
  name: 'VisualTagPulseLevelType',
  enumType: VisualTagPulseLevel,
});

export const EmbedToggleBehaviorType = enumToGraphqlEnum({
  name: 'EmbedToggleBehaviorType',
  description: 'The behavior of the sidebar toggle',
  enumType: EmbedToggleBehavior,
});

export const GuideHeaderStyleType = enumToGraphqlEnum({
  name: 'GuideHeaderStyleType',
  description: 'Header base style',
  enumType: GuideHeaderType,
});

export const GuideHeaderProgressBarType = enumToGraphqlEnum({
  name: 'GuideHeaderProgressBarType',
  description: 'Header progress bar style',
  enumType: GuideHeaderProgressBar,
});

export const GuideHeaderCloseIconType = enumToGraphqlEnum({
  name: 'GuideHeaderCloseIconType',
  description: 'Header close icon',
  enumType: GuideHeaderCloseIcon,
});

const GuideHeaderSettingsFields = {
  type: {
    type: new GraphQLNonNull(GuideHeaderStyleType),
  },
  progressBar: {
    type: GuideHeaderProgressBarType,
  },
  closeIcon: {
    type: new GraphQLNonNull(GuideHeaderCloseIconType),
  },
  showModuleNameInStepView: {
    type: new GraphQLNonNull(GraphQLBoolean),
  },
};

export const GuideHeaderSettingsType = new GraphQLObjectType({
  name: 'GuideHeaderSettingsType',
  description: 'Guide header settings',
  fields: GuideHeaderSettingsFields,
});

export const GuideHeaderSettingsInputType = new GraphQLInputObjectType({
  name: 'GuideHeaderSettingsInputType',
  fields: GuideHeaderSettingsFields,
});

export const StepSeparationEnumType = enumToGraphqlEnum({
  name: 'StepSeparationType',
  description: 'The Step separation type',
  enumType: StepSeparationType,
});

export const ActiveStepShadowType = enumToGraphqlEnum({
  name: 'ActiveStepShadowType',
  description: 'Shadow style of active steps',
  enumType: ActiveStepShadow,
});

export const InlineContextualShadowType = enumToGraphqlEnum({
  name: 'InlineContextualType',
  description: 'The box shadow for inline contextual guides',
  enumType: InlineContextualShadow,
});

const StepSeparationStyleFields:
  | FieldConfigMap<StepSeparationStyle, any>
  | InputFieldConfigMap = {
  type: {
    type: new GraphQLNonNull(StepSeparationEnumType),
  },
  boxCompleteBackgroundColor: {
    type: GraphQLString,
  },
  boxActiveStepShadow: {
    type: new GraphQLNonNull(ActiveStepShadowType),
  },
  boxBorderRadius: {
    type: new GraphQLNonNull(GraphQLInt),
  },
};

export const StepSeparationStyleType = new GraphQLObjectType({
  name: 'StepSeparationStyleType',
  description: 'The Step separation style',
  fields: StepSeparationStyleFields as FieldConfigMap<StepSeparationStyle, any>,
});

export const StepSeparationStyleInputType = new GraphQLInputObjectType({
  name: 'StepSeparationStyleInputType',
  fields: StepSeparationStyleFields as InputFieldConfigMap,
});

const InlineContextualStyleFields:
  | FieldConfigMap<InlineContextualStyle, any>
  | InputFieldConfigMap = {
  padding: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  shadow: {
    type: new GraphQLNonNull(InlineContextualShadowType),
  },
  borderRadius: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  borderColor: {
    type: GraphQLString,
  },
};

export const InlineContextualStyleType = new GraphQLObjectType({
  name: 'InlineContextualStyleType',
  description: 'The Inline contextual style',
  fields: InlineContextualStyleFields as FieldConfigMap<
    InlineContextualStyle,
    any
  >,
});

export const InlineContextualStyleInputType = new GraphQLInputObjectType({
  name: 'InlineContextualStyleInputType',
  fields: InlineContextualStyleFields as InputFieldConfigMap,
});

const IntegrationTargetingRuleInputType = new GraphQLInputObjectType({
  name: 'IntegrationTargetingRuleInput',
  description: 'An integration targeting attribute rule',
  fields: TargetAttributeRuleInputFields,
});

export const IntegrationTargetingTypeType = enumToGraphqlEnum({
  name: 'IntegrationTargetingType',
  description: 'The rule type of rules for an integration',
  enumType: TargetingType,
});

const IntegrationTargetingSegmentInputType = new GraphQLInputObjectType({
  name: 'IntegrationTargetingSegmentInput',
  description: 'Integration targeting segment',
  fields: {
    type: {
      type: new GraphQLNonNull(IntegrationTargetingTypeType),
    },
    rules: {
      type: new GraphQLList(IntegrationTargetingRuleInputType),
    },
    grouping: {
      type: GraphQLString,
    },
  },
});

export const CommonTargetingInputType = new GraphQLInputObjectType({
  name: 'IntegrationTargetingInput',
  description: 'Account and account user targeting for integrations',
  fields: {
    account: {
      type: new GraphQLNonNull(IntegrationTargetingSegmentInputType),
    },
    accountUser: {
      type: new GraphQLNonNull(IntegrationTargetingSegmentInputType),
    },
  },
});

const AdditionalColorsFields = {
  value: {
    type: new GraphQLNonNull(GraphQLString),
  },
};

export const AdditionalColorsType = new GraphQLObjectType({
  name: 'AdditionalColorsType',
  description: 'Additional branding colors of an org',
  fields: AdditionalColorsFields as FieldConfigMap<OrgAdditionalColor, any>,
});

export const AdditionalColorsInputType = new GraphQLInputObjectType({
  name: 'AdditionalColorsInputType',
  fields: AdditionalColorsFields,
});

const AllGuidesStyleFields = {
  allGuidesTitle: {
    type: new GraphQLNonNull(GraphQLString),
  },
  activeGuidesTitle: {
    type: new GraphQLNonNull(GraphQLString),
  },
  previousGuidesTitle: {
    type: new GraphQLNonNull(GraphQLString),
  },
  previousAnnouncementsTitle: {
    type: new GraphQLNonNull(GraphQLString),
  },
};

export const AllGuidesStyleType = new GraphQLObjectType({
  name: 'AllGuidesStyleType',
  fields: AllGuidesStyleFields as FieldConfigMap<AllGuidesStyle, any>,
});

export const AllGuidesStyleInputType = new GraphQLInputObjectType({
  name: 'AllGuidesStyleInputType',
  fields: AllGuidesStyleFields,
});

const QuickLinkFields = {
  url: { type: new GraphQLNonNull(GraphQLString) },
  title: { type: new GraphQLNonNull(GraphQLString) },
  icon: { type: GraphQLString },
};

export const QuickLinkType = new GraphQLObjectType({
  name: 'QuickLink',
  fields: QuickLinkFields,
});
export const QuickLinkInputType = new GraphQLInputObjectType({
  name: 'QuickLinkInput',
  fields: QuickLinkFields,
});
export const QuickLinksType = new GraphQLList(QuickLinkType);
export const QuickLinksInputType = new GraphQLList(QuickLinkInputType);

/** @deprecated use TargetsType-related definitions */
export const IntegrationTargetingRuleType = new GraphQLObjectType({
  name: 'IntegrationTargetingRule',
  description: 'An integration targeting attribute rule',
  fields: TargetAttributeRuleFields,
});

/** @deprecated use TargetsType-related definitions */
export const IntegrationTargetingSegmentType = new GraphQLObjectType({
  name: 'IntegrationTargetingSegment',
  description: 'Integration targeting segment',
  fields: {
    type: {
      type: new GraphQLNonNull(IntegrationTargetingTypeType),
    },
    rules: {
      type: new GraphQLList(IntegrationTargetingRuleType),
    },
    grouping: {
      type: GraphQLString,
    },
  },
});

/** @deprecated use TargetsType-related definitions */
export const CommonTargetingType = new GraphQLObjectType({
  name: 'CommonTargeting',
  description: 'Account and account user targeting',
  fields: {
    account: {
      type: new GraphQLNonNull(IntegrationTargetingSegmentType),
    },
    accountUser: {
      type: new GraphQLNonNull(IntegrationTargetingSegmentType),
    },
  },
});

export const HelpCenterSourceType = enumToGraphqlEnum({
  name: 'HelpCenterSource',
  description: 'The help center used by the org',
  enumType: HelpCenterSource,
});

const HelpCenterFields = {
  source: { type: new GraphQLNonNull(HelpCenterSourceType) },
  url: { type: GraphQLString },
  liveChat: { type: GraphQLBoolean },
  issueSubmission: { type: GraphQLBoolean },
  kbSearch: { type: GraphQLBoolean },
  /** @todo use TargetsType to support group targeting */
  targeting: { type: CommonTargetingType },
};

export const HelpCenterType = new GraphQLObjectType({
  name: 'HelpCenter',
  fields: HelpCenterFields,
});

export const HelpCenterInputType = new GraphQLInputObjectType({
  name: 'HelpCenterInput',
  fields: {
    ...HelpCenterFields,
    /** Todo: use IntegrationTargetingInputType */
    targeting: { type: GraphQLJSON },
  },
});

export const HelpCenterStyleType = new GraphQLObjectType({
  name: 'HelpCenterStyle',
  fields: {
    supportTicketTitle: { type: GraphQLString },
    chatTitle: { type: GraphQLString },
  },
});

export const HelpCenterStyleInputType = new GraphQLInputObjectType({
  name: 'HelpCenterStyleInput',
  fields: {
    supportTicketTitle: { type: GraphQLString },
    chatTitle: { type: GraphQLString },
  },
});

export const ModalsStyleStyleType = new GraphQLObjectType({
  name: 'ModalsStyleStyleType',
  description: 'The org modals styles',
  fields: {
    paddingX: {
      type: GraphQLInt,
    },
    paddingY: {
      type: GraphQLInt,
    },
    shadow: {
      type: AnnouncementShadowType,
    },
    borderRadius: {
      type: GraphQLInt,
    },
    backgroundOverlayColor: {
      type: GraphQLString,
    },
    backgroundOverlayOpacity: {
      type: GraphQLInt,
      resolve: (style: ModalsStyle) => style.backgroundOverlayOpacity * 100,
    },
  },
});

export const ModalsStyleStyleInputType = new GraphQLInputObjectType({
  name: 'ModalsStyleStyleInputType',
  fields: {
    paddingX: {
      type: GraphQLInt,
    },
    paddingY: {
      type: GraphQLInt,
    },
    shadow: {
      type: AnnouncementShadowType,
    },
    borderRadius: {
      type: GraphQLInt,
    },
    backgroundOverlayColor: {
      type: GraphQLString,
    },
    backgroundOverlayOpacity: {
      type: GraphQLInt,
    },
  },
});

const BannersStyleFields:
  | FieldConfigMap<BannersStyle, any>
  | InputFieldConfigMap = {
  padding: {
    type: BannerPaddingType,
  },
  shadow: {
    type: AnnouncementShadowType,
  },
  borderRadius: {
    type: GraphQLInt,
  },
};

export const BannersStyleStyleType = new GraphQLObjectType({
  name: 'BannersStyleStyleType',
  description: 'The org banners styles',
  fields: BannersStyleFields as FieldConfigMap<BannersStyle, any>,
});

export const BannersStyleStyleInputType = new GraphQLInputObjectType({
  name: 'BannersStyleStyleInputType',
  fields: BannersStyleFields as InputFieldConfigMap,
});

const TooltipsStyleFields:
  | FieldConfigMap<TooltipsStyle, any>
  | InputFieldConfigMap = {
  paddingX: {
    type: GraphQLInt,
  },
  paddingY: {
    type: GraphQLInt,
  },
  shadow: {
    type: AnnouncementShadowType,
  },
  borderRadius: {
    type: GraphQLInt,
  },
};

export const TooltipsStyleStyleType = new GraphQLObjectType({
  name: 'TooltipsStyleStyleType',
  description: 'The org tooltips styles',
  fields: TooltipsStyleFields as FieldConfigMap<TooltipsStyle, any>,
});

export const TooltipsStyleStyleInputType = new GraphQLInputObjectType({
  name: 'TooltipsStyleStyleInputType',
  fields: TooltipsStyleFields as InputFieldConfigMap,
});

const CtasStyleFields: FieldConfigMap<CtasStyle, any> | InputFieldConfigMap = {
  paddingX: {
    type: GraphQLInt,
  },
  paddingY: {
    type: GraphQLInt,
  },
  fontSize: {
    type: GraphQLInt,
  },
  lineHeight: {
    type: GraphQLInt,
  },
  borderRadius: {
    type: GraphQLInt,
  },
};

export const CtasStyleStyleType = new GraphQLObjectType({
  name: 'CtasStyleStyleType',
  description: 'The org cta styles',
  fields: CtasStyleFields as FieldConfigMap<CtasStyle, any>,
});

export const CtasStyleStyleInputType = new GraphQLInputObjectType({
  name: 'CtasStyleStyleInputType',
  fields: CtasStyleFields as InputFieldConfigMap,
});

export const ResponsiveVisibilityType = new GraphQLObjectType({
  name: 'ResponsiveVisibilityType',
  description: 'The responsive settings for the embed in narrow containers',
  fields: {
    all: {
      type: new GraphQLNonNull(ResponsiveVisibilityBehaviorType),
    },
  },
});

export const ResponsiveVisibilityInputType = new GraphQLInputObjectType({
  name: 'ResponsiveVisibilityInputType',
  fields: {
    all: {
      type: ResponsiveVisibilityBehaviorType,
    },
  },
});
