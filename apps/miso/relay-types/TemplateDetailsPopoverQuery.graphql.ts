/**
 * @generated SignedSource<<4f5715e0914806a7428bf5b6108c6f7c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type AttributeValueTypeEnumType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type BannerPosition = "bottom" | "top";
export type BannerType = "floating" | "inline";
export type ContextualTagTypeEnumType = "badge" | "badge_dot" | "badge_icon" | "dot" | "highlight" | "icon";
export type CtasOrientation = "inline" | "left" | "right" | "spaceBetween";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type HorizontalMediaAlignment = "center" | "left" | "right";
export type InlineEmbedAlignment = "center" | "left" | "right";
export type InlineEmbedPosition = "after" | "before" | "inside";
export type InlineEmbedState = "active" | "inactive";
export type InlineEmbedTargetingType = "all" | "attribute_rules" | "role";
export type MediaOrientation = "left" | "right";
export type ModalPosition = "bottom_left" | "bottom_right" | "center" | "top_left" | "top_right";
export type ModalSize = "large" | "medium" | "small";
export type StepBodyOrientation = "horizontal" | "vertical";
export type TargetAttributeRuleRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetTypeEnumType = "all" | "attribute_rules" | "role";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
export type VisualTagHighlightType = "halo" | "none" | "overlay" | "solid";
export type VisualTagPulseLevelType = "none" | "standard";
export type TemplateDetailsPopoverQuery$variables = {
  templateEntityId: any;
};
export type TemplateDetailsPopoverQuery$data = {
  readonly orgInlineEmbeds: ReadonlyArray<{
    readonly entityId: any;
    readonly state: InlineEmbedState;
    readonly url: string;
    readonly wildcardUrl: string;
  } | null> | null;
  readonly template: {
    readonly description: string | null;
    readonly designType: GuideDesignTypeEnumType;
    readonly formFactor: GuideFormFactorEnumType | null;
    readonly formFactorStyle: {
      readonly advancedPadding?: string | null;
      readonly backgroundColor?: string | null;
      readonly backgroundOverlayColor?: string | null;
      readonly backgroundOverlayOpacity?: number | null;
      readonly bannerPosition?: BannerPosition;
      readonly bannerType?: BannerType;
      readonly borderColor?: string | null;
      readonly borderRadius?: number | null;
      readonly canDismiss?: boolean | null;
      readonly ctasOrientation?: CtasOrientation | null;
      readonly dotsColor?: string | null;
      readonly hasArrow?: boolean;
      readonly hasBackgroundOverlay?: boolean;
      readonly height?: number | null;
      readonly hideCompletedSteps?: boolean | null;
      readonly hideStepGroupTitle?: boolean | null;
      readonly horizontalMediaAlignment?: HorizontalMediaAlignment | null;
      readonly imageWidth?: string | null;
      readonly mediaFontSize?: number | null;
      readonly mediaOrientation?: MediaOrientation | null;
      readonly mediaTextColor?: string | null;
      readonly modalSize?: ModalSize;
      readonly padding?: number | null;
      readonly position?: ModalPosition;
      readonly selectedBackgroundColor?: string | null;
      readonly statusLabelColor?: string | null;
      readonly stepBodyOrientation?: StepBodyOrientation | null;
      readonly textColor?: string | null;
      readonly tooltipShowOn?: TooltipShowOn;
      readonly tooltipSize?: TooltipSize;
      readonly verticalMediaAlignment?: VerticalMediaAlignment | null;
      readonly verticalMediaOrientation?: VerticalMediaOrientation | null;
    } | null;
    readonly inlineEmbed: {
      readonly alignment: InlineEmbedAlignment | null;
      readonly borderRadius: number;
      readonly bottomMargin: number;
      readonly elementSelector: string;
      readonly entityId: any;
      readonly leftMargin: number;
      readonly maxWidth: number | null;
      readonly padding: number;
      readonly position: InlineEmbedPosition;
      readonly rightMargin: number;
      readonly state: InlineEmbedState;
      readonly targeting: {
        readonly account: {
          readonly grouping: string | null;
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetAttributeRuleRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueType;
          } | null> | null;
          readonly type: InlineEmbedTargetingType;
        };
        readonly accountUser: {
          readonly grouping: string | null;
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetAttributeRuleRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueType;
          } | null> | null;
          readonly type: InlineEmbedTargetingType;
        };
      };
      readonly template: {
        readonly entityId: any;
      } | null;
      readonly topMargin: number;
      readonly url: string;
      readonly wildcardUrl: string;
    } | null;
    readonly isCyoa: boolean;
    readonly pageTargetingType: GuidePageTargetingEnumType;
    readonly pageTargetingUrl: string | null;
    readonly taggedElements: ReadonlyArray<{
      readonly elementSelector: string;
      readonly entityId: any;
      readonly style: {
        readonly color?: string | null;
        readonly opacity?: number | null;
        readonly padding?: number | null;
        readonly pulse?: boolean | null;
        readonly radius?: number | null;
        readonly text?: string | null;
        readonly thickness?: number | null;
        readonly type?: VisualTagHighlightType | null;
      } | null;
      readonly type: ContextualTagTypeEnumType;
      readonly url: string;
      readonly wildcardUrl: string;
    }>;
    readonly targets: {
      readonly account: {
        readonly groups: ReadonlyArray<{
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueTypeEnumType;
          }>;
        }> | null;
        readonly type: TargetTypeEnumType;
      };
      readonly accountUser: {
        readonly groups: ReadonlyArray<{
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueTypeEnumType;
          }>;
        }> | null;
        readonly type: TargetTypeEnumType;
      };
      readonly audiences: {
        readonly groups: ReadonlyArray<{
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueTypeEnumType;
          }>;
        }> | null;
        readonly type: TargetTypeEnumType;
      } | null;
    } | null;
    readonly theme: ThemeType;
  } | null;
  readonly uiSettings: {
    readonly tagBadgeIconBorderRadius: number | null;
    readonly tagBadgeIconPadding: number | null;
    readonly tagCustomIconUrl: string | null;
    readonly tagDotSize: number | null;
    readonly tagPrimaryColor: string | null;
    readonly tagPulseLevel: VisualTagPulseLevelType | null;
    readonly tagTextColor: string | null;
  } | null;
};
export type TemplateDetailsPopoverQuery = {
  response: TemplateDetailsPopoverQuery$data;
  variables: TemplateDetailsPopoverQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "templateEntityId"
  }
],
v1 = {
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
    }
  ],
  "storageKey": null
},
v2 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "templateEntityId"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingType",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingUrl",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v14 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bannerType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bannerPosition",
      "storageKey": null
    },
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v13/*: any*/)
  ],
  "type": "BannerStyle",
  "abstractKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v25 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "modalSize",
      "storageKey": null
    },
    (v15/*: any*/),
    (v16/*: any*/),
    (v12/*: any*/),
    (v10/*: any*/),
    (v11/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v21/*: any*/),
    (v13/*: any*/),
    (v22/*: any*/),
    (v23/*: any*/),
    (v24/*: any*/)
  ],
  "type": "ModalStyle",
  "abstractKey": null
},
v26 = {
  "kind": "InlineFragment",
  "selections": [
    (v10/*: any*/),
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasArrow",
      "storageKey": null
    },
    (v16/*: any*/),
    (v11/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tooltipShowOn",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tooltipSize",
      "storageKey": null
    },
    (v12/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v21/*: any*/),
    (v13/*: any*/),
    (v22/*: any*/),
    (v23/*: any*/),
    (v24/*: any*/)
  ],
  "type": "TooltipStyle",
  "abstractKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
},
v32 = {
  "kind": "InlineFragment",
  "selections": [
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v21/*: any*/),
    (v27/*: any*/),
    (v22/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v13/*: any*/),
    (v23/*: any*/),
    (v24/*: any*/)
  ],
  "type": "CardStyle",
  "abstractKey": null
},
v33 = {
  "kind": "InlineFragment",
  "selections": [
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dotsColor",
      "storageKey": null
    },
    (v27/*: any*/),
    (v22/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v13/*: any*/)
  ],
  "type": "CarouselStyle",
  "abstractKey": null
},
v34 = {
  "kind": "InlineFragment",
  "selections": [
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "selectedBackgroundColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "statusLabelColor",
      "storageKey": null
    }
  ],
  "type": "VideoGalleryStyle",
  "abstractKey": null
},
v35 = {
  "kind": "InlineFragment",
  "selections": [
    (v17/*: any*/),
    (v18/*: any*/),
    (v27/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hideStepGroupTitle",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hideCompletedSteps",
      "storageKey": null
    },
    (v22/*: any*/),
    (v13/*: any*/)
  ],
  "type": "ChecklistStyle",
  "abstractKey": null
},
v36 = [
  {
    "kind": "Literal",
    "name": "checkFirstStepSupport",
    "value": true
  }
],
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v42 = {
  "kind": "InlineFragment",
  "selections": [
    (v41/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pulse",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "color",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "thickness",
      "storageKey": null
    },
    (v30/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "radius",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "opacity",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "text",
      "storageKey": null
    }
  ],
  "type": "VisualTagHighlightSettings",
  "abstractKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topMargin",
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rightMargin",
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bottomMargin",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "leftMargin",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxWidth",
  "storageKey": null
},
v49 = [
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
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
],
v50 = [
  (v41/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "InlineEmbedTargetingRule",
    "kind": "LinkedField",
    "name": "rules",
    "plural": true,
    "selections": (v49/*: any*/),
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
v51 = {
  "alias": null,
  "args": null,
  "concreteType": "InlineEmbedTargeting",
  "kind": "LinkedField",
  "name": "targeting",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "InlineEmbedTargetingSegment",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": (v50/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "InlineEmbedTargetingSegment",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v50/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v53 = [
  (v41/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "TargetGroupType",
    "kind": "LinkedField",
    "name": "groups",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TargetRuleType",
        "kind": "LinkedField",
        "name": "rules",
        "plural": true,
        "selections": (v49/*: any*/),
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v54 = {
  "alias": null,
  "args": null,
  "concreteType": "TargetsType",
  "kind": "LinkedField",
  "name": "targets",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": (v53/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v53/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "audiences",
      "plural": false,
      "selections": (v53/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v55 = {
  "alias": "orgInlineEmbeds",
  "args": null,
  "concreteType": "OrganizationInlineEmbed",
  "kind": "LinkedField",
  "name": "inlineEmbeds",
  "plural": true,
  "selections": [
    (v37/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/),
    (v52/*: any*/)
  ],
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TemplateDetailsPopoverQuery",
    "selections": [
      (v1/*: any*/),
      {
        "alias": "template",
        "args": (v2/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v14/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              (v32/*: any*/),
              (v33/*: any*/),
              (v34/*: any*/),
              (v35/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v36/*: any*/),
            "concreteType": "StepPrototypeTaggedElement",
            "kind": "LinkedField",
            "name": "taggedElements",
            "plural": true,
            "selections": [
              (v37/*: any*/),
              (v38/*: any*/),
              (v39/*: any*/),
              (v40/*: any*/),
              (v41/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "style",
                "plural": false,
                "selections": [
                  (v42/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "taggedElements(checkFirstStepSupport:true)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationInlineEmbed",
            "kind": "LinkedField",
            "name": "inlineEmbed",
            "plural": false,
            "selections": [
              (v37/*: any*/),
              (v38/*: any*/),
              (v39/*: any*/),
              (v40/*: any*/),
              (v15/*: any*/),
              (v43/*: any*/),
              (v44/*: any*/),
              (v45/*: any*/),
              (v30/*: any*/),
              (v29/*: any*/),
              (v46/*: any*/),
              (v47/*: any*/),
              (v48/*: any*/),
              (v51/*: any*/),
              (v52/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "template",
                "plural": false,
                "selections": [
                  (v37/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v54/*: any*/)
        ],
        "storageKey": null
      },
      (v55/*: any*/)
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TemplateDetailsPopoverQuery",
    "selections": [
      (v1/*: any*/),
      {
        "alias": "template",
        "args": (v2/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v56/*: any*/),
              {
                "kind": "TypeDiscriminator",
                "abstractKey": "__isFormFactorStyle"
              },
              (v14/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              (v32/*: any*/),
              (v33/*: any*/),
              (v34/*: any*/),
              (v35/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v36/*: any*/),
            "concreteType": "StepPrototypeTaggedElement",
            "kind": "LinkedField",
            "name": "taggedElements",
            "plural": true,
            "selections": [
              (v37/*: any*/),
              (v38/*: any*/),
              (v39/*: any*/),
              (v40/*: any*/),
              (v41/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "style",
                "plural": false,
                "selections": [
                  (v56/*: any*/),
                  {
                    "kind": "TypeDiscriminator",
                    "abstractKey": "__isVisualTagStyleSettings"
                  },
                  (v42/*: any*/)
                ],
                "storageKey": null
              },
              (v57/*: any*/)
            ],
            "storageKey": "taggedElements(checkFirstStepSupport:true)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationInlineEmbed",
            "kind": "LinkedField",
            "name": "inlineEmbed",
            "plural": false,
            "selections": [
              (v37/*: any*/),
              (v38/*: any*/),
              (v39/*: any*/),
              (v40/*: any*/),
              (v15/*: any*/),
              (v43/*: any*/),
              (v44/*: any*/),
              (v45/*: any*/),
              (v30/*: any*/),
              (v29/*: any*/),
              (v46/*: any*/),
              (v47/*: any*/),
              (v48/*: any*/),
              (v51/*: any*/),
              (v52/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "template",
                "plural": false,
                "selections": [
                  (v37/*: any*/),
                  (v57/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v54/*: any*/),
          (v57/*: any*/)
        ],
        "storageKey": null
      },
      (v55/*: any*/)
    ]
  },
  "params": {
    "cacheID": "9f6958c267e039b2791d4c02f5745785",
    "id": null,
    "metadata": {},
    "name": "TemplateDetailsPopoverQuery",
    "operationKind": "query",
    "text": "query TemplateDetailsPopoverQuery(\n  $templateEntityId: EntityId!\n) {\n  uiSettings {\n    tagPrimaryColor\n    tagTextColor\n    tagDotSize\n    tagPulseLevel\n    tagBadgeIconPadding\n    tagBadgeIconBorderRadius\n    tagCustomIconUrl\n  }\n  template: findTemplate(entityId: $templateEntityId) {\n    formFactor\n    isCyoa\n    designType\n    description\n    theme\n    pageTargetingType\n    pageTargetingUrl\n    formFactorStyle {\n      __typename\n      __isFormFactorStyle: __typename\n      ... on BannerStyle {\n        bannerType\n        bannerPosition\n        backgroundColor\n        textColor\n        canDismiss\n        ctasOrientation\n      }\n      ... on ModalStyle {\n        modalSize\n        position\n        hasBackgroundOverlay\n        canDismiss\n        backgroundColor\n        textColor\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on TooltipStyle {\n        backgroundColor\n        backgroundOverlayColor\n        backgroundOverlayOpacity\n        hasArrow\n        hasBackgroundOverlay\n        textColor\n        tooltipShowOn\n        tooltipSize\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CardStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CarouselStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        dotsColor\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n      }\n      ... on VideoGalleryStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        selectedBackgroundColor\n        statusLabelColor\n      }\n      ... on ChecklistStyle {\n        stepBodyOrientation\n        mediaOrientation\n        height\n        hideStepGroupTitle\n        hideCompletedSteps\n        imageWidth\n        ctasOrientation\n      }\n    }\n    taggedElements(checkFirstStepSupport: true) {\n      entityId\n      url\n      wildcardUrl\n      elementSelector\n      type\n      style {\n        __typename\n        __isVisualTagStyleSettings: __typename\n        ... on VisualTagHighlightSettings {\n          type\n          pulse\n          color\n          thickness\n          padding\n          radius\n          opacity\n          text\n        }\n      }\n      id\n    }\n    inlineEmbed {\n      entityId\n      url\n      wildcardUrl\n      elementSelector\n      position\n      topMargin\n      rightMargin\n      bottomMargin\n      padding\n      borderRadius\n      leftMargin\n      alignment\n      maxWidth\n      targeting {\n        account {\n          type\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n          grouping\n        }\n        accountUser {\n          type\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n          grouping\n        }\n      }\n      state\n      template {\n        entityId\n        id\n      }\n    }\n    targets {\n      account {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n      accountUser {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n      audiences {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n    }\n    id\n  }\n  orgInlineEmbeds: inlineEmbeds {\n    entityId\n    url\n    wildcardUrl\n    state\n  }\n}\n"
  }
};
})();

(node as any).hash = "821477aa040c91897377d60707a8e591";

export default node;
