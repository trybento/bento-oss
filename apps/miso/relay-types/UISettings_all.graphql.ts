/**
 * @generated SignedSource<<2dfbcedc663a59125560cfa259affdae>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type ActiveStepShadowType = "custom" | "none" | "standard";
export type AnnouncementShadowType = "none" | "standard";
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type BannerPaddingType = "large" | "medium" | "small";
export type EmbedToggleBehaviorType = "default" | "persist" | "resource_center";
export type GuideHeaderCloseIconType = "downArrow" | "minimize" | "x";
export type GuideHeaderProgressBarType = "continuous" | "sections";
export type GuideHeaderStyleType = "bright" | "classic" | "simple" | "striped";
export type HelpCenterSource = "helpscout" | "intercom" | "salesforce" | "zendesk";
export type InlineContextualType = "none" | "standard";
export type InlineEmptyBehaviourType = "hide" | "show";
export type IntegrationTargetingType = "all" | "attribute_rules" | "role";
export type ResponsiveVisibilityBehaviorType = "hide" | "show";
export type SidebarAvailabilityType = "default" | "hide" | "never_open";
export type SidebarVisibilityType = "active_guides" | "active_onboarding_guides" | "hide" | "show";
export type StepSeparationType = "border" | "box";
export type TagVisibilityType = "active_step" | "always";
export type TargetAttributeRuleRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type VisualTagPulseLevelType = "none" | "standard";
import { FragmentRefs } from "relay-runtime";
export type UISettings_all$data = {
  readonly additionalColors: ReadonlyArray<{
    readonly value: string;
  }>;
  readonly allGuidesStyle: {
    readonly activeGuidesTitle: string;
    readonly allGuidesTitle: string;
    readonly previousAnnouncementsTitle: string;
    readonly previousGuidesTitle: string;
  };
  readonly appContainerIdentifier: string | null;
  readonly bannersStyle: {
    readonly borderRadius: number | null;
    readonly padding: BannerPaddingType | null;
    readonly shadow: AnnouncementShadowType | null;
  } | null;
  readonly borderColor: string | null;
  readonly cardBackgroundColor: string;
  readonly ctasStyle: {
    readonly borderRadius: number | null;
    readonly fontSize: number | null;
    readonly lineHeight: number | null;
    readonly paddingX: number | null;
    readonly paddingY: number | null;
  } | null;
  readonly cyoaOptionBackgroundColor: string | null;
  readonly cyoaOptionBorderColor: string;
  readonly cyoaOptionShadow: string;
  readonly cyoaOptionShadowHover: string;
  readonly cyoaTextColor: string | null;
  readonly embedBackgroundHex: string | null;
  readonly embedCustomCss: string | null;
  readonly embedToggleBehavior: EmbedToggleBehaviorType;
  readonly floatingAnchorXOffset: number;
  readonly floatingAnchorYOffset: number;
  readonly fontColorHex: string | null;
  readonly helpCenter: {
    readonly issueSubmission: boolean | null;
    readonly kbSearch: boolean | null;
    readonly liveChat: boolean | null;
    readonly source: HelpCenterSource;
    readonly targeting: {
      readonly account: {
        readonly grouping: string | null;
        readonly rules: ReadonlyArray<{
          readonly attribute: string;
          readonly ruleType: TargetAttributeRuleRuleTypeEnumType;
          readonly value: any;
          readonly valueType: AttributeValueType;
        } | null> | null;
        readonly type: IntegrationTargetingType;
      };
      readonly accountUser: {
        readonly grouping: string | null;
        readonly rules: ReadonlyArray<{
          readonly attribute: string;
          readonly ruleType: TargetAttributeRuleRuleTypeEnumType;
          readonly value: any;
          readonly valueType: AttributeValueType;
        } | null> | null;
        readonly type: IntegrationTargetingType;
      };
    } | null;
    readonly url: string | null;
  } | null;
  readonly helpCenterStyle: {
    readonly chatTitle: string | null;
    readonly supportTicketTitle: string | null;
  };
  readonly inlineContextualStyle: {
    readonly borderColor: string | null;
    readonly borderRadius: number;
    readonly padding: number;
    readonly shadow: InlineContextualType;
  } | null;
  readonly inlineEmptyBehaviour: InlineEmptyBehaviourType;
  readonly isEmbedToggleColorInverted: boolean | null;
  readonly modalsStyle: {
    readonly backgroundOverlayColor: string | null;
    readonly backgroundOverlayOpacity: number | null;
    readonly borderRadius: number | null;
    readonly paddingX: number | null;
    readonly paddingY: number | null;
    readonly shadow: AnnouncementShadowType | null;
  } | null;
  readonly paragraphFontSize: number | null;
  readonly paragraphLineHeight: number | null;
  readonly primaryColorHex: string | null;
  readonly quickLinks: ReadonlyArray<{
    readonly icon: string | null;
    readonly title: string;
    readonly url: string;
  } | null>;
  readonly responsiveVisibility: {
    readonly all: ResponsiveVisibilityBehaviorType;
  } | null;
  readonly secondaryColorHex: string | null;
  readonly sidebarAvailability: SidebarAvailabilityType;
  readonly sidebarBackgroundColor: string;
  readonly sidebarBlocklistedUrls: ReadonlyArray<string | null>;
  readonly sidebarHeader: {
    readonly closeIcon: GuideHeaderCloseIconType;
    readonly progressBar: GuideHeaderProgressBarType | null;
    readonly showModuleNameInStepView: boolean;
    readonly type: GuideHeaderStyleType;
  };
  readonly sidebarSide: string | null;
  readonly sidebarStyle: string | null;
  readonly sidebarVisibility: SidebarVisibilityType;
  readonly stepCompletionStyle: string;
  readonly stepSeparationStyle: {
    readonly boxActiveStepShadow: ActiveStepShadowType;
    readonly boxBorderRadius: number;
    readonly boxCompleteBackgroundColor: string | null;
    readonly type: StepSeparationType;
  } | null;
  readonly tagBadgeIconBorderRadius: number | null;
  readonly tagBadgeIconPadding: number | null;
  readonly tagCustomIconUrl: string | null;
  readonly tagDotSize: number | null;
  readonly tagPrimaryColor: string | null;
  readonly tagPulseLevel: VisualTagPulseLevelType | null;
  readonly tagTextColor: string | null;
  readonly tagVisibility: TagVisibilityType;
  readonly theme: ThemeType;
  readonly toggleColorHex: string | null;
  readonly toggleStyle: string | null;
  readonly toggleText: string | null;
  readonly toggleTextColor: string;
  readonly tooltipsStyle: {
    readonly borderRadius: number | null;
    readonly paddingX: number | null;
    readonly paddingY: number | null;
    readonly shadow: AnnouncementShadowType | null;
  } | null;
  readonly " $fragmentType": "UISettings_all";
};
export type UISettings_all$key = {
  readonly " $data"?: UISettings_all$data;
  readonly " $fragmentSpreads": FragmentRefs<"UISettings_all">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "shadow",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v7 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "IntegrationTargetingRule",
    "kind": "LinkedField",
    "name": "rules",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "attribute",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "ruleType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "valueType",
        "storageKey": null
      },
      (v0/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "grouping",
    "storageKey": null
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "paddingX",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "paddingY",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UISettings_all",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "primaryColorHex",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AdditionalColorsType",
      "kind": "LinkedField",
      "name": "additionalColors",
      "plural": true,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "secondaryColorHex",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sidebarStyle",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "appContainerIdentifier",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fontColorHex",
      "storageKey": null
    },
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "embedBackgroundHex",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sidebarBackgroundColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cardBackgroundColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "toggleStyle",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "toggleColorHex",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "toggleText",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sidebarSide",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "toggleTextColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isEmbedToggleColorInverted",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "embedCustomCss",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "embedToggleBehavior",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tagPrimaryColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tagTextColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tagDotSize",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tagPulseLevel",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tagBadgeIconPadding",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tagBadgeIconBorderRadius",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tagCustomIconUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tagVisibility",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "paragraphFontSize",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sidebarVisibility",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sidebarAvailability",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "paragraphLineHeight",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cyoaOptionBackgroundColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cyoaOptionBorderColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cyoaOptionShadow",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cyoaOptionShadowHover",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cyoaTextColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "theme",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "floatingAnchorXOffset",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "floatingAnchorYOffset",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "stepCompletionStyle",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "StepSeparationStyleType",
      "kind": "LinkedField",
      "name": "stepSeparationStyle",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "boxCompleteBackgroundColor",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "boxActiveStepShadow",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "boxBorderRadius",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "InlineContextualStyleType",
      "kind": "LinkedField",
      "name": "inlineContextualStyle",
      "plural": false,
      "selections": [
        (v3/*: any*/),
        (v1/*: any*/),
        (v4/*: any*/),
        (v5/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "inlineEmptyBehaviour",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "GuideHeaderSettingsType",
      "kind": "LinkedField",
      "name": "sidebarHeader",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "progressBar",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "closeIcon",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "showModuleNameInStepView",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sidebarBlocklistedUrls",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AllGuidesStyleType",
      "kind": "LinkedField",
      "name": "allGuidesStyle",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "allGuidesTitle",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "activeGuidesTitle",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "previousGuidesTitle",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "previousAnnouncementsTitle",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "QuickLink",
      "kind": "LinkedField",
      "name": "quickLinks",
      "plural": true,
      "selections": [
        (v6/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "icon",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "HelpCenter",
      "kind": "LinkedField",
      "name": "helpCenter",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "source",
          "storageKey": null
        },
        (v6/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "liveChat",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "issueSubmission",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "kbSearch",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "CommonTargeting",
          "kind": "LinkedField",
          "name": "targeting",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "IntegrationTargetingSegment",
              "kind": "LinkedField",
              "name": "account",
              "plural": false,
              "selections": (v7/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "IntegrationTargetingSegment",
              "kind": "LinkedField",
              "name": "accountUser",
              "plural": false,
              "selections": (v7/*: any*/),
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "HelpCenterStyle",
      "kind": "LinkedField",
      "name": "helpCenterStyle",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "supportTicketTitle",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "chatTitle",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ModalsStyleStyleType",
      "kind": "LinkedField",
      "name": "modalsStyle",
      "plural": false,
      "selections": [
        (v8/*: any*/),
        (v9/*: any*/),
        (v4/*: any*/),
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "backgroundOverlayColor",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "backgroundOverlayOpacity",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TooltipsStyleStyleType",
      "kind": "LinkedField",
      "name": "tooltipsStyle",
      "plural": false,
      "selections": [
        (v8/*: any*/),
        (v9/*: any*/),
        (v4/*: any*/),
        (v3/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "CtasStyleStyleType",
      "kind": "LinkedField",
      "name": "ctasStyle",
      "plural": false,
      "selections": [
        (v8/*: any*/),
        (v9/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "fontSize",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "lineHeight",
          "storageKey": null
        },
        (v3/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "BannersStyleStyleType",
      "kind": "LinkedField",
      "name": "bannersStyle",
      "plural": false,
      "selections": [
        (v5/*: any*/),
        (v4/*: any*/),
        (v3/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ResponsiveVisibilityType",
      "kind": "LinkedField",
      "name": "responsiveVisibility",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "all",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "OrganizationUISettings",
  "abstractKey": null
};
})();

(node as any).hash = "4c4c93a29ea67d04cecd8fb859e46920";

export default node;
