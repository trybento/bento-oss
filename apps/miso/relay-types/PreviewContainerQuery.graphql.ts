/**
 * @generated SignedSource<<ee2849329c31301d7994bfaf21d712ed>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
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
export type PreviewContainerQuery$variables = {};
export type PreviewContainerQuery$data = {
  readonly uiSettings: {
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
  } | null;
};
export type PreviewContainerQuery = {
  response: PreviewContainerQuery$data;
  variables: PreviewContainerQuery$variables;
};

const node: ConcreteRequest = (function(){
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
},
v10 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "OrganizationUISettings",
    "kind": "LinkedField",
    "name": "uiSettings",
    "plural": false,
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PreviewContainerQuery",
    "selections": (v10/*: any*/),
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PreviewContainerQuery",
    "selections": (v10/*: any*/)
  },
  "params": {
    "cacheID": "d37179211a3e4f76fc669a507d6d721b",
    "id": null,
    "metadata": {},
    "name": "PreviewContainerQuery",
    "operationKind": "query",
    "text": "query PreviewContainerQuery {\n  uiSettings {\n    primaryColorHex\n    additionalColors {\n      value\n    }\n    secondaryColorHex\n    sidebarStyle\n    appContainerIdentifier\n    fontColorHex\n    borderColor\n    embedBackgroundHex\n    sidebarBackgroundColor\n    cardBackgroundColor\n    toggleStyle\n    toggleColorHex\n    toggleText\n    sidebarSide\n    toggleTextColor\n    isEmbedToggleColorInverted\n    embedCustomCss\n    embedToggleBehavior\n    tagPrimaryColor\n    tagTextColor\n    tagDotSize\n    tagPulseLevel\n    tagBadgeIconPadding\n    tagBadgeIconBorderRadius\n    tagCustomIconUrl\n    tagVisibility\n    paragraphFontSize\n    sidebarVisibility\n    sidebarAvailability\n    paragraphLineHeight\n    cyoaOptionBackgroundColor\n    cyoaOptionBorderColor\n    cyoaOptionShadow\n    cyoaOptionShadowHover\n    cyoaTextColor\n    theme\n    floatingAnchorXOffset\n    floatingAnchorYOffset\n    stepCompletionStyle\n    stepSeparationStyle {\n      type\n      boxCompleteBackgroundColor\n      boxActiveStepShadow\n      boxBorderRadius\n    }\n    inlineContextualStyle {\n      borderRadius\n      borderColor\n      shadow\n      padding\n    }\n    inlineEmptyBehaviour\n    sidebarHeader {\n      type\n      progressBar\n      closeIcon\n      showModuleNameInStepView\n    }\n    sidebarBlocklistedUrls\n    allGuidesStyle {\n      allGuidesTitle\n      activeGuidesTitle\n      previousGuidesTitle\n      previousAnnouncementsTitle\n    }\n    quickLinks {\n      url\n      title\n      icon\n    }\n    helpCenter {\n      source\n      url\n      liveChat\n      issueSubmission\n      kbSearch\n      targeting {\n        account {\n          type\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n          grouping\n        }\n        accountUser {\n          type\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n          grouping\n        }\n      }\n    }\n    helpCenterStyle {\n      supportTicketTitle\n      chatTitle\n    }\n    modalsStyle {\n      paddingX\n      paddingY\n      shadow\n      borderRadius\n      backgroundOverlayColor\n      backgroundOverlayOpacity\n    }\n    tooltipsStyle {\n      paddingX\n      paddingY\n      shadow\n      borderRadius\n    }\n    ctasStyle {\n      paddingX\n      paddingY\n      fontSize\n      lineHeight\n      borderRadius\n    }\n    bannersStyle {\n      padding\n      shadow\n      borderRadius\n    }\n    responsiveVisibility {\n      all\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a9643fbaa420342d600ae893137e5a4e";

export default node;
