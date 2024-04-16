/**
 * @generated SignedSource<<1e2a6f77dc53cb5e0ac458c79f3aec57>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type BannerPosition = "bottom" | "top";
export type BannerType = "floating" | "inline";
export type BranchingPathEntityType = "guide" | "module" | "template";
export type ContextualTagAlignmentEnumType = "bottom_left" | "bottom_right" | "center_left" | "center_right" | "top_left" | "top_right";
export type ContextualTagTooltipAlignmentEnumType = "bottom" | "left" | "right" | "top";
export type ContextualTagTypeEnumType = "badge" | "badge_dot" | "badge_icon" | "dot" | "highlight" | "icon";
export type CtasOrientation = "inline" | "left" | "right" | "spaceBetween";
export type DropdownInputVariationEnumType = "cards" | "dropdown";
export type GuideBaseState = "active" | "archived" | "draft" | "inactive" | "obsoleted" | "paused";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type HorizontalMediaAlignment = "center" | "left" | "right";
export type InputStepFieldTypeEnumType = "date" | "dropdown" | "email" | "nps" | "numberPoll" | "paragraph" | "text";
export type MediaOrientation = "left" | "right";
export type MediaTypeEnumType = "image" | "number_attribute" | "video";
export type ModalPosition = "bottom_left" | "bottom_right" | "center" | "top_left" | "top_right";
export type ModalSize = "large" | "medium" | "small";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
export type StepBodyOrientation = "horizontal" | "vertical";
export type StepCompletedBy = "accountUser" | "auto" | "user";
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
export type VisualTagHighlightType = "halo" | "none" | "overlay" | "solid";
export type EditAccountGuideBaseQuery$variables = {
  entityId: any;
};
export type EditAccountGuideBaseQuery$data = {
  readonly guideBase: {
    readonly account: {
      readonly entityId: any;
      readonly name: string;
      readonly primaryContact: {
        readonly entityId: any;
      } | null;
    };
    readonly accountGuide: {
      readonly entityId: any;
      readonly guideModules: ReadonlyArray<{
        readonly entityId: any;
        readonly steps: ReadonlyArray<{
          readonly body: string | null;
          readonly bodySlate: any | null;
          readonly completedAt: any | null;
          readonly completedByAccountUser: {
            readonly email: string | null;
            readonly fullName: string | null;
          } | null;
          readonly completedByType: StepCompletedBy | null;
          readonly completedByUser: {
            readonly email: string;
            readonly fullName: string | null;
          } | null;
          readonly createdFromStepPrototype: {
            readonly entityId: any;
          };
          readonly entityId: any;
          readonly isAutoCompletable: boolean;
          readonly name: string;
          readonly orderIndex: number;
          readonly stepType: StepTypeEnum;
          readonly usersViewed: ReadonlyArray<{
            readonly email: string | null;
            readonly fullName: string | null;
          }>;
        }>;
      }>;
    } | null;
    readonly createdFromTemplate: {
      readonly entityId: any;
      readonly name: string | null;
    } | null;
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
    readonly guideModuleBases: ReadonlyArray<{
      readonly createdFromModule: {
        readonly entityId: any;
      } | null;
      readonly entityId: any;
      readonly guideStepBases: ReadonlyArray<{
        readonly body: string | null;
        readonly bodySlate: any | null;
        readonly branchingDismissDisabled: boolean | null;
        readonly branchingMultiple: boolean | null;
        readonly branchingPaths: ReadonlyArray<{
          readonly entityType: BranchingPathEntityType;
        }> | null;
        readonly branchingQuestion: string | null;
        readonly createdFromStepPrototype: {
          readonly entityId: any;
          readonly isAutoCompletable: boolean;
        } | null;
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
        readonly inputs: ReadonlyArray<{
          readonly entityId: any;
          readonly label: string;
          readonly settings: {
            readonly helperText?: string | null;
            readonly maxLabel?: string | null;
            readonly maxValue?: number | null;
            readonly minLabel?: string | null;
            readonly minValue?: number | null;
            readonly multiSelect?: boolean;
            readonly options?: ReadonlyArray<{
              readonly label: string | null;
              readonly value: string | null;
            }>;
            readonly placeholder?: string | null;
            readonly required?: boolean;
            readonly variation?: DropdownInputVariationEnumType;
          } | null;
          readonly type: InputStepFieldTypeEnumType;
        }>;
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
        readonly orderIndex: number;
        readonly stepType: StepTypeEnum;
        readonly taggedElements: ReadonlyArray<{
          readonly alignment: ContextualTagAlignmentEnumType;
          readonly elementSelector: string;
          readonly entityId: any;
          readonly relativeToText: boolean;
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
          readonly tooltipAlignment: ContextualTagTooltipAlignmentEnumType;
          readonly type: ContextualTagTypeEnumType;
          readonly url: string;
          readonly wildcardUrl: string;
          readonly xOffset: number;
          readonly yOffset: number;
        }>;
      }>;
      readonly name: string;
      readonly orderIndex: number;
    }>;
    readonly guides: ReadonlyArray<{
      readonly entityId: any;
    }>;
    readonly isCyoa: boolean;
    readonly isModifiedFromTemplate: boolean;
    readonly isSideQuest: boolean | null;
    readonly isTargetedForSplitTesting: SplitTestStateEnumType;
    readonly name: string | null;
    readonly pageTargetingType: GuidePageTargetingEnumType;
    readonly state: GuideBaseState;
    readonly theme: ThemeType;
    readonly type: GuideTypeEnumType;
    readonly wasAutoLaunched: boolean;
  } | null;
};
export type EditAccountGuideBaseQuery = {
  response: EditAccountGuideBaseQuery$data;
  variables: EditAccountGuideBaseQuery$variables;
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
  "name": "state",
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
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
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
  "name": "isTargetedForSplitTesting",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isModifiedFromTemplate",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingType",
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
  "name": "wasAutoLaunched",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "orderIndex",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completedAt",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completedByType",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoCompletable",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v48 = [
  (v46/*: any*/),
  (v47/*: any*/)
],
v49 = [
  (v3/*: any*/)
],
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingQuestion",
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingMultiple",
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingDismissDisabled",
  "storageKey": null
},
v53 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityType",
  "storageKey": null
},
v54 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "style",
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v57 = {
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
v58 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "destinationGuide",
  "storageKey": null
},
v59 = {
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
v60 = {
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
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v62 = {
  "kind": "InlineFragment",
  "selections": [
    (v61/*: any*/),
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
v63 = {
  "kind": "InlineFragment",
  "selections": [
    (v61/*: any*/),
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
v64 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v65 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "xOffset",
  "storageKey": null
},
v66 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "yOffset",
  "storageKey": null
},
v67 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relativeToText",
  "storageKey": null
},
v68 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v69 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tooltipAlignment",
  "storageKey": null
},
v70 = {
  "kind": "InlineFragment",
  "selections": [
    (v10/*: any*/),
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
    (v32/*: any*/),
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
    (v55/*: any*/)
  ],
  "type": "VisualTagHighlightSettings",
  "abstractKey": null
},
v71 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v72 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "required",
  "storageKey": null
},
v73 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "helperText",
  "storageKey": null
},
v74 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxValue",
  "storageKey": null
},
v75 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "placeholder",
      "storageKey": null
    },
    (v72/*: any*/),
    (v73/*: any*/),
    (v74/*: any*/)
  ],
  "type": "TextOrEmailSettings",
  "abstractKey": null
},
v76 = {
  "kind": "InlineFragment",
  "selections": [
    (v72/*: any*/),
    (v73/*: any*/)
  ],
  "type": "NpsSettings",
  "abstractKey": null
},
v77 = {
  "kind": "InlineFragment",
  "selections": [
    (v72/*: any*/),
    (v73/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "minLabel",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "minValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxLabel",
      "storageKey": null
    },
    (v74/*: any*/)
  ],
  "type": "NumberPollSettings",
  "abstractKey": null
},
v78 = {
  "kind": "InlineFragment",
  "selections": [
    (v72/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "multiSelect",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "variation",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DropdownInputOption",
      "kind": "LinkedField",
      "name": "options",
      "plural": true,
      "selections": [
        (v71/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "value",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "DropdownSettings",
  "abstractKey": null
},
v79 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v80 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v81 = [
  (v46/*: any*/),
  (v47/*: any*/),
  (v80/*: any*/)
],
v82 = [
  (v3/*: any*/),
  (v80/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditAccountGuideBaseQuery",
    "selections": [
      {
        "alias": "guideBase",
        "args": (v1/*: any*/),
        "concreteType": "GuideBase",
        "kind": "LinkedField",
        "name": "findGuideBase",
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
          {
            "alias": null,
            "args": null,
            "concreteType": "Guide",
            "kind": "LinkedField",
            "name": "accountGuide",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideModule",
                "kind": "LinkedField",
                "name": "guideModules",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Step",
                    "kind": "LinkedField",
                    "name": "steps",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      (v3/*: any*/),
                      (v39/*: any*/),
                      (v40/*: any*/),
                      (v41/*: any*/),
                      (v42/*: any*/),
                      (v43/*: any*/),
                      (v44/*: any*/),
                      (v45/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AccountUser",
                        "kind": "LinkedField",
                        "name": "usersViewed",
                        "plural": true,
                        "selections": (v48/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "User",
                        "kind": "LinkedField",
                        "name": "completedByUser",
                        "plural": false,
                        "selections": (v48/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AccountUser",
                        "kind": "LinkedField",
                        "name": "completedByAccountUser",
                        "plural": false,
                        "selections": (v48/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepPrototype",
                        "kind": "LinkedField",
                        "name": "createdFromStepPrototype",
                        "plural": false,
                        "selections": (v49/*: any*/),
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
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "createdFromTemplate",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Guide",
            "kind": "LinkedField",
            "name": "guides",
            "plural": true,
            "selections": (v49/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "primaryContact",
                "plural": false,
                "selections": (v49/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideModuleBase",
            "kind": "LinkedField",
            "name": "guideModuleBases",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v3/*: any*/),
              (v40/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "createdFromModule",
                "plural": false,
                "selections": (v49/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideStepBase",
                "kind": "LinkedField",
                "name": "guideStepBases",
                "plural": true,
                "selections": [
                  (v4/*: any*/),
                  (v3/*: any*/),
                  (v39/*: any*/),
                  (v40/*: any*/),
                  (v44/*: any*/),
                  (v43/*: any*/),
                  (v50/*: any*/),
                  (v51/*: any*/),
                  (v52/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BranchingPath",
                    "kind": "LinkedField",
                    "name": "branchingPaths",
                    "plural": true,
                    "selections": [
                      (v53/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototype",
                    "kind": "LinkedField",
                    "name": "createdFromStepPrototype",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v45/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuideBaseStepCta",
                    "kind": "LinkedField",
                    "name": "ctas",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v10/*: any*/),
                      (v54/*: any*/),
                      (v55/*: any*/),
                      (v56/*: any*/),
                      (v57/*: any*/),
                      (v58/*: any*/)
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
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Media",
                        "kind": "LinkedField",
                        "name": "media",
                        "plural": false,
                        "selections": [
                          (v10/*: any*/),
                          (v56/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "meta",
                            "plural": false,
                            "selections": [
                              (v59/*: any*/),
                              (v60/*: any*/)
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
                          (v62/*: any*/),
                          (v63/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuideBaseStepTaggedElement",
                    "kind": "LinkedField",
                    "name": "taggedElements",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v10/*: any*/),
                      (v56/*: any*/),
                      (v64/*: any*/),
                      (v61/*: any*/),
                      (v65/*: any*/),
                      (v66/*: any*/),
                      (v67/*: any*/),
                      (v68/*: any*/),
                      (v69/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "style",
                        "plural": false,
                        "selections": [
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
                    "concreteType": "InputStepBase",
                    "kind": "LinkedField",
                    "name": "inputs",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v71/*: any*/),
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "settings",
                        "plural": false,
                        "selections": [
                          (v75/*: any*/),
                          (v76/*: any*/),
                          (v77/*: any*/),
                          (v78/*: any*/)
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
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditAccountGuideBaseQuery",
    "selections": [
      {
        "alias": "guideBase",
        "args": (v1/*: any*/),
        "concreteType": "GuideBase",
        "kind": "LinkedField",
        "name": "findGuideBase",
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
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v79/*: any*/),
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
          {
            "alias": null,
            "args": null,
            "concreteType": "Guide",
            "kind": "LinkedField",
            "name": "accountGuide",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideModule",
                "kind": "LinkedField",
                "name": "guideModules",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Step",
                    "kind": "LinkedField",
                    "name": "steps",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      (v3/*: any*/),
                      (v39/*: any*/),
                      (v40/*: any*/),
                      (v41/*: any*/),
                      (v42/*: any*/),
                      (v43/*: any*/),
                      (v44/*: any*/),
                      (v45/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AccountUser",
                        "kind": "LinkedField",
                        "name": "usersViewed",
                        "plural": true,
                        "selections": (v81/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "User",
                        "kind": "LinkedField",
                        "name": "completedByUser",
                        "plural": false,
                        "selections": (v81/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AccountUser",
                        "kind": "LinkedField",
                        "name": "completedByAccountUser",
                        "plural": false,
                        "selections": (v81/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepPrototype",
                        "kind": "LinkedField",
                        "name": "createdFromStepPrototype",
                        "plural": false,
                        "selections": (v82/*: any*/),
                        "storageKey": null
                      },
                      (v80/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v80/*: any*/)
                ],
                "storageKey": null
              },
              (v80/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "createdFromTemplate",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v3/*: any*/),
              (v80/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Guide",
            "kind": "LinkedField",
            "name": "guides",
            "plural": true,
            "selections": (v82/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "primaryContact",
                "plural": false,
                "selections": (v82/*: any*/),
                "storageKey": null
              },
              (v80/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideModuleBase",
            "kind": "LinkedField",
            "name": "guideModuleBases",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v3/*: any*/),
              (v40/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "createdFromModule",
                "plural": false,
                "selections": (v82/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideStepBase",
                "kind": "LinkedField",
                "name": "guideStepBases",
                "plural": true,
                "selections": [
                  (v4/*: any*/),
                  (v3/*: any*/),
                  (v39/*: any*/),
                  (v40/*: any*/),
                  (v44/*: any*/),
                  (v43/*: any*/),
                  (v50/*: any*/),
                  (v51/*: any*/),
                  (v52/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BranchingPath",
                    "kind": "LinkedField",
                    "name": "branchingPaths",
                    "plural": true,
                    "selections": [
                      (v53/*: any*/),
                      (v80/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototype",
                    "kind": "LinkedField",
                    "name": "createdFromStepPrototype",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v45/*: any*/),
                      (v80/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuideBaseStepCta",
                    "kind": "LinkedField",
                    "name": "ctas",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v10/*: any*/),
                      (v54/*: any*/),
                      (v55/*: any*/),
                      (v56/*: any*/),
                      (v57/*: any*/),
                      (v58/*: any*/),
                      (v80/*: any*/)
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
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Media",
                        "kind": "LinkedField",
                        "name": "media",
                        "plural": false,
                        "selections": [
                          (v10/*: any*/),
                          (v56/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "meta",
                            "plural": false,
                            "selections": [
                              (v79/*: any*/),
                              (v59/*: any*/),
                              (v60/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v80/*: any*/)
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
                          (v79/*: any*/),
                          (v62/*: any*/),
                          (v63/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v80/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuideBaseStepTaggedElement",
                    "kind": "LinkedField",
                    "name": "taggedElements",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v10/*: any*/),
                      (v56/*: any*/),
                      (v64/*: any*/),
                      (v61/*: any*/),
                      (v65/*: any*/),
                      (v66/*: any*/),
                      (v67/*: any*/),
                      (v68/*: any*/),
                      (v69/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "style",
                        "plural": false,
                        "selections": [
                          (v79/*: any*/),
                          {
                            "kind": "TypeDiscriminator",
                            "abstractKey": "__isVisualTagStyleSettings"
                          },
                          (v70/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v80/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "InputStepBase",
                    "kind": "LinkedField",
                    "name": "inputs",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v71/*: any*/),
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "settings",
                        "plural": false,
                        "selections": [
                          (v79/*: any*/),
                          {
                            "kind": "TypeDiscriminator",
                            "abstractKey": "__isInputSettings"
                          },
                          (v75/*: any*/),
                          (v76/*: any*/),
                          (v77/*: any*/),
                          (v78/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v80/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v80/*: any*/)
                ],
                "storageKey": null
              },
              (v80/*: any*/)
            ],
            "storageKey": null
          },
          (v80/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "904b0135196c00233b8c7ced57ad58b8",
    "id": null,
    "metadata": {},
    "name": "EditAccountGuideBaseQuery",
    "operationKind": "query",
    "text": "query EditAccountGuideBaseQuery(\n  $entityId: EntityId!\n) {\n  guideBase: findGuideBase(entityId: $entityId) {\n    state\n    entityId\n    name\n    theme\n    formFactor\n    isCyoa\n    isTargetedForSplitTesting\n    isModifiedFromTemplate\n    type\n    isSideQuest\n    pageTargetingType\n    formFactorStyle {\n      __typename\n      __isFormFactorStyle: __typename\n      ... on BannerStyle {\n        bannerType\n        bannerPosition\n        backgroundColor\n        textColor\n        canDismiss\n        ctasOrientation\n      }\n      ... on ModalStyle {\n        modalSize\n        position\n        hasBackgroundOverlay\n        canDismiss\n        backgroundColor\n        textColor\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on TooltipStyle {\n        backgroundColor\n        backgroundOverlayColor\n        backgroundOverlayOpacity\n        hasArrow\n        hasBackgroundOverlay\n        textColor\n        tooltipShowOn\n        tooltipSize\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CardStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CarouselStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        dotsColor\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n      }\n      ... on VideoGalleryStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        selectedBackgroundColor\n        statusLabelColor\n      }\n      ... on ChecklistStyle {\n        stepBodyOrientation\n        mediaOrientation\n        height\n        hideStepGroupTitle\n        hideCompletedSteps\n        imageWidth\n        ctasOrientation\n      }\n    }\n    wasAutoLaunched\n    accountGuide {\n      entityId\n      guideModules {\n        entityId\n        steps {\n          name\n          entityId\n          body\n          orderIndex\n          completedAt\n          completedByType\n          stepType\n          bodySlate\n          isAutoCompletable\n          usersViewed {\n            fullName\n            email\n            id\n          }\n          completedByUser {\n            fullName\n            email\n            id\n          }\n          completedByAccountUser {\n            fullName\n            email\n            id\n          }\n          createdFromStepPrototype {\n            entityId\n            id\n          }\n          id\n        }\n        id\n      }\n      id\n    }\n    createdFromTemplate {\n      name\n      entityId\n      id\n    }\n    guides {\n      entityId\n      id\n    }\n    account {\n      entityId\n      name\n      primaryContact {\n        entityId\n        id\n      }\n      id\n    }\n    guideModuleBases {\n      name\n      entityId\n      orderIndex\n      createdFromModule {\n        entityId\n        id\n      }\n      guideStepBases {\n        name\n        entityId\n        body\n        orderIndex\n        bodySlate\n        stepType\n        branchingQuestion\n        branchingMultiple\n        branchingDismissDisabled\n        branchingPaths {\n          entityType\n          id\n        }\n        createdFromStepPrototype {\n          entityId\n          isAutoCompletable\n          id\n        }\n        ctas {\n          entityId\n          type\n          style\n          text\n          url\n          settings {\n            bgColorField\n            textColorField\n            eventName\n            markComplete\n            implicit\n            opensInNewTab\n          }\n          destinationGuide\n          id\n        }\n        mediaReferences {\n          entityId\n          media {\n            type\n            url\n            meta {\n              __typename\n              ... on ImageMediaMeta {\n                naturalWidth\n                naturalHeight\n              }\n              ... on VideoMediaMeta {\n                videoId\n                videoType\n              }\n            }\n            id\n          }\n          settings {\n            __typename\n            ... on ImageMediaReferenceSettings {\n              alignment\n              fill\n              hyperlink\n              lightboxDisabled\n            }\n            ... on VideoMediaReferenceSettings {\n              alignment\n              playsInline\n            }\n          }\n          id\n        }\n        taggedElements {\n          entityId\n          type\n          url\n          wildcardUrl\n          alignment\n          xOffset\n          yOffset\n          relativeToText\n          elementSelector\n          tooltipAlignment\n          style {\n            __typename\n            __isVisualTagStyleSettings: __typename\n            ... on VisualTagHighlightSettings {\n              type\n              pulse\n              color\n              thickness\n              padding\n              radius\n              opacity\n              text\n            }\n          }\n          id\n        }\n        inputs {\n          entityId\n          label\n          type\n          settings {\n            __typename\n            __isInputSettings: __typename\n            ... on TextOrEmailSettings {\n              placeholder\n              required\n              helperText\n              maxValue\n            }\n            ... on NpsSettings {\n              required\n              helperText\n            }\n            ... on NumberPollSettings {\n              required\n              helperText\n              minLabel\n              minValue\n              maxLabel\n              maxValue\n            }\n            ... on DropdownSettings {\n              required\n              multiSelect\n              variation\n              options {\n                label\n                value\n              }\n            }\n          }\n          id\n        }\n        id\n      }\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2c5b5c17a42ab7051812b2454b7c9a13";

export default node;
