/**
 * @generated SignedSource<<dea16a042484ecf8852c41760aa10ec4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
export type MediaOrientation = "left" | "right";
export type ModalPosition = "bottom_left" | "bottom_right" | "center" | "top_left" | "top_right";
export type ModalSize = "large" | "medium" | "small";
export type StepBodyOrientation = "horizontal" | "vertical";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
export type LibraryTemplatePreviewQuery$variables = {
  entityId: any;
};
export type LibraryTemplatePreviewQuery$data = {
  readonly template: {
    readonly designType: GuideDesignTypeEnumType;
    readonly displayTitle: string | null;
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
    readonly isCyoa: boolean;
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
        readonly entityId: any;
        readonly manualCompletionDisabled: boolean;
        readonly name: string;
        readonly stepType: StepTypeEnum;
      }>;
    }>;
    readonly name: string | null;
    readonly pageTargetingType: GuidePageTargetingEnumType;
    readonly theme: ThemeType;
    readonly type: GuideTypeEnumType;
  } | null;
  readonly uiSettings: {
    readonly " $fragmentSpreads": FragmentRefs<"UISettings_all">;
  } | null;
};
export type LibraryTemplatePreviewQuery = {
  response: LibraryTemplatePreviewQuery$data;
  variables: LibraryTemplatePreviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "entityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "entityId"
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v12 = {
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
    (v8/*: any*/),
    (v9/*: any*/),
    (v10/*: any*/),
    (v11/*: any*/)
  ],
  "type": "BannerStyle",
  "abstractKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v22 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "modalSize",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "position",
      "storageKey": null
    },
    (v13/*: any*/),
    (v10/*: any*/),
    (v8/*: any*/),
    (v9/*: any*/),
    (v14/*: any*/),
    (v15/*: any*/),
    (v16/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v11/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v21/*: any*/)
  ],
  "type": "ModalStyle",
  "abstractKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundOverlayColor",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundOverlayOpacity",
  "storageKey": null
},
v25 = {
  "kind": "InlineFragment",
  "selections": [
    (v8/*: any*/),
    (v23/*: any*/),
    (v24/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasArrow",
      "storageKey": null
    },
    (v13/*: any*/),
    (v9/*: any*/),
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
    (v10/*: any*/),
    (v14/*: any*/),
    (v15/*: any*/),
    (v16/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v11/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v21/*: any*/)
  ],
  "type": "TooltipStyle",
  "abstractKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
},
v31 = {
  "kind": "InlineFragment",
  "selections": [
    (v8/*: any*/),
    (v9/*: any*/),
    (v10/*: any*/),
    (v14/*: any*/),
    (v15/*: any*/),
    (v16/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v26/*: any*/),
    (v19/*: any*/),
    (v27/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v11/*: any*/),
    (v20/*: any*/),
    (v21/*: any*/)
  ],
  "type": "CardStyle",
  "abstractKey": null
},
v32 = {
  "kind": "InlineFragment",
  "selections": [
    (v8/*: any*/),
    (v9/*: any*/),
    (v10/*: any*/),
    (v14/*: any*/),
    (v15/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dotsColor",
      "storageKey": null
    },
    (v26/*: any*/),
    (v19/*: any*/),
    (v27/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v11/*: any*/)
  ],
  "type": "CarouselStyle",
  "abstractKey": null
},
v33 = {
  "kind": "InlineFragment",
  "selections": [
    (v8/*: any*/),
    (v9/*: any*/),
    (v10/*: any*/),
    (v27/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
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
v34 = {
  "kind": "InlineFragment",
  "selections": [
    (v14/*: any*/),
    (v15/*: any*/),
    (v26/*: any*/),
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
    (v19/*: any*/),
    (v11/*: any*/)
  ],
  "type": "ChecklistStyle",
  "abstractKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingType",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manualCompletionDisabled",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingQuestion",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingMultiple",
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingDismissDisabled",
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingFormFactor",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingKey",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingEntityType",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "choiceKey",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityType",
  "storageKey": null
},
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "templateEntityId",
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "moduleEntityId",
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v53 = {
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
v54 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "shadow",
  "storageKey": null
},
v58 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v59 = [
  (v4/*: any*/),
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
      (v56/*: any*/)
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
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "paddingX",
  "storageKey": null
},
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "paddingY",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LibraryTemplatePreviewQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v12/*: any*/),
              (v22/*: any*/),
              (v25/*: any*/),
              (v31/*: any*/),
              (v32/*: any*/),
              (v33/*: any*/),
              (v34/*: any*/)
            ],
            "storageKey": null
          },
          (v35/*: any*/),
          (v36/*: any*/),
          (v37/*: any*/),
          (v38/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "modules",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepPrototype",
                "kind": "LinkedField",
                "name": "stepPrototypes",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v39/*: any*/),
                  (v40/*: any*/),
                  (v41/*: any*/),
                  (v42/*: any*/),
                  (v43/*: any*/),
                  (v44/*: any*/),
                  (v45/*: any*/),
                  (v46/*: any*/),
                  (v47/*: any*/),
                  {
                    "alias": "branchingPathData",
                    "args": null,
                    "concreteType": "BranchingPath",
                    "kind": "LinkedField",
                    "name": "branchingPaths",
                    "plural": true,
                    "selections": [
                      (v48/*: any*/),
                      (v46/*: any*/),
                      (v49/*: any*/),
                      (v50/*: any*/),
                      (v51/*: any*/)
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
                      (v48/*: any*/),
                      (v52/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "style",
                        "plural": false,
                        "selections": [
                          (v53/*: any*/)
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
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "OrganizationUISettings",
        "kind": "LinkedField",
        "name": "uiSettings",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "UISettings_all"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LibraryTemplatePreviewQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v54/*: any*/),
              {
                "kind": "TypeDiscriminator",
                "abstractKey": "__isFormFactorStyle"
              },
              (v12/*: any*/),
              (v22/*: any*/),
              (v25/*: any*/),
              (v31/*: any*/),
              (v32/*: any*/),
              (v33/*: any*/),
              (v34/*: any*/)
            ],
            "storageKey": null
          },
          (v35/*: any*/),
          (v36/*: any*/),
          (v37/*: any*/),
          (v38/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "modules",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepPrototype",
                "kind": "LinkedField",
                "name": "stepPrototypes",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v39/*: any*/),
                  (v40/*: any*/),
                  (v41/*: any*/),
                  (v42/*: any*/),
                  (v43/*: any*/),
                  (v44/*: any*/),
                  (v45/*: any*/),
                  (v46/*: any*/),
                  (v47/*: any*/),
                  {
                    "alias": "branchingPathData",
                    "args": null,
                    "concreteType": "BranchingPath",
                    "kind": "LinkedField",
                    "name": "branchingPaths",
                    "plural": true,
                    "selections": [
                      (v48/*: any*/),
                      (v46/*: any*/),
                      (v49/*: any*/),
                      (v50/*: any*/),
                      (v51/*: any*/),
                      (v55/*: any*/)
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
                      (v48/*: any*/),
                      (v52/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "style",
                        "plural": false,
                        "selections": [
                          (v54/*: any*/),
                          {
                            "kind": "TypeDiscriminator",
                            "abstractKey": "__isBranchingStyle"
                          },
                          (v53/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v55/*: any*/)
                ],
                "storageKey": null
              },
              (v55/*: any*/)
            ],
            "storageKey": null
          },
          (v55/*: any*/)
        ],
        "storageKey": null
      },
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
              (v56/*: any*/)
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
          (v27/*: any*/),
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
          (v37/*: any*/),
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
              (v4/*: any*/),
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
              (v28/*: any*/),
              (v27/*: any*/),
              (v57/*: any*/),
              (v29/*: any*/)
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
              (v4/*: any*/),
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
              (v58/*: any*/),
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
              (v58/*: any*/),
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
                    "selections": (v59/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "IntegrationTargetingSegment",
                    "kind": "LinkedField",
                    "name": "accountUser",
                    "plural": false,
                    "selections": (v59/*: any*/),
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
              (v60/*: any*/),
              (v61/*: any*/),
              (v57/*: any*/),
              (v28/*: any*/),
              (v23/*: any*/),
              (v24/*: any*/)
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
              (v60/*: any*/),
              (v61/*: any*/),
              (v57/*: any*/),
              (v28/*: any*/)
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
              (v60/*: any*/),
              (v61/*: any*/),
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
              (v28/*: any*/)
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
              (v29/*: any*/),
              (v57/*: any*/),
              (v28/*: any*/)
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
    ]
  },
  "params": {
    "cacheID": "b55da468d847e96012fb056c792c5913",
    "id": null,
    "metadata": {},
    "name": "LibraryTemplatePreviewQuery",
    "operationKind": "query",
    "text": "query LibraryTemplatePreviewQuery(\n  $entityId: EntityId!\n) {\n  template: findTemplate(entityId: $entityId) {\n    entityId\n    name\n    type\n    isCyoa\n    displayTitle\n    formFactor\n    formFactorStyle {\n      __typename\n      __isFormFactorStyle: __typename\n      ... on BannerStyle {\n        bannerType\n        bannerPosition\n        backgroundColor\n        textColor\n        canDismiss\n        ctasOrientation\n      }\n      ... on ModalStyle {\n        modalSize\n        position\n        hasBackgroundOverlay\n        canDismiss\n        backgroundColor\n        textColor\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on TooltipStyle {\n        backgroundColor\n        backgroundOverlayColor\n        backgroundOverlayOpacity\n        hasArrow\n        hasBackgroundOverlay\n        textColor\n        tooltipShowOn\n        tooltipSize\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CardStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CarouselStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        dotsColor\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n      }\n      ... on VideoGalleryStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        selectedBackgroundColor\n        statusLabelColor\n      }\n      ... on ChecklistStyle {\n        stepBodyOrientation\n        mediaOrientation\n        height\n        hideStepGroupTitle\n        hideCompletedSteps\n        imageWidth\n        ctasOrientation\n      }\n    }\n    designType\n    isSideQuest\n    theme\n    pageTargetingType\n    modules {\n      entityId\n      name\n      displayTitle\n      stepPrototypes {\n        entityId\n        name\n        bodySlate\n        stepType\n        manualCompletionDisabled\n        branchingQuestion\n        branchingMultiple\n        branchingDismissDisabled\n        branchingFormFactor\n        branchingKey\n        branchingEntityType\n        branchingPathData: branchingPaths {\n          choiceKey\n          branchingKey\n          entityType\n          templateEntityId\n          moduleEntityId\n          id\n        }\n        branchingChoices {\n          choiceKey\n          label\n          style {\n            __typename\n            __isBranchingStyle: __typename\n            ... on BranchingCardStyle {\n              backgroundImageUrl\n              backgroundImagePosition\n            }\n          }\n        }\n        id\n      }\n      id\n    }\n    id\n  }\n  uiSettings {\n    ...UISettings_all\n  }\n}\n\nfragment UISettings_all on OrganizationUISettings {\n  primaryColorHex\n  additionalColors {\n    value\n  }\n  secondaryColorHex\n  sidebarStyle\n  appContainerIdentifier\n  fontColorHex\n  borderColor\n  embedBackgroundHex\n  sidebarBackgroundColor\n  cardBackgroundColor\n  toggleStyle\n  toggleColorHex\n  toggleText\n  sidebarSide\n  toggleTextColor\n  isEmbedToggleColorInverted\n  embedCustomCss\n  embedToggleBehavior\n  tagPrimaryColor\n  tagTextColor\n  tagDotSize\n  tagPulseLevel\n  tagBadgeIconPadding\n  tagBadgeIconBorderRadius\n  tagCustomIconUrl\n  tagVisibility\n  paragraphFontSize\n  sidebarVisibility\n  sidebarAvailability\n  paragraphLineHeight\n  cyoaOptionBackgroundColor\n  cyoaOptionBorderColor\n  cyoaOptionShadow\n  cyoaOptionShadowHover\n  cyoaTextColor\n  theme\n  floatingAnchorXOffset\n  floatingAnchorYOffset\n  stepCompletionStyle\n  stepSeparationStyle {\n    type\n    boxCompleteBackgroundColor\n    boxActiveStepShadow\n    boxBorderRadius\n  }\n  inlineContextualStyle {\n    borderRadius\n    borderColor\n    shadow\n    padding\n  }\n  inlineEmptyBehaviour\n  sidebarHeader {\n    type\n    progressBar\n    closeIcon\n    showModuleNameInStepView\n  }\n  sidebarBlocklistedUrls\n  allGuidesStyle {\n    allGuidesTitle\n    activeGuidesTitle\n    previousGuidesTitle\n    previousAnnouncementsTitle\n  }\n  quickLinks {\n    url\n    title\n    icon\n  }\n  helpCenter {\n    source\n    url\n    liveChat\n    issueSubmission\n    kbSearch\n    targeting {\n      account {\n        type\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n        grouping\n      }\n      accountUser {\n        type\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n        grouping\n      }\n    }\n  }\n  helpCenterStyle {\n    supportTicketTitle\n    chatTitle\n  }\n  modalsStyle {\n    paddingX\n    paddingY\n    shadow\n    borderRadius\n    backgroundOverlayColor\n    backgroundOverlayOpacity\n  }\n  tooltipsStyle {\n    paddingX\n    paddingY\n    shadow\n    borderRadius\n  }\n  ctasStyle {\n    paddingX\n    paddingY\n    fontSize\n    lineHeight\n    borderRadius\n  }\n  bannersStyle {\n    padding\n    shadow\n    borderRadius\n  }\n  responsiveVisibility {\n    all\n  }\n}\n"
  }
};
})();

(node as any).hash = "6670a0d65fffa9d739f29b38c6708d41";

export default node;
