/**
 * @generated SignedSource<<a8627044e67eaf28aee3bfe29799468c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
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
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type TemplateState = "draft" | "live" | "removed" | "stopped";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
export type GuideAnalyticsQuery$variables = {
  templateEntityId: any;
  useLocked?: boolean | null;
};
export type GuideAnalyticsQuery$data = {
  readonly template: {
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
    readonly branchedGuidesCount: number;
    readonly branchingPerformance: ReadonlyArray<{
      readonly count: number;
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
      readonly createdTemplate: {
        readonly entityId: any;
        readonly name: string | null;
      } | null;
    }>;
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
    readonly splitSources: ReadonlyArray<{
      readonly entityId: any;
      readonly lastUsedAt: any | null;
      readonly name: string | null;
      readonly splitTargets: ReadonlyArray<{
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
        readonly description: string | null;
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
        readonly privateName: string | null;
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
        readonly stepsCount: number;
        readonly theme: ThemeType;
        readonly type: GuideTypeEnumType;
      } | null>;
      readonly splitTestState: SplitTestStateEnumType;
      readonly state: TemplateState;
      readonly updatedAt: any | null;
    } | null>;
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
  } | null;
};
export type GuideAnalyticsQuery = {
  response: GuideAnalyticsQuery$data;
  variables: GuideAnalyticsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "templateEntityId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "useLocked"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "templateEntityId"
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
  "name": "type",
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
  "name": "designType",
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
  "name": "theme",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "inputsCount",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "count",
  "storageKey": null
},
v13 = {
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
        (v11/*: any*/),
        (v12/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoCompletable",
  "storageKey": null
},
v16 = [
  {
    "kind": "Variable",
    "name": "templateEntityId",
    "variableName": "templateEntityId"
  }
],
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepsCompleted",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalSteps",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": (v16/*: any*/),
  "concreteType": "StepCompletionStatsType",
  "kind": "LinkedField",
  "name": "stepCompletionStats",
  "plural": false,
  "selections": [
    (v17/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "viewedSteps",
      "storageKey": null
    },
    (v18/*: any*/)
  ],
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "StepCompletionStatsType",
  "kind": "LinkedField",
  "name": "stepCompletionStats",
  "plural": false,
  "selections": [
    (v17/*: any*/),
    (v18/*: any*/)
  ],
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "Module",
  "kind": "LinkedField",
  "name": "createdModule",
  "plural": false,
  "selections": [
    (v20/*: any*/),
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "StepPrototype",
      "kind": "LinkedField",
      "name": "stepPrototypes",
      "plural": true,
      "selections": [
        (v4/*: any*/),
        (v14/*: any*/),
        (v21/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "triggeredCount",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "choiceText",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v26 = [
  (v2/*: any*/),
  (v4/*: any*/)
],
v27 = {
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
},
v28 = {
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
        (v4/*: any*/),
        (v14/*: any*/),
        (v15/*: any*/),
        (v19/*: any*/),
        {
          "alias": null,
          "args": (v16/*: any*/),
          "concreteType": "StepBranchingPerformanceType",
          "kind": "LinkedField",
          "name": "branchingPerformance",
          "plural": true,
          "selections": [
            (v22/*: any*/),
            (v23/*: any*/),
            (v24/*: any*/)
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
            (v11/*: any*/),
            (v3/*: any*/),
            (v25/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Template",
              "kind": "LinkedField",
              "name": "destinationGuideObj",
              "plural": false,
              "selections": (v26/*: any*/),
              "storageKey": null
            },
            (v27/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v33 = {
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
    (v29/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v32/*: any*/)
  ],
  "type": "BannerStyle",
  "abstractKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v43 = {
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
    (v34/*: any*/),
    (v31/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v35/*: any*/),
    (v36/*: any*/),
    (v37/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/),
    (v32/*: any*/),
    (v40/*: any*/),
    (v41/*: any*/),
    (v42/*: any*/)
  ],
  "type": "ModalStyle",
  "abstractKey": null
},
v44 = {
  "kind": "InlineFragment",
  "selections": [
    (v29/*: any*/),
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
    (v34/*: any*/),
    (v30/*: any*/),
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
    (v31/*: any*/),
    (v35/*: any*/),
    (v36/*: any*/),
    (v37/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/),
    (v32/*: any*/),
    (v40/*: any*/),
    (v41/*: any*/),
    (v42/*: any*/)
  ],
  "type": "TooltipStyle",
  "abstractKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
},
v50 = {
  "kind": "InlineFragment",
  "selections": [
    (v29/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v35/*: any*/),
    (v36/*: any*/),
    (v37/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/),
    (v45/*: any*/),
    (v40/*: any*/),
    (v46/*: any*/),
    (v47/*: any*/),
    (v48/*: any*/),
    (v49/*: any*/),
    (v32/*: any*/),
    (v41/*: any*/),
    (v42/*: any*/)
  ],
  "type": "CardStyle",
  "abstractKey": null
},
v51 = {
  "kind": "InlineFragment",
  "selections": [
    (v29/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v35/*: any*/),
    (v36/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dotsColor",
      "storageKey": null
    },
    (v45/*: any*/),
    (v40/*: any*/),
    (v46/*: any*/),
    (v47/*: any*/),
    (v48/*: any*/),
    (v49/*: any*/),
    (v32/*: any*/)
  ],
  "type": "CarouselStyle",
  "abstractKey": null
},
v52 = {
  "kind": "InlineFragment",
  "selections": [
    (v29/*: any*/),
    (v30/*: any*/),
    (v31/*: any*/),
    (v46/*: any*/),
    (v47/*: any*/),
    (v48/*: any*/),
    (v49/*: any*/),
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
v53 = {
  "kind": "InlineFragment",
  "selections": [
    (v35/*: any*/),
    (v36/*: any*/),
    (v45/*: any*/),
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
    (v40/*: any*/),
    (v32/*: any*/)
  ],
  "type": "ChecklistStyle",
  "abstractKey": null
},
v54 = {
  "alias": null,
  "args": null,
  "concreteType": null,
  "kind": "LinkedField",
  "name": "formFactorStyle",
  "plural": false,
  "selections": [
    (v33/*: any*/),
    (v43/*: any*/),
    (v44/*: any*/),
    (v50/*: any*/),
    (v51/*: any*/),
    (v52/*: any*/),
    (v53/*: any*/)
  ],
  "storageKey": null
},
v55 = [
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
v56 = {
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
  "selections": (v55/*: any*/),
  "storageKey": null
},
v57 = [
  {
    "kind": "Literal",
    "name": "detachedOnly",
    "value": true
  }
],
v58 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchedGuidesCount",
  "storageKey": null
},
v59 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastUsedAt",
  "storageKey": null
},
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v62 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "splitTestState",
  "storageKey": null
},
v63 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v64 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v65 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepsCount",
  "storageKey": null
},
v66 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "useLocked",
      "value": true
    }
  ],
  "concreteType": "TemplateStats",
  "kind": "LinkedField",
  "name": "stats",
  "plural": false,
  "selections": (v55/*: any*/),
  "storageKey": "stats(useLocked:true)"
},
v67 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v68 = {
  "alias": null,
  "args": null,
  "concreteType": "Module",
  "kind": "LinkedField",
  "name": "createdModule",
  "plural": false,
  "selections": [
    (v20/*: any*/),
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "StepPrototype",
      "kind": "LinkedField",
      "name": "stepPrototypes",
      "plural": true,
      "selections": [
        (v4/*: any*/),
        (v14/*: any*/),
        (v21/*: any*/),
        (v67/*: any*/)
      ],
      "storageKey": null
    },
    (v67/*: any*/)
  ],
  "storageKey": null
},
v69 = [
  (v2/*: any*/),
  (v4/*: any*/),
  (v67/*: any*/)
],
v70 = {
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
        (v4/*: any*/),
        (v14/*: any*/),
        (v15/*: any*/),
        (v19/*: any*/),
        {
          "alias": null,
          "args": (v16/*: any*/),
          "concreteType": "StepBranchingPerformanceType",
          "kind": "LinkedField",
          "name": "branchingPerformance",
          "plural": true,
          "selections": [
            (v68/*: any*/),
            (v23/*: any*/),
            (v24/*: any*/)
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
            (v11/*: any*/),
            (v3/*: any*/),
            (v25/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Template",
              "kind": "LinkedField",
              "name": "destinationGuideObj",
              "plural": false,
              "selections": (v69/*: any*/),
              "storageKey": null
            },
            (v27/*: any*/),
            (v67/*: any*/)
          ],
          "storageKey": null
        },
        (v67/*: any*/)
      ],
      "storageKey": null
    },
    (v67/*: any*/)
  ],
  "storageKey": null
},
v71 = {
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
    (v33/*: any*/),
    (v43/*: any*/),
    (v44/*: any*/),
    (v50/*: any*/),
    (v51/*: any*/),
    (v52/*: any*/),
    (v53/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GuideAnalyticsQuery",
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
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v13/*: any*/),
          (v28/*: any*/),
          (v54/*: any*/),
          (v56/*: any*/),
          {
            "alias": null,
            "args": (v57/*: any*/),
            "concreteType": "BranchingPerformance",
            "kind": "LinkedField",
            "name": "branchingPerformance",
            "plural": true,
            "selections": [
              (v22/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "createdTemplate",
                "plural": false,
                "selections": (v26/*: any*/),
                "storageKey": null
              },
              (v12/*: any*/)
            ],
            "storageKey": "branchingPerformance(detachedOnly:true)"
          },
          (v58/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitSources",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v59/*: any*/),
              (v60/*: any*/),
              (v61/*: any*/),
              (v62/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "splitTargets",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v5/*: any*/),
                  (v4/*: any*/),
                  (v63/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v6/*: any*/),
                  (v64/*: any*/),
                  (v65/*: any*/),
                  (v3/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v13/*: any*/),
                  (v28/*: any*/),
                  (v54/*: any*/),
                  (v66/*: any*/)
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
    "name": "GuideAnalyticsQuery",
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
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v13/*: any*/),
          (v70/*: any*/),
          (v71/*: any*/),
          (v56/*: any*/),
          {
            "alias": null,
            "args": (v57/*: any*/),
            "concreteType": "BranchingPerformance",
            "kind": "LinkedField",
            "name": "branchingPerformance",
            "plural": true,
            "selections": [
              (v68/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "createdTemplate",
                "plural": false,
                "selections": (v69/*: any*/),
                "storageKey": null
              },
              (v12/*: any*/)
            ],
            "storageKey": "branchingPerformance(detachedOnly:true)"
          },
          (v58/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitSources",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v59/*: any*/),
              (v60/*: any*/),
              (v61/*: any*/),
              (v62/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "splitTargets",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v5/*: any*/),
                  (v4/*: any*/),
                  (v63/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v6/*: any*/),
                  (v64/*: any*/),
                  (v65/*: any*/),
                  (v3/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v13/*: any*/),
                  (v70/*: any*/),
                  (v71/*: any*/),
                  (v66/*: any*/),
                  (v67/*: any*/)
                ],
                "storageKey": null
              },
              (v67/*: any*/)
            ],
            "storageKey": null
          },
          (v67/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6102b6aee5819e7c870518dd9ea76dbb",
    "id": null,
    "metadata": {},
    "name": "GuideAnalyticsQuery",
    "operationKind": "query",
    "text": "query GuideAnalyticsQuery(\n  $templateEntityId: EntityId!\n  $useLocked: Boolean\n) {\n  template: findTemplate(entityId: $templateEntityId) {\n    entityId\n    type\n    name\n    designType\n    formFactor\n    isCyoa\n    theme\n    isSideQuest\n    inputsCount\n    announcementActivity {\n      date\n      dismissed\n      savedForLater\n      viewed\n      ctaActivity {\n        ctaEntityId\n        text\n        count\n      }\n    }\n    modules {\n      stepPrototypes {\n        name\n        stepType\n        isAutoCompletable\n        stepCompletionStats(templateEntityId: $templateEntityId) {\n          stepsCompleted\n          viewedSteps\n          totalSteps\n        }\n        branchingPerformance(templateEntityId: $templateEntityId) {\n          createdModule {\n            displayTitle\n            entityId\n            stepPrototypes {\n              name\n              stepType\n              stepCompletionStats {\n                stepsCompleted\n                totalSteps\n              }\n              id\n            }\n            id\n          }\n          triggeredCount\n          choiceText\n        }\n        ctas {\n          text\n          type\n          url\n          destinationGuideObj {\n            entityId\n            name\n            id\n          }\n          settings {\n            eventName\n          }\n          id\n        }\n        id\n      }\n      id\n    }\n    formFactorStyle {\n      __typename\n      __isFormFactorStyle: __typename\n      ... on BannerStyle {\n        bannerType\n        bannerPosition\n        backgroundColor\n        textColor\n        canDismiss\n        ctasOrientation\n      }\n      ... on ModalStyle {\n        modalSize\n        position\n        hasBackgroundOverlay\n        canDismiss\n        backgroundColor\n        textColor\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on TooltipStyle {\n        backgroundColor\n        backgroundOverlayColor\n        backgroundOverlayOpacity\n        hasArrow\n        hasBackgroundOverlay\n        textColor\n        tooltipShowOn\n        tooltipSize\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CardStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CarouselStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        dotsColor\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n      }\n      ... on VideoGalleryStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        selectedBackgroundColor\n        statusLabelColor\n      }\n      ... on ChecklistStyle {\n        stepBodyOrientation\n        mediaOrientation\n        height\n        hideStepGroupTitle\n        hideCompletedSteps\n        imageWidth\n        ctasOrientation\n      }\n    }\n    stats(useLocked: $useLocked) {\n      usersSeenGuide\n      completedAStep\n      percentCompleted\n      usersDismissed\n      usersClickedCta\n      usersSavedForLater\n      guidesViewed\n      guidesWithCompletedStep\n      percentGuidesCompleted\n      averageStepsCompleted\n      averageStepsCompletedForEngaged\n      inputStepAnswersCount\n      usersAnswered\n      accountsSeen\n    }\n    branchingPerformance(detachedOnly: true) {\n      createdModule {\n        displayTitle\n        entityId\n        stepPrototypes {\n          name\n          stepType\n          stepCompletionStats {\n            stepsCompleted\n            totalSteps\n          }\n          id\n        }\n        id\n      }\n      createdTemplate {\n        entityId\n        name\n        id\n      }\n      count\n    }\n    branchedGuidesCount\n    splitSources {\n      entityId\n      lastUsedAt\n      updatedAt\n      state\n      splitTestState\n      name\n      splitTargets {\n        entityId\n        designType\n        name\n        privateName\n        isCyoa\n        theme\n        formFactor\n        description\n        stepsCount\n        type\n        isSideQuest\n        inputsCount\n        announcementActivity {\n          date\n          dismissed\n          savedForLater\n          viewed\n          ctaActivity {\n            ctaEntityId\n            text\n            count\n          }\n        }\n        modules {\n          stepPrototypes {\n            name\n            stepType\n            isAutoCompletable\n            stepCompletionStats(templateEntityId: $templateEntityId) {\n              stepsCompleted\n              viewedSteps\n              totalSteps\n            }\n            branchingPerformance(templateEntityId: $templateEntityId) {\n              createdModule {\n                displayTitle\n                entityId\n                stepPrototypes {\n                  name\n                  stepType\n                  stepCompletionStats {\n                    stepsCompleted\n                    totalSteps\n                  }\n                  id\n                }\n                id\n              }\n              triggeredCount\n              choiceText\n            }\n            ctas {\n              text\n              type\n              url\n              destinationGuideObj {\n                entityId\n                name\n                id\n              }\n              settings {\n                eventName\n              }\n              id\n            }\n            id\n          }\n          id\n        }\n        formFactorStyle {\n          __typename\n          __isFormFactorStyle: __typename\n          ... on BannerStyle {\n            bannerType\n            bannerPosition\n            backgroundColor\n            textColor\n            canDismiss\n            ctasOrientation\n          }\n          ... on ModalStyle {\n            modalSize\n            position\n            hasBackgroundOverlay\n            canDismiss\n            backgroundColor\n            textColor\n            stepBodyOrientation\n            mediaOrientation\n            verticalMediaOrientation\n            verticalMediaAlignment\n            horizontalMediaAlignment\n            ctasOrientation\n            imageWidth\n            mediaFontSize\n            mediaTextColor\n          }\n          ... on TooltipStyle {\n            backgroundColor\n            backgroundOverlayColor\n            backgroundOverlayOpacity\n            hasArrow\n            hasBackgroundOverlay\n            textColor\n            tooltipShowOn\n            tooltipSize\n            canDismiss\n            stepBodyOrientation\n            mediaOrientation\n            verticalMediaOrientation\n            verticalMediaAlignment\n            horizontalMediaAlignment\n            ctasOrientation\n            imageWidth\n            mediaFontSize\n            mediaTextColor\n          }\n          ... on CardStyle {\n            backgroundColor\n            textColor\n            canDismiss\n            stepBodyOrientation\n            mediaOrientation\n            verticalMediaOrientation\n            verticalMediaAlignment\n            horizontalMediaAlignment\n            height\n            imageWidth\n            borderColor\n            borderRadius\n            padding\n            advancedPadding\n            ctasOrientation\n            mediaFontSize\n            mediaTextColor\n          }\n          ... on CarouselStyle {\n            backgroundColor\n            textColor\n            canDismiss\n            stepBodyOrientation\n            mediaOrientation\n            dotsColor\n            height\n            imageWidth\n            borderColor\n            borderRadius\n            padding\n            advancedPadding\n            ctasOrientation\n          }\n          ... on VideoGalleryStyle {\n            backgroundColor\n            textColor\n            canDismiss\n            borderColor\n            borderRadius\n            padding\n            advancedPadding\n            selectedBackgroundColor\n            statusLabelColor\n          }\n          ... on ChecklistStyle {\n            stepBodyOrientation\n            mediaOrientation\n            height\n            hideStepGroupTitle\n            hideCompletedSteps\n            imageWidth\n            ctasOrientation\n          }\n        }\n        stats(useLocked: true) {\n          usersSeenGuide\n          completedAStep\n          percentCompleted\n          usersDismissed\n          usersClickedCta\n          usersSavedForLater\n          guidesViewed\n          guidesWithCompletedStep\n          percentGuidesCompleted\n          averageStepsCompleted\n          averageStepsCompletedForEngaged\n          inputStepAnswersCount\n          usersAnswered\n          accountsSeen\n        }\n        id\n      }\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "a0b5f82d3ad55e43773c8e6ca8923c7f";

export default node;
