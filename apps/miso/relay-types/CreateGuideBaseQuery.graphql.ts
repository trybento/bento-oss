/**
 * @generated SignedSource<<0fe9993e7fdec89df8fdaee9b8613f22>>
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
export type CtasOrientation = "inline" | "left" | "right" | "spaceBetween";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type HorizontalMediaAlignment = "center" | "left" | "right";
export type MediaOrientation = "left" | "right";
export type ModalPosition = "bottom_left" | "bottom_right" | "center" | "top_left" | "top_right";
export type ModalSize = "large" | "medium" | "small";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
export type StepBodyOrientation = "horizontal" | "vertical";
export type TemplateState = "draft" | "live" | "removed" | "stopped";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
export type CreateGuideBaseQuery$variables = {
  accountEntityId: any;
};
export type CreateGuideBaseQuery$data = {
  readonly account: {
    readonly entityId: any;
    readonly externalId: string | null;
    readonly guideBases: ReadonlyArray<{
      readonly createdFromTemplate: {
        readonly entityId: any;
      } | null;
    }>;
    readonly name: string;
    readonly " $fragmentSpreads": FragmentRefs<"TemplateOption_account">;
  } | null;
  readonly templates: ReadonlyArray<{
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
    readonly isAutoLaunchEnabled: boolean | null;
    readonly isCyoa: boolean;
    readonly isSideQuest: boolean | null;
    readonly isTargetedForSplitTesting: SplitTestStateEnumType;
    readonly isTemplate: boolean;
    readonly modules: ReadonlyArray<{
      readonly hasBranchingStep: boolean | null;
      readonly hasInputStep: boolean | null;
    }>;
    readonly name: string | null;
    readonly privateName: string | null;
    readonly state: TemplateState;
    readonly theme: ThemeType;
    readonly type: GuideTypeEnumType;
    readonly " $fragmentSpreads": FragmentRefs<"TemplateOption_template">;
  }>;
};
export type CreateGuideBaseQuery = {
  response: CreateGuideBaseQuery$data;
  variables: CreateGuideBaseQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "accountEntityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "externalId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isTemplate",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isTargetedForSplitTesting",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoLaunchEnabled",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v17 = {
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
    (v13/*: any*/),
    (v14/*: any*/),
    (v15/*: any*/),
    (v16/*: any*/)
  ],
  "type": "BannerStyle",
  "abstractKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v27 = {
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
    (v18/*: any*/),
    (v15/*: any*/),
    (v13/*: any*/),
    (v14/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v21/*: any*/),
    (v22/*: any*/),
    (v23/*: any*/),
    (v16/*: any*/),
    (v24/*: any*/),
    (v25/*: any*/),
    (v26/*: any*/)
  ],
  "type": "ModalStyle",
  "abstractKey": null
},
v28 = {
  "kind": "InlineFragment",
  "selections": [
    (v13/*: any*/),
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
    (v18/*: any*/),
    (v14/*: any*/),
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
    (v15/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v21/*: any*/),
    (v22/*: any*/),
    (v23/*: any*/),
    (v16/*: any*/),
    (v24/*: any*/),
    (v25/*: any*/),
    (v26/*: any*/)
  ],
  "type": "TooltipStyle",
  "abstractKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
},
v34 = {
  "kind": "InlineFragment",
  "selections": [
    (v13/*: any*/),
    (v14/*: any*/),
    (v15/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v21/*: any*/),
    (v22/*: any*/),
    (v23/*: any*/),
    (v29/*: any*/),
    (v24/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v32/*: any*/),
    (v33/*: any*/),
    (v16/*: any*/),
    (v25/*: any*/),
    (v26/*: any*/)
  ],
  "type": "CardStyle",
  "abstractKey": null
},
v35 = {
  "kind": "InlineFragment",
  "selections": [
    (v13/*: any*/),
    (v14/*: any*/),
    (v15/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dotsColor",
      "storageKey": null
    },
    (v29/*: any*/),
    (v24/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v32/*: any*/),
    (v33/*: any*/),
    (v16/*: any*/)
  ],
  "type": "CarouselStyle",
  "abstractKey": null
},
v36 = {
  "kind": "InlineFragment",
  "selections": [
    (v13/*: any*/),
    (v14/*: any*/),
    (v15/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v32/*: any*/),
    (v33/*: any*/),
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
v37 = {
  "kind": "InlineFragment",
  "selections": [
    (v19/*: any*/),
    (v20/*: any*/),
    (v29/*: any*/),
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
    (v24/*: any*/),
    (v16/*: any*/)
  ],
  "type": "ChecklistStyle",
  "abstractKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBranchingStep",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasInputStep",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v43 = {
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
    "name": "CreateGuideBaseQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "guideBases",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "createdFromTemplate",
                "plural": false,
                "selections": [
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TemplateOption_account"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          (v3/*: any*/),
          (v7/*: any*/),
          (v2/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v17/*: any*/),
              (v27/*: any*/),
              (v28/*: any*/),
              (v34/*: any*/),
              (v35/*: any*/),
              (v36/*: any*/),
              (v37/*: any*/)
            ],
            "storageKey": null
          },
          (v38/*: any*/),
          (v39/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "modules",
            "plural": true,
            "selections": [
              (v40/*: any*/),
              (v41/*: any*/)
            ],
            "storageKey": null
          },
          (v42/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TemplateOption_template"
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
    "name": "CreateGuideBaseQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "guideBases",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "createdFromTemplate",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v43/*: any*/)
                ],
                "storageKey": null
              },
              (v43/*: any*/)
            ],
            "storageKey": null
          },
          (v43/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          (v3/*: any*/),
          (v7/*: any*/),
          (v2/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              {
                "kind": "TypeDiscriminator",
                "abstractKey": "__isFormFactorStyle"
              },
              (v17/*: any*/),
              (v27/*: any*/),
              (v28/*: any*/),
              (v34/*: any*/),
              (v35/*: any*/),
              (v36/*: any*/),
              (v37/*: any*/)
            ],
            "storageKey": null
          },
          (v38/*: any*/),
          (v39/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "modules",
            "plural": true,
            "selections": [
              (v40/*: any*/),
              (v41/*: any*/),
              (v43/*: any*/)
            ],
            "storageKey": null
          },
          (v42/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          (v43/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "51abb464c30426e1891a874259d124f5",
    "id": null,
    "metadata": {},
    "name": "CreateGuideBaseQuery",
    "operationKind": "query",
    "text": "query CreateGuideBaseQuery(\n  $accountEntityId: EntityId!\n) {\n  account: findAccount(entityId: $accountEntityId) {\n    name\n    entityId\n    externalId\n    guideBases {\n      createdFromTemplate {\n        entityId\n        id\n      }\n      id\n    }\n    ...TemplateOption_account\n    id\n  }\n  templates {\n    type\n    isTemplate\n    entityId\n    isCyoa\n    name\n    privateName\n    isTargetedForSplitTesting\n    isAutoLaunchEnabled\n    state\n    formFactor\n    formFactorStyle {\n      __typename\n      __isFormFactorStyle: __typename\n      ... on BannerStyle {\n        bannerType\n        bannerPosition\n        backgroundColor\n        textColor\n        canDismiss\n        ctasOrientation\n      }\n      ... on ModalStyle {\n        modalSize\n        position\n        hasBackgroundOverlay\n        canDismiss\n        backgroundColor\n        textColor\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on TooltipStyle {\n        backgroundColor\n        backgroundOverlayColor\n        backgroundOverlayOpacity\n        hasArrow\n        hasBackgroundOverlay\n        textColor\n        tooltipShowOn\n        tooltipSize\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CardStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CarouselStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        dotsColor\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n      }\n      ... on VideoGalleryStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        selectedBackgroundColor\n        statusLabelColor\n      }\n      ... on ChecklistStyle {\n        stepBodyOrientation\n        mediaOrientation\n        height\n        hideStepGroupTitle\n        hideCompletedSteps\n        imageWidth\n        ctasOrientation\n      }\n    }\n    theme\n    designType\n    modules {\n      hasBranchingStep\n      hasInputStep\n      id\n    }\n    isSideQuest\n    ...TemplateOption_template\n    id\n  }\n}\n\nfragment TemplateOption_account on Account {\n  name\n}\n\nfragment TemplateOption_template on Template {\n  name\n  formFactor\n  description\n}\n"
  }
};
})();

(node as any).hash = "6922192f1679b6619c1d048d2806000e";

export default node;
