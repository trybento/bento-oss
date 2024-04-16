/**
 * @generated SignedSource<<9fafe7e8c4a0dd9d7507254f40939222>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AnnouncementShadowType = "none" | "standard";
export type BannerPaddingType = "large" | "medium" | "small";
export type BannerPosition = "bottom" | "top";
export type BannerType = "floating" | "inline";
export type BranchingEntityTypeEnum = "guide" | "module" | "template";
export type BranchingFormFactorEnumType = "cards" | "dropdown";
export type BranchingPathEntityType = "guide" | "module" | "template";
export type CYOABackgroundImagePosition = "background" | "bottom" | "left" | "right" | "top";
export type ContextualTagTypeEnumType = "badge" | "badge_dot" | "badge_icon" | "dot" | "highlight" | "icon";
export type CtasOrientation = "inline" | "left" | "right" | "spaceBetween";
export type DropdownInputVariationEnumType = "cards" | "dropdown";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type HorizontalMediaAlignment = "center" | "left" | "right";
export type InlineEmbedAlignment = "center" | "left" | "right";
export type InputStepFieldTypeEnumType = "date" | "dropdown" | "email" | "nps" | "numberPoll" | "paragraph" | "text";
export type MediaOrientation = "left" | "right";
export type MediaTypeEnumType = "image" | "number_attribute" | "video";
export type ModalPosition = "bottom_left" | "bottom_right" | "center" | "top_left" | "top_right";
export type ModalSize = "large" | "medium" | "small";
export type ResponsiveVisibilityBehaviorType = "hide" | "show";
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
export type StyleTabQuery$variables = {
  moduleEntityIds?: ReadonlyArray<any> | null;
  templateEntityId: any;
  templateEntityIds?: ReadonlyArray<any> | null;
};
export type StyleTabQuery$data = {
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
  }> | null;
  readonly previewTemplate: {
    readonly inlineEmbed: {
      readonly alignment: InlineEmbedAlignment | null;
      readonly maxWidth: number | null;
    } | null;
    readonly taggedElements: ReadonlyArray<{
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
    }>;
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
    readonly privateName: string | null;
    readonly theme: ThemeType;
    readonly type: GuideTypeEnumType;
  }> | null;
  readonly uiSettings: {
    readonly bannersStyle: {
      readonly borderRadius: number | null;
      readonly padding: BannerPaddingType | null;
      readonly shadow: AnnouncementShadowType | null;
    } | null;
    readonly borderColor: string | null;
    readonly ctasStyle: {
      readonly borderRadius: number | null;
      readonly fontSize: number | null;
      readonly lineHeight: number | null;
      readonly paddingX: number | null;
      readonly paddingY: number | null;
    } | null;
    readonly cyoaOptionBackgroundColor: string | null;
    readonly cyoaTextColor: string | null;
    readonly embedCustomCss: string | null;
    readonly fontColorHex: string | null;
    readonly inlineContextualStyle: {
      readonly borderColor: string | null;
      readonly borderRadius: number;
      readonly padding: number;
    } | null;
    readonly isCyoaOptionBackgroundColorDark: boolean;
    readonly modalsStyle: {
      readonly backgroundOverlayColor: string | null;
      readonly backgroundOverlayOpacity: number | null;
      readonly borderRadius: number | null;
      readonly paddingX: number | null;
      readonly paddingY: number | null;
      readonly shadow: AnnouncementShadowType | null;
    } | null;
    readonly primaryColorHex: string | null;
    readonly responsiveVisibility: {
      readonly all: ResponsiveVisibilityBehaviorType;
    } | null;
    readonly secondaryColorHex: string | null;
    readonly theme: ThemeType;
    readonly tooltipsStyle: {
      readonly borderRadius: number | null;
      readonly paddingX: number | null;
      readonly paddingY: number | null;
      readonly shadow: AnnouncementShadowType | null;
    } | null;
  } | null;
};
export type StyleTabQuery = {
  response: StyleTabQuery$data;
  variables: StyleTabQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "moduleEntityIds"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "templateEntityId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "templateEntityIds"
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "paddingX",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "paddingY",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "shadow",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundOverlayColor",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundOverlayOpacity",
  "storageKey": null
},
v12 = {
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
      "kind": "ScalarField",
      "name": "secondaryColorHex",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fontColorHex",
      "storageKey": null
    },
    (v3/*: any*/),
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
      "name": "embedCustomCss",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isCyoaOptionBackgroundColorDark",
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
        (v4/*: any*/),
        (v5/*: any*/),
        (v6/*: any*/)
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
        (v7/*: any*/),
        (v8/*: any*/),
        (v9/*: any*/),
        (v4/*: any*/),
        (v10/*: any*/),
        (v11/*: any*/)
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
        (v7/*: any*/),
        (v8/*: any*/),
        (v9/*: any*/),
        (v4/*: any*/)
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
        (v7/*: any*/),
        (v8/*: any*/),
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
        (v4/*: any*/)
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
        (v6/*: any*/),
        (v9/*: any*/),
        (v4/*: any*/)
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cyoaTextColor",
      "storageKey": null
    },
    (v5/*: any*/)
  ],
  "storageKey": null
},
v13 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "templateEntityId"
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v17 = {
  "kind": "InlineFragment",
  "selections": [
    (v15/*: any*/),
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
    (v6/*: any*/),
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
    (v16/*: any*/)
  ],
  "type": "VisualTagHighlightSettings",
  "abstractKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "OrganizationInlineEmbed",
  "kind": "LinkedField",
  "name": "inlineEmbed",
  "plural": false,
  "selections": [
    (v18/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxWidth",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v20 = [
  {
    "kind": "Variable",
    "name": "entityIds",
    "variableName": "templateEntityIds"
  }
],
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v30 = {
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
    (v26/*: any*/),
    (v27/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/)
  ],
  "type": "BannerStyle",
  "abstractKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v40 = {
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
    (v31/*: any*/),
    (v28/*: any*/),
    (v26/*: any*/),
    (v27/*: any*/),
    (v32/*: any*/),
    (v33/*: any*/),
    (v34/*: any*/),
    (v35/*: any*/),
    (v36/*: any*/),
    (v29/*: any*/),
    (v37/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/)
  ],
  "type": "ModalStyle",
  "abstractKey": null
},
v41 = {
  "kind": "InlineFragment",
  "selections": [
    (v26/*: any*/),
    (v10/*: any*/),
    (v11/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasArrow",
      "storageKey": null
    },
    (v31/*: any*/),
    (v27/*: any*/),
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
    (v28/*: any*/),
    (v32/*: any*/),
    (v33/*: any*/),
    (v34/*: any*/),
    (v35/*: any*/),
    (v36/*: any*/),
    (v29/*: any*/),
    (v37/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/)
  ],
  "type": "TooltipStyle",
  "abstractKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
},
v44 = {
  "kind": "InlineFragment",
  "selections": [
    (v26/*: any*/),
    (v27/*: any*/),
    (v28/*: any*/),
    (v32/*: any*/),
    (v33/*: any*/),
    (v34/*: any*/),
    (v35/*: any*/),
    (v36/*: any*/),
    (v42/*: any*/),
    (v37/*: any*/),
    (v5/*: any*/),
    (v4/*: any*/),
    (v6/*: any*/),
    (v43/*: any*/),
    (v29/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/)
  ],
  "type": "CardStyle",
  "abstractKey": null
},
v45 = {
  "kind": "InlineFragment",
  "selections": [
    (v26/*: any*/),
    (v27/*: any*/),
    (v28/*: any*/),
    (v32/*: any*/),
    (v33/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dotsColor",
      "storageKey": null
    },
    (v42/*: any*/),
    (v37/*: any*/),
    (v5/*: any*/),
    (v4/*: any*/),
    (v6/*: any*/),
    (v43/*: any*/),
    (v29/*: any*/)
  ],
  "type": "CarouselStyle",
  "abstractKey": null
},
v46 = {
  "kind": "InlineFragment",
  "selections": [
    (v26/*: any*/),
    (v27/*: any*/),
    (v28/*: any*/),
    (v5/*: any*/),
    (v4/*: any*/),
    (v6/*: any*/),
    (v43/*: any*/),
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
v47 = {
  "kind": "InlineFragment",
  "selections": [
    (v32/*: any*/),
    (v33/*: any*/),
    (v42/*: any*/),
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
    (v37/*: any*/),
    (v29/*: any*/)
  ],
  "type": "ChecklistStyle",
  "abstractKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manualCompletionDisabled",
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingQuestion",
  "storageKey": null
},
v53 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingMultiple",
  "storageKey": null
},
v54 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingDismissDisabled",
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingFormFactor",
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingKey",
  "storageKey": null
},
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingEntityType",
  "storageKey": null
},
v58 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "choiceKey",
  "storageKey": null
},
v59 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityType",
  "storageKey": null
},
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "templateEntityId",
  "storageKey": null
},
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "moduleEntityId",
  "storageKey": null
},
v62 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v63 = {
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
v64 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "style",
  "storageKey": null
},
v65 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v66 = {
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
v67 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "destinationGuide",
  "storageKey": null
},
v68 = {
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
v69 = {
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
v70 = {
  "kind": "InlineFragment",
  "selections": [
    (v18/*: any*/),
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
v71 = {
  "kind": "InlineFragment",
  "selections": [
    (v18/*: any*/),
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
        (v62/*: any*/),
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
v79 = [
  (v14/*: any*/),
  (v21/*: any*/),
  (v48/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "StepPrototype",
    "kind": "LinkedField",
    "name": "stepPrototypes",
    "plural": true,
    "selections": [
      (v14/*: any*/),
      (v21/*: any*/),
      (v49/*: any*/),
      (v50/*: any*/),
      (v51/*: any*/),
      (v52/*: any*/),
      (v53/*: any*/),
      (v54/*: any*/),
      (v55/*: any*/),
      (v56/*: any*/),
      (v57/*: any*/),
      {
        "alias": "branchingPathData",
        "args": null,
        "concreteType": "BranchingPath",
        "kind": "LinkedField",
        "name": "branchingPaths",
        "plural": true,
        "selections": [
          (v58/*: any*/),
          (v56/*: any*/),
          (v59/*: any*/),
          (v60/*: any*/),
          (v61/*: any*/)
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
          (v58/*: any*/),
          (v62/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "style",
            "plural": false,
            "selections": [
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
        "concreteType": "StepPrototypeCta",
        "kind": "LinkedField",
        "name": "ctas",
        "plural": true,
        "selections": [
          (v14/*: any*/),
          (v15/*: any*/),
          (v64/*: any*/),
          (v16/*: any*/),
          (v65/*: any*/),
          (v66/*: any*/),
          (v67/*: any*/)
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
          (v14/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Media",
            "kind": "LinkedField",
            "name": "media",
            "plural": false,
            "selections": [
              (v15/*: any*/),
              (v65/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "meta",
                "plural": false,
                "selections": [
                  (v68/*: any*/),
                  (v69/*: any*/)
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
              (v70/*: any*/),
              (v71/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "InputStepPrototype",
        "kind": "LinkedField",
        "name": "inputs",
        "plural": true,
        "selections": [
          (v14/*: any*/),
          (v62/*: any*/),
          (v15/*: any*/),
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
v80 = [
  {
    "kind": "Variable",
    "name": "entityIds",
    "variableName": "moduleEntityIds"
  }
],
v81 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v82 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v83 = [
  (v14/*: any*/),
  (v21/*: any*/),
  (v48/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "StepPrototype",
    "kind": "LinkedField",
    "name": "stepPrototypes",
    "plural": true,
    "selections": [
      (v14/*: any*/),
      (v21/*: any*/),
      (v49/*: any*/),
      (v50/*: any*/),
      (v51/*: any*/),
      (v52/*: any*/),
      (v53/*: any*/),
      (v54/*: any*/),
      (v55/*: any*/),
      (v56/*: any*/),
      (v57/*: any*/),
      {
        "alias": "branchingPathData",
        "args": null,
        "concreteType": "BranchingPath",
        "kind": "LinkedField",
        "name": "branchingPaths",
        "plural": true,
        "selections": [
          (v58/*: any*/),
          (v56/*: any*/),
          (v59/*: any*/),
          (v60/*: any*/),
          (v61/*: any*/),
          (v82/*: any*/)
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
          (v58/*: any*/),
          (v62/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "style",
            "plural": false,
            "selections": [
              (v81/*: any*/),
              {
                "kind": "TypeDiscriminator",
                "abstractKey": "__isBranchingStyle"
              },
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
        "concreteType": "StepPrototypeCta",
        "kind": "LinkedField",
        "name": "ctas",
        "plural": true,
        "selections": [
          (v14/*: any*/),
          (v15/*: any*/),
          (v64/*: any*/),
          (v16/*: any*/),
          (v65/*: any*/),
          (v66/*: any*/),
          (v67/*: any*/),
          (v82/*: any*/)
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
          (v14/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Media",
            "kind": "LinkedField",
            "name": "media",
            "plural": false,
            "selections": [
              (v15/*: any*/),
              (v65/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "meta",
                "plural": false,
                "selections": [
                  (v81/*: any*/),
                  (v68/*: any*/),
                  (v69/*: any*/)
                ],
                "storageKey": null
              },
              (v82/*: any*/)
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
              (v81/*: any*/),
              (v70/*: any*/),
              (v71/*: any*/)
            ],
            "storageKey": null
          },
          (v82/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "InputStepPrototype",
        "kind": "LinkedField",
        "name": "inputs",
        "plural": true,
        "selections": [
          (v14/*: any*/),
          (v62/*: any*/),
          (v15/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "settings",
            "plural": false,
            "selections": [
              (v81/*: any*/),
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
          (v82/*: any*/)
        ],
        "storageKey": null
      },
      (v82/*: any*/)
    ],
    "storageKey": null
  },
  (v82/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "StyleTabQuery",
    "selections": [
      (v12/*: any*/),
      {
        "alias": "previewTemplate",
        "args": (v13/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototypeTaggedElement",
            "kind": "LinkedField",
            "name": "taggedElements",
            "plural": true,
            "selections": [
              (v14/*: any*/),
              (v15/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "style",
                "plural": false,
                "selections": [
                  (v17/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v19/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "templates",
        "args": (v20/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplates",
        "plural": true,
        "selections": [
          (v14/*: any*/),
          (v21/*: any*/),
          (v22/*: any*/),
          (v15/*: any*/),
          (v23/*: any*/),
          (v24/*: any*/),
          (v25/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v30/*: any*/),
              (v40/*: any*/),
              (v41/*: any*/),
              (v44/*: any*/),
              (v45/*: any*/),
              (v46/*: any*/),
              (v47/*: any*/)
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
            "selections": (v79/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": "modules",
        "args": (v80/*: any*/),
        "concreteType": "Module",
        "kind": "LinkedField",
        "name": "findModules",
        "plural": true,
        "selections": (v79/*: any*/),
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "StyleTabQuery",
    "selections": [
      (v12/*: any*/),
      {
        "alias": "previewTemplate",
        "args": (v13/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototypeTaggedElement",
            "kind": "LinkedField",
            "name": "taggedElements",
            "plural": true,
            "selections": [
              (v14/*: any*/),
              (v15/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "style",
                "plural": false,
                "selections": [
                  (v81/*: any*/),
                  {
                    "kind": "TypeDiscriminator",
                    "abstractKey": "__isVisualTagStyleSettings"
                  },
                  (v17/*: any*/)
                ],
                "storageKey": null
              },
              (v82/*: any*/)
            ],
            "storageKey": null
          },
          (v19/*: any*/),
          (v82/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "templates",
        "args": (v20/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplates",
        "plural": true,
        "selections": [
          (v14/*: any*/),
          (v21/*: any*/),
          (v22/*: any*/),
          (v15/*: any*/),
          (v23/*: any*/),
          (v24/*: any*/),
          (v25/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v81/*: any*/),
              {
                "kind": "TypeDiscriminator",
                "abstractKey": "__isFormFactorStyle"
              },
              (v30/*: any*/),
              (v40/*: any*/),
              (v41/*: any*/),
              (v44/*: any*/),
              (v45/*: any*/),
              (v46/*: any*/),
              (v47/*: any*/)
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
            "selections": (v83/*: any*/),
            "storageKey": null
          },
          (v82/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "modules",
        "args": (v80/*: any*/),
        "concreteType": "Module",
        "kind": "LinkedField",
        "name": "findModules",
        "plural": true,
        "selections": (v83/*: any*/),
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a8281e0f4738309295a5a893806eda24",
    "id": null,
    "metadata": {},
    "name": "StyleTabQuery",
    "operationKind": "query",
    "text": "query StyleTabQuery(\n  $templateEntityId: EntityId!\n  $templateEntityIds: [EntityId!]\n  $moduleEntityIds: [EntityId!]\n) {\n  uiSettings {\n    primaryColorHex\n    secondaryColorHex\n    fontColorHex\n    theme\n    cyoaOptionBackgroundColor\n    embedCustomCss\n    isCyoaOptionBackgroundColorDark\n    inlineContextualStyle {\n      borderRadius\n      borderColor\n      padding\n    }\n    modalsStyle {\n      paddingX\n      paddingY\n      shadow\n      borderRadius\n      backgroundOverlayColor\n      backgroundOverlayOpacity\n    }\n    tooltipsStyle {\n      paddingX\n      paddingY\n      shadow\n      borderRadius\n    }\n    ctasStyle {\n      paddingX\n      paddingY\n      fontSize\n      lineHeight\n      borderRadius\n    }\n    bannersStyle {\n      padding\n      shadow\n      borderRadius\n    }\n    responsiveVisibility {\n      all\n    }\n    cyoaTextColor\n    borderColor\n  }\n  previewTemplate: findTemplate(entityId: $templateEntityId) {\n    taggedElements {\n      entityId\n      type\n      style {\n        __typename\n        __isVisualTagStyleSettings: __typename\n        ... on VisualTagHighlightSettings {\n          type\n          pulse\n          color\n          thickness\n          padding\n          radius\n          opacity\n          text\n        }\n      }\n      id\n    }\n    inlineEmbed {\n      alignment\n      maxWidth\n    }\n    id\n  }\n  templates: findTemplates(entityIds: $templateEntityIds) {\n    entityId\n    name\n    privateName\n    type\n    formFactor\n    designType\n    isSideQuest\n    theme\n    formFactorStyle {\n      __typename\n      __isFormFactorStyle: __typename\n      ... on BannerStyle {\n        bannerType\n        bannerPosition\n        backgroundColor\n        textColor\n        canDismiss\n        ctasOrientation\n      }\n      ... on ModalStyle {\n        modalSize\n        position\n        hasBackgroundOverlay\n        canDismiss\n        backgroundColor\n        textColor\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on TooltipStyle {\n        backgroundColor\n        backgroundOverlayColor\n        backgroundOverlayOpacity\n        hasArrow\n        hasBackgroundOverlay\n        textColor\n        tooltipShowOn\n        tooltipSize\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CardStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CarouselStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        dotsColor\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n      }\n      ... on VideoGalleryStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        selectedBackgroundColor\n        statusLabelColor\n      }\n      ... on ChecklistStyle {\n        stepBodyOrientation\n        mediaOrientation\n        height\n        hideStepGroupTitle\n        hideCompletedSteps\n        imageWidth\n        ctasOrientation\n      }\n    }\n    modules {\n      entityId\n      name\n      displayTitle\n      stepPrototypes {\n        entityId\n        name\n        bodySlate\n        stepType\n        manualCompletionDisabled\n        branchingQuestion\n        branchingMultiple\n        branchingDismissDisabled\n        branchingFormFactor\n        branchingKey\n        branchingEntityType\n        branchingPathData: branchingPaths {\n          choiceKey\n          branchingKey\n          entityType\n          templateEntityId\n          moduleEntityId\n          id\n        }\n        branchingChoices {\n          choiceKey\n          label\n          style {\n            __typename\n            __isBranchingStyle: __typename\n            ... on BranchingCardStyle {\n              backgroundImageUrl\n              backgroundImagePosition\n            }\n          }\n        }\n        ctas {\n          entityId\n          type\n          style\n          text\n          url\n          settings {\n            bgColorField\n            textColorField\n            eventName\n            markComplete\n            implicit\n            opensInNewTab\n          }\n          destinationGuide\n          id\n        }\n        mediaReferences {\n          entityId\n          media {\n            type\n            url\n            meta {\n              __typename\n              ... on ImageMediaMeta {\n                naturalWidth\n                naturalHeight\n              }\n              ... on VideoMediaMeta {\n                videoId\n                videoType\n              }\n            }\n            id\n          }\n          settings {\n            __typename\n            ... on ImageMediaReferenceSettings {\n              alignment\n              fill\n              hyperlink\n              lightboxDisabled\n            }\n            ... on VideoMediaReferenceSettings {\n              alignment\n              playsInline\n            }\n          }\n          id\n        }\n        inputs {\n          entityId\n          label\n          type\n          settings {\n            __typename\n            __isInputSettings: __typename\n            ... on TextOrEmailSettings {\n              placeholder\n              required\n              helperText\n              maxValue\n            }\n            ... on NpsSettings {\n              required\n              helperText\n            }\n            ... on NumberPollSettings {\n              required\n              helperText\n              minLabel\n              minValue\n              maxLabel\n              maxValue\n            }\n            ... on DropdownSettings {\n              required\n              multiSelect\n              variation\n              options {\n                label\n                value\n              }\n            }\n          }\n          id\n        }\n        id\n      }\n      id\n    }\n    id\n  }\n  modules: findModules(entityIds: $moduleEntityIds) {\n    entityId\n    name\n    displayTitle\n    stepPrototypes {\n      entityId\n      name\n      bodySlate\n      stepType\n      manualCompletionDisabled\n      branchingQuestion\n      branchingMultiple\n      branchingDismissDisabled\n      branchingFormFactor\n      branchingKey\n      branchingEntityType\n      branchingPathData: branchingPaths {\n        choiceKey\n        branchingKey\n        entityType\n        templateEntityId\n        moduleEntityId\n        id\n      }\n      branchingChoices {\n        choiceKey\n        label\n        style {\n          __typename\n          __isBranchingStyle: __typename\n          ... on BranchingCardStyle {\n            backgroundImageUrl\n            backgroundImagePosition\n          }\n        }\n      }\n      ctas {\n        entityId\n        type\n        style\n        text\n        url\n        settings {\n          bgColorField\n          textColorField\n          eventName\n          markComplete\n          implicit\n          opensInNewTab\n        }\n        destinationGuide\n        id\n      }\n      mediaReferences {\n        entityId\n        media {\n          type\n          url\n          meta {\n            __typename\n            ... on ImageMediaMeta {\n              naturalWidth\n              naturalHeight\n            }\n            ... on VideoMediaMeta {\n              videoId\n              videoType\n            }\n          }\n          id\n        }\n        settings {\n          __typename\n          ... on ImageMediaReferenceSettings {\n            alignment\n            fill\n            hyperlink\n            lightboxDisabled\n          }\n          ... on VideoMediaReferenceSettings {\n            alignment\n            playsInline\n          }\n        }\n        id\n      }\n      inputs {\n        entityId\n        label\n        type\n        settings {\n          __typename\n          __isInputSettings: __typename\n          ... on TextOrEmailSettings {\n            placeholder\n            required\n            helperText\n            maxValue\n          }\n          ... on NpsSettings {\n            required\n            helperText\n          }\n          ... on NumberPollSettings {\n            required\n            helperText\n            minLabel\n            minValue\n            maxLabel\n            maxValue\n          }\n          ... on DropdownSettings {\n            required\n            multiSelect\n            variation\n            options {\n              label\n              value\n            }\n          }\n        }\n        id\n      }\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "367ae8da33109c50eefc9e39d6e49ef6";

export default node;
