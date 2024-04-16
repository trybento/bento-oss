/**
 * @generated SignedSource<<feff810c377c256ee9bf2f3f06611114>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
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
export type MediaTypeEnumType = "image" | "number_attribute" | "video";
export type ModalPosition = "bottom_left" | "bottom_right" | "center" | "top_left" | "top_right";
export type ModalSize = "large" | "medium" | "small";
export type StepBodyOrientation = "horizontal" | "vertical";
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
import { FragmentRefs } from "relay-runtime";
export type Template_template$data = {
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
  readonly " $fragmentType": "Template_template";
};
export type Template_template$key = {
  readonly " $data"?: Template_template$data;
  readonly " $fragmentSpreads": FragmentRefs<"Template_template">;
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
  "name": "backgroundColor",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingKey",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "choiceKey",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Template_template",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "privateName",
      "storageKey": null
    },
    (v2/*: any*/),
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
            (v3/*: any*/),
            (v4/*: any*/),
            (v5/*: any*/),
            (v6/*: any*/)
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
            (v7/*: any*/),
            (v5/*: any*/),
            (v3/*: any*/),
            (v4/*: any*/),
            (v8/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            (v11/*: any*/),
            (v12/*: any*/),
            (v6/*: any*/),
            (v13/*: any*/),
            (v14/*: any*/),
            (v15/*: any*/)
          ],
          "type": "ModalStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
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
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasArrow",
              "storageKey": null
            },
            (v7/*: any*/),
            (v4/*: any*/),
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
            (v5/*: any*/),
            (v8/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            (v11/*: any*/),
            (v12/*: any*/),
            (v6/*: any*/),
            (v13/*: any*/),
            (v14/*: any*/),
            (v15/*: any*/)
          ],
          "type": "TooltipStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v3/*: any*/),
            (v4/*: any*/),
            (v5/*: any*/),
            (v8/*: any*/),
            (v9/*: any*/),
            (v10/*: any*/),
            (v11/*: any*/),
            (v12/*: any*/),
            (v16/*: any*/),
            (v13/*: any*/),
            (v17/*: any*/),
            (v18/*: any*/),
            (v19/*: any*/),
            (v20/*: any*/),
            (v6/*: any*/),
            (v14/*: any*/),
            (v15/*: any*/)
          ],
          "type": "CardStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v3/*: any*/),
            (v4/*: any*/),
            (v5/*: any*/),
            (v8/*: any*/),
            (v9/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "dotsColor",
              "storageKey": null
            },
            (v16/*: any*/),
            (v13/*: any*/),
            (v17/*: any*/),
            (v18/*: any*/),
            (v19/*: any*/),
            (v20/*: any*/),
            (v6/*: any*/)
          ],
          "type": "CarouselStyle",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v3/*: any*/),
            (v4/*: any*/),
            (v5/*: any*/),
            (v17/*: any*/),
            (v18/*: any*/),
            (v19/*: any*/),
            (v20/*: any*/),
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
            (v8/*: any*/),
            (v9/*: any*/),
            (v16/*: any*/),
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
            (v13/*: any*/),
            (v6/*: any*/)
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
      "name": "isSideQuest",
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
      "name": "pageTargetingType",
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
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "displayTitle",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "StepPrototype",
          "kind": "LinkedField",
          "name": "stepPrototypes",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
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
              "name": "stepType",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "manualCompletionDisabled",
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
              "kind": "ScalarField",
              "name": "branchingFormFactor",
              "storageKey": null
            },
            (v21/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "branchingEntityType",
              "storageKey": null
            },
            {
              "alias": "branchingPathData",
              "args": null,
              "concreteType": "BranchingPath",
              "kind": "LinkedField",
              "name": "branchingPaths",
              "plural": true,
              "selections": [
                (v22/*: any*/),
                (v21/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "entityType",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "templateEntityId",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "moduleEntityId",
                  "storageKey": null
                }
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
                (v22/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "label",
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
              "concreteType": "StepPrototypeCta",
              "kind": "LinkedField",
              "name": "ctas",
              "plural": true,
              "selections": [
                (v0/*: any*/),
                (v2/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "style",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "text",
                  "storageKey": null
                },
                (v23/*: any*/),
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
                    (v2/*: any*/),
                    (v23/*: any*/),
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
                        (v24/*: any*/),
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
                        (v24/*: any*/),
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
            }
          ],
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

(node as any).hash = "90716d8ef8a1fc428af3b27810d4b439";

export default node;
