/**
 * @generated SignedSource<<15f3cbd1b23ded704c465a23fbd68781>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type BannerPosition = "bottom" | "top";
export type BannerType = "floating" | "inline";
export type BranchingEntityTypeEnum = "guide" | "module" | "template";
export type BranchingFormFactorEnumType = "cards" | "dropdown";
export type BranchingPathEntityType = "guide" | "module" | "template";
export type CYOABackgroundImagePosition = "background" | "bottom" | "left" | "right" | "top";
export type CtasOrientation = "inline" | "left" | "right" | "spaceBetween";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type HorizontalMediaAlignment = "center" | "left" | "right";
export type InlineEmbedAlignment = "center" | "left" | "right";
export type InlineEmbedPosition = "after" | "before" | "inside";
export type InlineEmbedState = "active" | "inactive";
export type InlineEmbedTargetingType = "all" | "attribute_rules" | "role";
export type MediaOrientation = "left" | "right";
export type MediaTypeEnumType = "image" | "number_attribute" | "video";
export type ModalPosition = "bottom_left" | "bottom_right" | "center" | "top_left" | "top_right";
export type ModalSize = "large" | "medium" | "small";
export type StepBodyOrientation = "horizontal" | "vertical";
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type TargetAttributeRuleRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
export type EditOrganizationInlineEmbedInput = {
  alignment?: InlineEmbedAlignment | null;
  borderRadius: number;
  bottomMargin: number;
  elementSelector: string;
  entityId: any;
  leftMargin: number;
  maxWidth?: number | null;
  padding: number;
  position: InlineEmbedPosition;
  rightMargin: number;
  state?: InlineEmbedState | null;
  topMargin: number;
  url: string;
  wildcardUrl: string;
};
export type EditInlineEmbedMutation$variables = {
  input: EditOrganizationInlineEmbedInput;
};
export type EditInlineEmbedMutation$data = {
  readonly editInlineEmbed: {
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
        readonly designType: GuideDesignTypeEnumType;
        readonly entityId: any;
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
        readonly isSideQuest: boolean | null;
        readonly modules: ReadonlyArray<{
          readonly displayTitle: string | null;
          readonly entityId: any;
          readonly name: string | null;
          readonly stepPrototypes: ReadonlyArray<{
            readonly bodySlate: any | null;
            readonly branchingChoices: ReadonlyArray<{
              readonly choiceKey: string | null;
              readonly label: string | null;
              readonly style: {
                readonly backgroundImagePosition?: CYOABackgroundImagePosition;
                readonly backgroundImageUrl?: string | null;
              } | null;
            }> | null;
            readonly branchingDismissDisabled: boolean | null;
            readonly branchingEntityType: BranchingEntityTypeEnum | null;
            readonly branchingFormFactor: BranchingFormFactorEnumType | null;
            readonly branchingKey: string | null;
            readonly branchingMultiple: boolean | null;
            readonly branchingPathData: ReadonlyArray<{
              readonly branchingKey: string | null;
              readonly choiceKey: string | null;
              readonly entityType: BranchingPathEntityType;
              readonly moduleEntityId: any | null;
              readonly templateEntityId: any | null;
            }> | null;
            readonly branchingQuestion: string | null;
            readonly ctas: ReadonlyArray<{
              readonly destinationGuide: string | null;
              readonly entityId: any;
              readonly settings: {
                readonly bgColorField: string;
                readonly eventName: string | null;
                readonly implicit: boolean | null;
                readonly markComplete: boolean | null;
                readonly opensInNewTab: boolean | null;
                readonly textColorField: string;
              } | null;
              readonly style: StepCtaStyleEnumType;
              readonly text: string;
              readonly type: StepCtaTypeEnumType;
              readonly url: string | null;
            }>;
            readonly entityId: any;
            readonly manualCompletionDisabled: boolean;
            readonly mediaReferences: ReadonlyArray<{
              readonly entityId: any;
              readonly media: {
                readonly meta: {
                  readonly naturalHeight?: number | null;
                  readonly naturalWidth?: number | null;
                  readonly videoId?: string | null;
                  readonly videoType?: string | null;
                };
                readonly type: MediaTypeEnumType;
                readonly url: string;
              };
              readonly settings: {
                readonly alignment?: string | null;
                readonly fill?: string | null;
                readonly hyperlink?: string | null;
                readonly lightboxDisabled?: boolean | null;
                readonly playsInline?: boolean | null;
              };
            }>;
            readonly name: string;
            readonly stepType: StepTypeEnum;
          }>;
        }>;
        readonly name: string | null;
        readonly pageTargetingType: GuidePageTargetingEnumType;
        readonly privateName: string | null;
        readonly theme: ThemeType;
        readonly type: GuideTypeEnumType;
      } | null;
      readonly topMargin: number;
      readonly url: string;
      readonly wildcardUrl: string;
    } | null;
  } | null;
};
export type EditInlineEmbedMutation = {
  response: EditInlineEmbedMutation$data;
  variables: EditInlineEmbedMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topMargin",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rightMargin",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bottomMargin",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "leftMargin",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxWidth",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v16 = [
  (v15/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "InlineEmbedTargetingRule",
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
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "value",
        "storageKey": null
      }
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
v17 = {
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
      "selections": (v16/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "InlineEmbedTargetingSegment",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v16/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v26 = {
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
    (v22/*: any*/),
    (v23/*: any*/),
    (v24/*: any*/),
    (v25/*: any*/)
  ],
  "type": "BannerStyle",
  "abstractKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v36 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "modalSize",
      "storageKey": null
    },
    (v6/*: any*/),
    (v27/*: any*/),
    (v24/*: any*/),
    (v22/*: any*/),
    (v23/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v32/*: any*/),
    (v25/*: any*/),
    (v33/*: any*/),
    (v34/*: any*/),
    (v35/*: any*/)
  ],
  "type": "ModalStyle",
  "abstractKey": null
},
v37 = {
  "kind": "InlineFragment",
  "selections": [
    (v22/*: any*/),
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
    (v27/*: any*/),
    (v23/*: any*/),
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
    (v24/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v32/*: any*/),
    (v25/*: any*/),
    (v33/*: any*/),
    (v34/*: any*/),
    (v35/*: any*/)
  ],
  "type": "TooltipStyle",
  "abstractKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
},
v41 = {
  "kind": "InlineFragment",
  "selections": [
    (v22/*: any*/),
    (v23/*: any*/),
    (v24/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v32/*: any*/),
    (v38/*: any*/),
    (v33/*: any*/),
    (v39/*: any*/),
    (v11/*: any*/),
    (v10/*: any*/),
    (v40/*: any*/),
    (v25/*: any*/),
    (v34/*: any*/),
    (v35/*: any*/)
  ],
  "type": "CardStyle",
  "abstractKey": null
},
v42 = {
  "kind": "InlineFragment",
  "selections": [
    (v22/*: any*/),
    (v23/*: any*/),
    (v24/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dotsColor",
      "storageKey": null
    },
    (v38/*: any*/),
    (v33/*: any*/),
    (v39/*: any*/),
    (v11/*: any*/),
    (v10/*: any*/),
    (v40/*: any*/),
    (v25/*: any*/)
  ],
  "type": "CarouselStyle",
  "abstractKey": null
},
v43 = {
  "kind": "InlineFragment",
  "selections": [
    (v22/*: any*/),
    (v23/*: any*/),
    (v24/*: any*/),
    (v39/*: any*/),
    (v11/*: any*/),
    (v10/*: any*/),
    (v40/*: any*/),
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
v44 = {
  "kind": "InlineFragment",
  "selections": [
    (v28/*: any*/),
    (v29/*: any*/),
    (v38/*: any*/),
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
    (v33/*: any*/),
    (v25/*: any*/)
  ],
  "type": "ChecklistStyle",
  "abstractKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingType",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manualCompletionDisabled",
  "storageKey": null
},
v53 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingQuestion",
  "storageKey": null
},
v54 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingMultiple",
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingDismissDisabled",
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingFormFactor",
  "storageKey": null
},
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingKey",
  "storageKey": null
},
v58 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingEntityType",
  "storageKey": null
},
v59 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "choiceKey",
  "storageKey": null
},
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityType",
  "storageKey": null
},
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "templateEntityId",
  "storageKey": null
},
v62 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "moduleEntityId",
  "storageKey": null
},
v63 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v64 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "backgroundImageUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "backgroundImagePosition",
      "storageKey": null
    }
  ],
  "type": "BranchingCardStyle",
  "abstractKey": null
},
v65 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "style",
  "storageKey": null
},
v66 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v67 = {
  "alias": null,
  "args": null,
  "concreteType": "StepCtaSettingsType",
  "kind": "LinkedField",
  "name": "settings",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bgColorField",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "textColorField",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "eventName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "markComplete",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "implicit",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "opensInNewTab",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v68 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "destinationGuide",
  "storageKey": null
},
v69 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "naturalWidth",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "naturalHeight",
      "storageKey": null
    }
  ],
  "type": "ImageMediaMeta",
  "abstractKey": null
},
v70 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "videoId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "videoType",
      "storageKey": null
    }
  ],
  "type": "VideoMediaMeta",
  "abstractKey": null
},
v71 = {
  "kind": "InlineFragment",
  "selections": [
    (v13/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fill",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hyperlink",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lightboxDisabled",
      "storageKey": null
    }
  ],
  "type": "ImageMediaReferenceSettings",
  "abstractKey": null
},
v72 = {
  "kind": "InlineFragment",
  "selections": [
    (v13/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "playsInline",
      "storageKey": null
    }
  ],
  "type": "VideoMediaReferenceSettings",
  "abstractKey": null
},
v73 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v74 = {
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
    "name": "EditInlineEmbedMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditOrganizationInlineEmbedPayload",
        "kind": "LinkedField",
        "name": "editInlineEmbed",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationInlineEmbed",
            "kind": "LinkedField",
            "name": "inlineEmbed",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "template",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v15/*: any*/),
                  (v21/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "formFactorStyle",
                    "plural": false,
                    "selections": [
                      (v26/*: any*/),
                      (v36/*: any*/),
                      (v37/*: any*/),
                      (v41/*: any*/),
                      (v42/*: any*/),
                      (v43/*: any*/),
                      (v44/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v45/*: any*/),
                  (v46/*: any*/),
                  (v47/*: any*/),
                  (v48/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Module",
                    "kind": "LinkedField",
                    "name": "modules",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v19/*: any*/),
                      (v49/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepPrototype",
                        "kind": "LinkedField",
                        "name": "stepPrototypes",
                        "plural": true,
                        "selections": [
                          (v2/*: any*/),
                          (v19/*: any*/),
                          (v50/*: any*/),
                          (v51/*: any*/),
                          (v52/*: any*/),
                          (v53/*: any*/),
                          (v54/*: any*/),
                          (v55/*: any*/),
                          (v56/*: any*/),
                          (v57/*: any*/),
                          (v58/*: any*/),
                          {
                            "alias": "branchingPathData",
                            "args": null,
                            "concreteType": "BranchingPath",
                            "kind": "LinkedField",
                            "name": "branchingPaths",
                            "plural": true,
                            "selections": [
                              (v59/*: any*/),
                              (v57/*: any*/),
                              (v60/*: any*/),
                              (v61/*: any*/),
                              (v62/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BranchingChoice",
                            "kind": "LinkedField",
                            "name": "branchingChoices",
                            "plural": true,
                            "selections": [
                              (v59/*: any*/),
                              (v63/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "style",
                                "plural": false,
                                "selections": [
                                  (v64/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StepPrototypeCta",
                            "kind": "LinkedField",
                            "name": "ctas",
                            "plural": true,
                            "selections": [
                              (v2/*: any*/),
                              (v15/*: any*/),
                              (v65/*: any*/),
                              (v66/*: any*/),
                              (v3/*: any*/),
                              (v67/*: any*/),
                              (v68/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "MediaReference",
                            "kind": "LinkedField",
                            "name": "mediaReferences",
                            "plural": true,
                            "selections": [
                              (v2/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Media",
                                "kind": "LinkedField",
                                "name": "media",
                                "plural": false,
                                "selections": [
                                  (v15/*: any*/),
                                  (v3/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": null,
                                    "kind": "LinkedField",
                                    "name": "meta",
                                    "plural": false,
                                    "selections": [
                                      (v69/*: any*/),
                                      (v70/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "settings",
                                "plural": false,
                                "selections": [
                                  (v71/*: any*/),
                                  (v72/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditInlineEmbedMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditOrganizationInlineEmbedPayload",
        "kind": "LinkedField",
        "name": "editInlineEmbed",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationInlineEmbed",
            "kind": "LinkedField",
            "name": "inlineEmbed",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "template",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v15/*: any*/),
                  (v21/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "formFactorStyle",
                    "plural": false,
                    "selections": [
                      (v73/*: any*/),
                      {
                        "kind": "TypeDiscriminator",
                        "abstractKey": "__isFormFactorStyle"
                      },
                      (v26/*: any*/),
                      (v36/*: any*/),
                      (v37/*: any*/),
                      (v41/*: any*/),
                      (v42/*: any*/),
                      (v43/*: any*/),
                      (v44/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v45/*: any*/),
                  (v46/*: any*/),
                  (v47/*: any*/),
                  (v48/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Module",
                    "kind": "LinkedField",
                    "name": "modules",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v19/*: any*/),
                      (v49/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepPrototype",
                        "kind": "LinkedField",
                        "name": "stepPrototypes",
                        "plural": true,
                        "selections": [
                          (v2/*: any*/),
                          (v19/*: any*/),
                          (v50/*: any*/),
                          (v51/*: any*/),
                          (v52/*: any*/),
                          (v53/*: any*/),
                          (v54/*: any*/),
                          (v55/*: any*/),
                          (v56/*: any*/),
                          (v57/*: any*/),
                          (v58/*: any*/),
                          {
                            "alias": "branchingPathData",
                            "args": null,
                            "concreteType": "BranchingPath",
                            "kind": "LinkedField",
                            "name": "branchingPaths",
                            "plural": true,
                            "selections": [
                              (v59/*: any*/),
                              (v57/*: any*/),
                              (v60/*: any*/),
                              (v61/*: any*/),
                              (v62/*: any*/),
                              (v74/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BranchingChoice",
                            "kind": "LinkedField",
                            "name": "branchingChoices",
                            "plural": true,
                            "selections": [
                              (v59/*: any*/),
                              (v63/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "style",
                                "plural": false,
                                "selections": [
                                  (v73/*: any*/),
                                  {
                                    "kind": "TypeDiscriminator",
                                    "abstractKey": "__isBranchingStyle"
                                  },
                                  (v64/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StepPrototypeCta",
                            "kind": "LinkedField",
                            "name": "ctas",
                            "plural": true,
                            "selections": [
                              (v2/*: any*/),
                              (v15/*: any*/),
                              (v65/*: any*/),
                              (v66/*: any*/),
                              (v3/*: any*/),
                              (v67/*: any*/),
                              (v68/*: any*/),
                              (v74/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "MediaReference",
                            "kind": "LinkedField",
                            "name": "mediaReferences",
                            "plural": true,
                            "selections": [
                              (v2/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Media",
                                "kind": "LinkedField",
                                "name": "media",
                                "plural": false,
                                "selections": [
                                  (v15/*: any*/),
                                  (v3/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": null,
                                    "kind": "LinkedField",
                                    "name": "meta",
                                    "plural": false,
                                    "selections": [
                                      (v73/*: any*/),
                                      (v69/*: any*/),
                                      (v70/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v74/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "settings",
                                "plural": false,
                                "selections": [
                                  (v73/*: any*/),
                                  (v71/*: any*/),
                                  (v72/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v74/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v74/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v74/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v74/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "958d9f34eff15a4fc2b444eeafc55c85",
    "id": null,
    "metadata": {},
    "name": "EditInlineEmbedMutation",
    "operationKind": "mutation",
    "text": "mutation EditInlineEmbedMutation(\n  $input: EditOrganizationInlineEmbedInput!\n) {\n  editInlineEmbed(input: $input) {\n    inlineEmbed {\n      entityId\n      url\n      wildcardUrl\n      elementSelector\n      position\n      topMargin\n      rightMargin\n      bottomMargin\n      padding\n      borderRadius\n      leftMargin\n      alignment\n      maxWidth\n      targeting {\n        account {\n          type\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n          grouping\n        }\n        accountUser {\n          type\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n          grouping\n        }\n      }\n      state\n      template {\n        entityId\n        name\n        privateName\n        type\n        formFactor\n        formFactorStyle {\n          __typename\n          __isFormFactorStyle: __typename\n          ... on BannerStyle {\n            bannerType\n            bannerPosition\n            backgroundColor\n            textColor\n            canDismiss\n            ctasOrientation\n          }\n          ... on ModalStyle {\n            modalSize\n            position\n            hasBackgroundOverlay\n            canDismiss\n            backgroundColor\n            textColor\n            stepBodyOrientation\n            mediaOrientation\n            verticalMediaOrientation\n            verticalMediaAlignment\n            horizontalMediaAlignment\n            ctasOrientation\n            imageWidth\n            mediaFontSize\n            mediaTextColor\n          }\n          ... on TooltipStyle {\n            backgroundColor\n            backgroundOverlayColor\n            backgroundOverlayOpacity\n            hasArrow\n            hasBackgroundOverlay\n            textColor\n            tooltipShowOn\n            tooltipSize\n            canDismiss\n            stepBodyOrientation\n            mediaOrientation\n            verticalMediaOrientation\n            verticalMediaAlignment\n            horizontalMediaAlignment\n            ctasOrientation\n            imageWidth\n            mediaFontSize\n            mediaTextColor\n          }\n          ... on CardStyle {\n            backgroundColor\n            textColor\n            canDismiss\n            stepBodyOrientation\n            mediaOrientation\n            verticalMediaOrientation\n            verticalMediaAlignment\n            horizontalMediaAlignment\n            height\n            imageWidth\n            borderColor\n            borderRadius\n            padding\n            advancedPadding\n            ctasOrientation\n            mediaFontSize\n            mediaTextColor\n          }\n          ... on CarouselStyle {\n            backgroundColor\n            textColor\n            canDismiss\n            stepBodyOrientation\n            mediaOrientation\n            dotsColor\n            height\n            imageWidth\n            borderColor\n            borderRadius\n            padding\n            advancedPadding\n            ctasOrientation\n          }\n          ... on VideoGalleryStyle {\n            backgroundColor\n            textColor\n            canDismiss\n            borderColor\n            borderRadius\n            padding\n            advancedPadding\n            selectedBackgroundColor\n            statusLabelColor\n          }\n          ... on ChecklistStyle {\n            stepBodyOrientation\n            mediaOrientation\n            height\n            hideStepGroupTitle\n            hideCompletedSteps\n            imageWidth\n            ctasOrientation\n          }\n        }\n        designType\n        isSideQuest\n        theme\n        pageTargetingType\n        modules {\n          entityId\n          name\n          displayTitle\n          stepPrototypes {\n            entityId\n            name\n            bodySlate\n            stepType\n            manualCompletionDisabled\n            branchingQuestion\n            branchingMultiple\n            branchingDismissDisabled\n            branchingFormFactor\n            branchingKey\n            branchingEntityType\n            branchingPathData: branchingPaths {\n              choiceKey\n              branchingKey\n              entityType\n              templateEntityId\n              moduleEntityId\n              id\n            }\n            branchingChoices {\n              choiceKey\n              label\n              style {\n                __typename\n                __isBranchingStyle: __typename\n                ... on BranchingCardStyle {\n                  backgroundImageUrl\n                  backgroundImagePosition\n                }\n              }\n            }\n            ctas {\n              entityId\n              type\n              style\n              text\n              url\n              settings {\n                bgColorField\n                textColorField\n                eventName\n                markComplete\n                implicit\n                opensInNewTab\n              }\n              destinationGuide\n              id\n            }\n            mediaReferences {\n              entityId\n              media {\n                type\n                url\n                meta {\n                  __typename\n                  ... on ImageMediaMeta {\n                    naturalWidth\n                    naturalHeight\n                  }\n                  ... on VideoMediaMeta {\n                    videoId\n                    videoType\n                  }\n                }\n                id\n              }\n              settings {\n                __typename\n                ... on ImageMediaReferenceSettings {\n                  alignment\n                  fill\n                  hyperlink\n                  lightboxDisabled\n                }\n                ... on VideoMediaReferenceSettings {\n                  alignment\n                  playsInline\n                }\n              }\n              id\n            }\n            id\n          }\n          id\n        }\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d6a5cad9228906bbbbca21f56dc72fef";

export default node;
