/**
 * @generated SignedSource<<80379abee083d211b53a8619c4b55938>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
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
export type StepBodyOrientation = "horizontal" | "vertical";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
import { FragmentRefs } from "relay-runtime";
export type GuideAnalytics_template$data = {
  readonly announcementActivity: ReadonlyArray<{
    readonly ctaActivity: ReadonlyArray<{
      readonly count: number;
      readonly ctaEntityId: any | null;
      readonly text: string;
    } | null>;
    readonly date: any;
    readonly dismissed: number;
    readonly savedForLater: number;
    readonly viewed: number;
  } | null>;
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
  readonly inputsCount: number;
  readonly isCyoa: boolean;
  readonly isSideQuest: boolean | null;
  readonly modules: ReadonlyArray<{
    readonly stepPrototypes: ReadonlyArray<{
      readonly branchingPerformance: ReadonlyArray<{
        readonly choiceText: string | null;
        readonly createdModule: {
          readonly displayTitle: string | null;
          readonly entityId: any;
          readonly stepPrototypes: ReadonlyArray<{
            readonly name: string;
            readonly stepCompletionStats: {
              readonly stepsCompleted: number | null;
              readonly totalSteps: number | null;
            };
            readonly stepType: StepTypeEnum;
          }>;
        } | null;
        readonly triggeredCount: number | null;
      }> | null;
      readonly ctas: ReadonlyArray<{
        readonly destinationGuideObj: {
          readonly entityId: any;
          readonly name: string | null;
        } | null;
        readonly settings: {
          readonly eventName: string | null;
        } | null;
        readonly text: string;
        readonly type: StepCtaTypeEnumType;
        readonly url: string | null;
      }>;
      readonly isAutoCompletable: boolean;
      readonly name: string;
      readonly stepCompletionStats: {
        readonly stepsCompleted: number | null;
        readonly totalSteps: number | null;
        readonly viewedSteps: number | null;
      };
      readonly stepType: StepTypeEnum;
    }>;
  }>;
  readonly name: string | null;
  readonly stats: {
    readonly accountsSeen: number | null;
    readonly averageStepsCompleted: number | null;
    readonly averageStepsCompletedForEngaged: number | null;
    readonly completedAStep: number | null;
    readonly guidesViewed: number | null;
    readonly guidesWithCompletedStep: number | null;
    readonly inputStepAnswersCount: number | null;
    readonly percentCompleted: number | null;
    readonly percentGuidesCompleted: number | null;
    readonly usersAnswered: number | null;
    readonly usersClickedCta: number | null;
    readonly usersDismissed: number | null;
    readonly usersSavedForLater: number | null;
    readonly usersSeenGuide: number | null;
  } | null;
  readonly theme: ThemeType;
  readonly type: GuideTypeEnumType;
  readonly " $fragmentType": "GuideAnalytics_template";
};
export type GuideAnalytics_template$key = {
  readonly " $data"?: GuideAnalytics_template$data;
  readonly " $fragmentSpreads": FragmentRefs<"GuideAnalytics_template">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v4 = [
  {
    "kind": "Variable",
    "name": "templateEntityId",
    "variableName": "templateEntityId"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepsCompleted",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalSteps",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "templateEntityId"
    },
    {
      "kind": "RootArgument",
      "name": "useLocked"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "GuideAnalytics_template",
  "selections": [
    (v0/*: any*/),
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
      "name": "formFactor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isCyoa",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "theme",
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
      "name": "inputsCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AnnouncementTimeSeriesPoint",
      "kind": "LinkedField",
      "name": "announcementActivity",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "date",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "dismissed",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "savedForLater",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "viewed",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "AnnouncementCtaActivity",
          "kind": "LinkedField",
          "name": "ctaActivity",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "ctaEntityId",
              "storageKey": null
            },
            (v2/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "count",
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
      "concreteType": "Module",
      "kind": "LinkedField",
      "name": "modules",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "StepPrototype",
          "kind": "LinkedField",
          "name": "stepPrototypes",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isAutoCompletable",
              "storageKey": null
            },
            {
              "alias": null,
              "args": (v4/*: any*/),
              "concreteType": "StepCompletionStatsType",
              "kind": "LinkedField",
              "name": "stepCompletionStats",
              "plural": false,
              "selections": [
                (v5/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "viewedSteps",
                  "storageKey": null
                },
                (v6/*: any*/)
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": (v4/*: any*/),
              "concreteType": "StepBranchingPerformanceType",
              "kind": "LinkedField",
              "name": "branchingPerformance",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Module",
                  "kind": "LinkedField",
                  "name": "createdModule",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "displayTitle",
                      "storageKey": null
                    },
                    (v7/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StepPrototype",
                      "kind": "LinkedField",
                      "name": "stepPrototypes",
                      "plural": true,
                      "selections": [
                        (v0/*: any*/),
                        (v3/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "StepCompletionStatsType",
                          "kind": "LinkedField",
                          "name": "stepCompletionStats",
                          "plural": false,
                          "selections": [
                            (v5/*: any*/),
                            (v6/*: any*/)
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
                  "kind": "ScalarField",
                  "name": "triggeredCount",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "choiceText",
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
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "url",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Template",
                  "kind": "LinkedField",
                  "name": "destinationGuideObj",
                  "plural": false,
                  "selections": [
                    (v7/*: any*/),
                    (v0/*: any*/)
                  ],
                  "storageKey": null
                },
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
                      "name": "eventName",
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
            (v8/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            (v11/*: any*/)
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
            (v12/*: any*/),
            (v10/*: any*/),
            (v8/*: any*/),
            (v9/*: any*/),
            (v13/*: any*/),
            (v14/*: any*/),
            (v15/*: any*/),
            (v16/*: any*/),
            (v17/*: any*/),
            (v11/*: any*/),
            (v18/*: any*/),
            (v19/*: any*/),
            (v20/*: any*/)
          ],
          "type": "ModalStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v8/*: any*/),
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
            (v12/*: any*/),
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
            (v13/*: any*/),
            (v14/*: any*/),
            (v15/*: any*/),
            (v16/*: any*/),
            (v17/*: any*/),
            (v11/*: any*/),
            (v18/*: any*/),
            (v19/*: any*/),
            (v20/*: any*/)
          ],
          "type": "TooltipStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v8/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            (v13/*: any*/),
            (v14/*: any*/),
            (v15/*: any*/),
            (v16/*: any*/),
            (v17/*: any*/),
            (v21/*: any*/),
            (v18/*: any*/),
            (v22/*: any*/),
            (v23/*: any*/),
            (v24/*: any*/),
            (v25/*: any*/),
            (v11/*: any*/),
            (v19/*: any*/),
            (v20/*: any*/)
          ],
          "type": "CardStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v8/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            (v13/*: any*/),
            (v14/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "dotsColor",
              "storageKey": null
            },
            (v21/*: any*/),
            (v18/*: any*/),
            (v22/*: any*/),
            (v23/*: any*/),
            (v24/*: any*/),
            (v25/*: any*/),
            (v11/*: any*/)
          ],
          "type": "CarouselStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v8/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            (v22/*: any*/),
            (v23/*: any*/),
            (v24/*: any*/),
            (v25/*: any*/),
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
            (v13/*: any*/),
            (v14/*: any*/),
            (v21/*: any*/),
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
            (v18/*: any*/),
            (v11/*: any*/)
          ],
          "type": "ChecklistStyle",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "useLocked",
          "variableName": "useLocked"
        }
      ],
      "concreteType": "TemplateStats",
      "kind": "LinkedField",
      "name": "stats",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "usersSeenGuide",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "completedAStep",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "percentCompleted",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "usersDismissed",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "usersClickedCta",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "usersSavedForLater",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "guidesViewed",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "guidesWithCompletedStep",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "percentGuidesCompleted",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "averageStepsCompleted",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "averageStepsCompletedForEngaged",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "inputStepAnswersCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "usersAnswered",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "accountsSeen",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Template",
  "abstractKey": null
};
})();

(node as any).hash = "36ca11152a826a7abf66196a0f680296";

export default node;
