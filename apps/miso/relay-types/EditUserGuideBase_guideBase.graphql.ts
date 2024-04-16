/**
 * @generated SignedSource<<340e6a959544f8dc458f7ecb19ba3556>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type BannerPosition = "bottom" | "top";
export type BannerType = "floating" | "inline";
export type BranchingPathEntityType = "guide" | "module" | "template";
export type ContextualTagAlignmentEnumType = "bottom_left" | "bottom_right" | "center_left" | "center_right" | "top_left" | "top_right";
export type ContextualTagTooltipAlignmentEnumType = "bottom" | "left" | "right" | "top";
export type ContextualTagTypeEnumType = "badge" | "badge_dot" | "badge_icon" | "dot" | "highlight" | "icon";
export type CtasOrientation = "inline" | "left" | "right" | "spaceBetween";
export type DropdownInputVariationEnumType = "cards" | "dropdown";
export type GuideBaseState = "active" | "archived" | "draft" | "inactive" | "obsoleted" | "paused";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
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
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
export type VisualTagHighlightType = "halo" | "none" | "overlay" | "solid";
import { FragmentRefs } from "relay-runtime";
export type EditUserGuideBase_guideBase$data = {
  readonly account: {
    readonly entityId: any;
    readonly name: string;
    readonly primaryContact: {
      readonly entityId: any;
    } | null;
  };
  readonly createdFromTemplate: {
    readonly entityId: any;
    readonly name: string | null;
    readonly privateName: string | null;
  } | null;
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
  readonly guideModuleBases: ReadonlyArray<{
    readonly createdFromModule: {
      readonly entityId: any;
    } | null;
    readonly dynamicallyAddedByStep: {
      readonly entityId: any;
      readonly name: string;
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
      readonly dismissLabel: string | null;
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
      readonly steps: ReadonlyArray<{
        readonly entityId: any;
        readonly stepType: StepTypeEnum;
      }>;
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
      readonly usersCompleted: ReadonlyArray<{
        readonly email: string | null;
        readonly fullName: string | null;
      }>;
      readonly usersViewed: ReadonlyArray<{
        readonly email: string | null;
        readonly fullName: string | null;
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
  readonly participantsCount: number;
  readonly participantsWhoViewedCount: number;
  readonly state: GuideBaseState;
  readonly theme: ThemeType;
  readonly type: GuideTypeEnumType;
  readonly wasAutoLaunched: boolean;
  readonly " $fragmentType": "EditUserGuideBase_guideBase";
};
export type EditUserGuideBase_guideBase$key = {
  readonly " $data"?: EditUserGuideBase_guideBase$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditUserGuideBase_guideBase">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = [
  (v0/*: any*/)
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "orderIndex",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v24 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "fullName",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "email",
    "storageKey": null
  }
],
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "required",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "helperText",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxValue",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditUserGuideBase_guideBase",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Account",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "User",
          "kind": "LinkedField",
          "name": "primaryContact",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "wasAutoLaunched",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "state",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isCyoa",
      "storageKey": null
    },
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isSideQuest",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isModifiedFromTemplate",
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
      "name": "isTargetedForSplitTesting",
      "storageKey": null
    },
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Template",
      "kind": "LinkedField",
      "name": "createdFromTemplate",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "privateName",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pageTargetingType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "formFactor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "formFactorStyle",
      "plural": false,
      "selections": [
        {
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
            (v4/*: any*/),
            (v5/*: any*/),
            (v6/*: any*/),
            (v7/*: any*/)
          ],
          "type": "BannerStyle",
          "abstractKey": null
        },
        {
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
            (v8/*: any*/),
            (v6/*: any*/),
            (v4/*: any*/),
            (v5/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            (v11/*: any*/),
            (v12/*: any*/),
            (v13/*: any*/),
            (v7/*: any*/),
            (v14/*: any*/),
            (v15/*: any*/),
            (v16/*: any*/)
          ],
          "type": "ModalStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v4/*: any*/),
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
            (v8/*: any*/),
            (v5/*: any*/),
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
            (v6/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            (v11/*: any*/),
            (v12/*: any*/),
            (v13/*: any*/),
            (v7/*: any*/),
            (v14/*: any*/),
            (v15/*: any*/),
            (v16/*: any*/)
          ],
          "type": "TooltipStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v4/*: any*/),
            (v5/*: any*/),
            (v6/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            (v11/*: any*/),
            (v12/*: any*/),
            (v13/*: any*/),
            (v17/*: any*/),
            (v14/*: any*/),
            (v18/*: any*/),
            (v19/*: any*/),
            (v20/*: any*/),
            (v21/*: any*/),
            (v7/*: any*/),
            (v15/*: any*/),
            (v16/*: any*/)
          ],
          "type": "CardStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v4/*: any*/),
            (v5/*: any*/),
            (v6/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "dotsColor",
              "storageKey": null
            },
            (v17/*: any*/),
            (v14/*: any*/),
            (v18/*: any*/),
            (v19/*: any*/),
            (v20/*: any*/),
            (v21/*: any*/),
            (v7/*: any*/)
          ],
          "type": "CarouselStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v4/*: any*/),
            (v5/*: any*/),
            (v6/*: any*/),
            (v18/*: any*/),
            (v19/*: any*/),
            (v20/*: any*/),
            (v21/*: any*/),
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
        {
          "kind": "InlineFragment",
          "selections": [
            (v9/*: any*/),
            (v10/*: any*/),
            (v17/*: any*/),
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
            (v14/*: any*/),
            (v7/*: any*/)
          ],
          "type": "ChecklistStyle",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "designType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "participantsCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "participantsWhoViewedCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Guide",
      "kind": "LinkedField",
      "name": "guides",
      "plural": true,
      "selections": (v2/*: any*/),
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
        (v1/*: any*/),
        (v0/*: any*/),
        (v22/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Step",
          "kind": "LinkedField",
          "name": "dynamicallyAddedByStep",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Module",
          "kind": "LinkedField",
          "name": "createdFromModule",
          "plural": false,
          "selections": (v2/*: any*/),
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
            (v1/*: any*/),
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "body",
              "storageKey": null
            },
            (v22/*: any*/),
            (v23/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "bodySlate",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "dismissLabel",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "branchingQuestion",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "branchingMultiple",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "branchingDismissDisabled",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "BranchingPath",
              "kind": "LinkedField",
              "name": "branchingPaths",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "entityType",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AccountUser",
              "kind": "LinkedField",
              "name": "usersViewed",
              "plural": true,
              "selections": (v24/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AccountUser",
              "kind": "LinkedField",
              "name": "usersCompleted",
              "plural": true,
              "selections": (v24/*: any*/),
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
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "isAutoCompletable",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Step",
              "kind": "LinkedField",
              "name": "steps",
              "plural": true,
              "selections": [
                (v0/*: any*/),
                (v23/*: any*/)
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
                (v0/*: any*/),
                (v3/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "style",
                  "storageKey": null
                },
                (v25/*: any*/),
                (v26/*: any*/),
                {
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "destinationGuide",
                  "storageKey": null
                }
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
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Media",
                  "kind": "LinkedField",
                  "name": "media",
                  "plural": false,
                  "selections": [
                    (v3/*: any*/),
                    (v26/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": null,
                      "kind": "LinkedField",
                      "name": "meta",
                      "plural": false,
                      "selections": [
                        {
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
                        {
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
                  "concreteType": null,
                  "kind": "LinkedField",
                  "name": "settings",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        (v27/*: any*/),
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
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        (v27/*: any*/),
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
              "concreteType": "GuideBaseStepTaggedElement",
              "kind": "LinkedField",
              "name": "taggedElements",
              "plural": true,
              "selections": [
                (v0/*: any*/),
                (v3/*: any*/),
                (v26/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "wildcardUrl",
                  "storageKey": null
                },
                (v27/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "xOffset",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "yOffset",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "relativeToText",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "elementSelector",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "tooltipAlignment",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": null,
                  "kind": "LinkedField",
                  "name": "style",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        (v3/*: any*/),
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
                        (v20/*: any*/),
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
                        (v25/*: any*/)
                      ],
                      "type": "VisualTagHighlightSettings",
                      "abstractKey": null
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
              "concreteType": "InputStepBase",
              "kind": "LinkedField",
              "name": "inputs",
              "plural": true,
              "selections": [
                (v0/*: any*/),
                (v28/*: any*/),
                (v3/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": null,
                  "kind": "LinkedField",
                  "name": "settings",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "placeholder",
                          "storageKey": null
                        },
                        (v29/*: any*/),
                        (v30/*: any*/),
                        (v31/*: any*/)
                      ],
                      "type": "TextOrEmailSettings",
                      "abstractKey": null
                    },
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        (v29/*: any*/),
                        (v30/*: any*/)
                      ],
                      "type": "NpsSettings",
                      "abstractKey": null
                    },
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        (v29/*: any*/),
                        (v30/*: any*/),
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
                        (v31/*: any*/)
                      ],
                      "type": "NumberPollSettings",
                      "abstractKey": null
                    },
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        (v29/*: any*/),
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
                            (v28/*: any*/),
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
  "type": "GuideBase",
  "abstractKey": null
};
})();

(node as any).hash = "f410fd9f1dff5f01de6a9c6e8c9d8f4a";

export default node;
