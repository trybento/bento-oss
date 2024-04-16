/**
 * @generated SignedSource<<0f7a8fe22089c2380c023326b5ee92b4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AutoCompleteInteractionType = "guide_completion";
export type BannerPosition = "bottom" | "top";
export type BannerType = "floating" | "inline";
export type BranchingEntityTypeEnum = "guide" | "module" | "template";
export type BranchingFormFactorEnumType = "cards" | "dropdown";
export type BranchingPathEntityType = "guide" | "module" | "template";
export type CYOABackgroundImagePosition = "background" | "bottom" | "left" | "right" | "top";
export type ContextualTagAlignmentEnumType = "bottom_left" | "bottom_right" | "center_left" | "center_right" | "top_left" | "top_right";
export type ContextualTagTooltipAlignmentEnumType = "bottom" | "left" | "right" | "top";
export type ContextualTagTypeEnumType = "badge" | "badge_dot" | "badge_icon" | "dot" | "highlight" | "icon";
export type CtasOrientation = "inline" | "left" | "right" | "spaceBetween";
export type DropdownInputVariationEnumType = "cards" | "dropdown";
export type GuideExpirationCriteria = "launch" | "never" | "step_completion";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type HorizontalMediaAlignment = "center" | "left" | "right";
export type InlineEmbedAlignment = "center" | "left" | "right";
export type InlineEmbedPosition = "after" | "before" | "inside";
export type InlineEmbedState = "active" | "inactive";
export type InputStepFieldTypeEnumType = "date" | "dropdown" | "email" | "nps" | "numberPoll" | "paragraph" | "text";
export type MediaOrientation = "left" | "right";
export type MediaTypeEnumType = "image" | "number_attribute" | "video";
export type ModalPosition = "bottom_left" | "bottom_right" | "center" | "top_left" | "top_right";
export type ModalSize = "large" | "medium" | "small";
export type StepAutoCompleteInteractionTypeEnumType = "click";
export type StepBodyOrientation = "horizontal" | "vertical";
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepEventMappingRuleRuleType = "eq" | "gt" | "gte" | "lt" | "lte";
export type StepEventMappingRuleValueType = "boolean" | "date" | "number" | "text";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
export type VisualTagHighlightType = "halo" | "none" | "overlay" | "solid";
export type EditTemplateInput = {
  templateData: EditTemplateTemplateInput;
};
export type EditTemplateTemplateInput = {
  description?: string | null;
  disableAutoLaunchAt?: any | null;
  enableAutoLaunchAt?: any | null;
  entityId: any;
  expireAfter?: number | null;
  expireBasedOn?: GuideExpirationCriteria | null;
  formFactorStyle?: FormFactorStyleInput | null;
  inlineEmbed?: UpsertInlineEmbedInputType | null;
  modules: ReadonlyArray<EditModuleModuleData>;
  name?: string | null;
  notificationSettings?: NotificationSettingsInputType | null;
  pageTargetingType?: GuidePageTargetingEnumType | null;
  pageTargetingUrl?: string | null;
  privateName?: string | null;
  taggedElements?: ReadonlyArray<EditTaggedElementInput> | null;
  theme?: ThemeType | null;
  type?: GuideTypeEnumType | null;
};
export type EditModuleModuleData = {
  description?: string | null;
  displayTitle?: string | null;
  entityId?: any | null;
  name?: string | null;
  stepPrototypes: ReadonlyArray<StepPrototypeInput>;
};
export type StepPrototypeInput = {
  autoCompleteInteraction?: StepPrototypeAutoCompleteInteractionInput | null;
  autoCompleteInteractions?: ReadonlyArray<AutoCompleteInteractionInput> | null;
  body?: string | null;
  bodySlate?: any | null;
  branchingDismissDisabled?: boolean | null;
  branchingEntityType?: BranchingEntityTypeEnum | null;
  branchingFormFactor?: BranchingFormFactorEnumType | null;
  branchingMultiple?: boolean | null;
  branchingPathData?: ReadonlyArray<BranchingPathInput> | null;
  branchingQuestion?: string | null;
  completeForWholeAccount?: boolean | null;
  ctas?: ReadonlyArray<StepPrototypeCtaInput> | null;
  dismissLabel?: string | null;
  entityId?: any | null;
  eventMappings?: ReadonlyArray<StepEventMappingInputType> | null;
  eventName?: string | null;
  inputs?: ReadonlyArray<InputFieldFactoryItemInput> | null;
  manualCompletionDisabled?: boolean | null;
  mediaReferences?: ReadonlyArray<MediaReferenceInputType> | null;
  name?: string | null;
  snappyAt?: any | null;
  stepEventMappingRules?: ReadonlyArray<StepEventMappingRuleInputType> | null;
  stepType?: StepTypeEnum | null;
  taggedElements?: ReadonlyArray<EditTaggedElementInput> | null;
};
export type MediaReferenceInputType = {
  entityId?: any | null;
  media: MediaInputType;
  settings?: MediaReferenceSettingsInputType | null;
};
export type MediaInputType = {
  meta?: MediaMetaInputType | null;
  type?: MediaTypeEnumType | null;
  url?: string | null;
};
export type MediaMetaInputType = {
  _?: boolean | null;
  naturalHeight?: number | null;
  naturalWidth?: number | null;
  videoId?: string | null;
  videoType?: string | null;
};
export type MediaReferenceSettingsInputType = {
  _?: boolean | null;
  alignment?: string | null;
  fill?: string | null;
  hyperlink?: string | null;
  lightboxDisabled?: boolean | null;
  playsInline?: boolean | null;
};
export type StepEventMappingRuleInputType = {
  booleanValue?: boolean | null;
  dateValue?: string | null;
  numberValue?: number | null;
  propertyName?: string | null;
  ruleType?: StepEventMappingRuleRuleType | null;
  textValue?: string | null;
  valueType?: StepEventMappingRuleValueType | null;
};
export type StepEventMappingInputType = {
  completeForWholeAccount?: boolean | null;
  eventName: string;
  rules?: ReadonlyArray<StepEventMappingRuleInputType> | null;
};
export type AutoCompleteInteractionInput = {
  interactionType: AutoCompleteInteractionType;
  templateEntityId?: string | null;
};
export type BranchingPathInput = {
  choiceKey?: string | null;
  label?: string | null;
  moduleEntityId?: string | null;
  style?: BranchingStyleInput | null;
  templateEntityId?: string | null;
};
export type BranchingStyleInput = {
  backgroundImagePosition?: CYOABackgroundImagePosition | null;
  backgroundImageUrl?: string | null;
  formFactor?: string | null;
};
export type InputFieldFactoryItemInput = {
  entityId?: any | null;
  label: string;
  settings: InputSettingsInput;
  type: InputStepFieldTypeEnumType;
};
export type InputSettingsInput = {
  helperText?: string | null;
  maxLabel?: string | null;
  maxValue?: number | null;
  minLabel?: string | null;
  minValue?: number | null;
  multiSelect?: boolean | null;
  options?: ReadonlyArray<DropdownInputOptionInput> | null;
  placeholder?: string | null;
  required?: boolean | null;
  variation?: DropdownInputVariationEnumType | null;
};
export type DropdownInputOptionInput = {
  label?: string | null;
  value?: string | null;
};
export type StepPrototypeCtaInput = {
  destinationGuide?: string | null;
  entityId?: any | null;
  settings?: StepCtaSettingsInputType | null;
  style: StepCtaStyleEnumType;
  text: string;
  type: StepCtaTypeEnumType;
  url?: string | null;
};
export type StepCtaSettingsInputType = {
  bgColorField: string;
  eventName?: string | null;
  implicit?: boolean | null;
  markComplete?: boolean | null;
  opensInNewTab?: boolean | null;
  textColorField: string;
};
export type StepPrototypeAutoCompleteInteractionInput = {
  elementHtml?: string | null;
  elementSelector: string;
  elementText?: string | null;
  entityId?: any | null;
  type: StepAutoCompleteInteractionTypeEnumType;
  url: string;
  wildcardUrl: string;
};
export type EditTaggedElementInput = {
  alignment?: ContextualTagAlignmentEnumType | null;
  elementHtml?: string | null;
  elementSelector?: string | null;
  elementText?: string | null;
  entityId?: any | null;
  relativeToText?: boolean | null;
  style?: VisualTagStyleSettingsInput | null;
  tooltipAlignment?: ContextualTagTooltipAlignmentEnumType | null;
  type?: ContextualTagTypeEnumType | null;
  url?: string | null;
  wildcardUrl?: string | null;
  xOffset?: number | null;
  yOffset?: number | null;
};
export type VisualTagStyleSettingsInput = {
  color?: string | null;
  opacity?: number | null;
  padding?: number | null;
  pulse?: boolean | null;
  radius?: number | null;
  text?: string | null;
  thickness?: number | null;
  type?: VisualTagHighlightType | null;
};
export type FormFactorStyleInput = {
  advancedPadding?: string | null;
  backgroundColor?: string | null;
  backgroundOverlayColor?: string | null;
  backgroundOverlayOpacity?: number | null;
  bannerPosition?: BannerPosition | null;
  bannerType?: BannerType | null;
  borderColor?: string | null;
  borderRadius?: number | null;
  canDismiss?: boolean | null;
  ctasOrientation?: CtasOrientation | null;
  dotsColor?: string | null;
  hasArrow?: boolean | null;
  hasBackgroundOverlay?: boolean | null;
  height?: number | null;
  hideCompletedSteps?: boolean | null;
  hideStepGroupTitle?: boolean | null;
  horizontalMediaAlignment?: HorizontalMediaAlignment | null;
  imageWidth?: string | null;
  mediaFontSize?: number | null;
  mediaOrientation?: MediaOrientation | null;
  mediaTextColor?: string | null;
  modalSize?: ModalSize | null;
  padding?: number | null;
  position?: ModalPosition | null;
  selectedBackgroundColor?: string | null;
  statusLabelColor?: string | null;
  stepBodyOrientation?: StepBodyOrientation | null;
  textColor?: string | null;
  tooltipShowOn?: TooltipShowOn | null;
  tooltipSize?: TooltipSize | null;
  verticalMediaAlignment?: VerticalMediaAlignment | null;
  verticalMediaOrientation?: VerticalMediaOrientation | null;
};
export type NotificationSettingsInputType = {
  action?: boolean | null;
  branching?: boolean | null;
  disable?: boolean | null;
  info?: boolean | null;
  input?: boolean | null;
};
export type UpsertInlineEmbedInputType = {
  alignment?: InlineEmbedAlignment | null;
  borderRadius: number;
  bottomMargin: number;
  elementSelector: string;
  entityId?: any | null;
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
export type EditTemplateMutation$variables = {
  input: EditTemplateInput;
};
export type EditTemplateMutation$data = {
  readonly editTemplate: {
    readonly errors: ReadonlyArray<string> | null;
    readonly template: {
      readonly archivedAt: any | null;
      readonly description: string | null;
      readonly disableAutoLaunchAt: any | null;
      readonly enableAutoLaunchAt: any | null;
      readonly entityId: any;
      readonly expireAfter: number | null;
      readonly expireBasedOn: GuideExpirationCriteria;
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
      readonly isSideQuest: boolean | null;
      readonly modules: ReadonlyArray<{
        readonly description: string | null;
        readonly displayTitle: string | null;
        readonly entityId: any;
        readonly name: string | null;
        readonly stepPrototypes: ReadonlyArray<{
          readonly autoCompleteInteraction: {
            readonly elementHtml: string | null;
            readonly elementSelector: string;
            readonly elementText: string | null;
            readonly type: StepAutoCompleteInteractionTypeEnumType;
            readonly url: string;
            readonly wildcardUrl: string;
          } | null;
          readonly body: string | null;
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
          readonly branchingFormFactor: BranchingFormFactorEnumType | null;
          readonly branchingKey: string | null;
          readonly branchingMultiple: boolean | null;
          readonly branchingPaths: ReadonlyArray<{
            readonly choiceKey: string | null;
            readonly entityType: BranchingPathEntityType;
            readonly module: {
              readonly entityId: any;
            } | null;
            readonly moduleEntityId: any | null;
            readonly template: {
              readonly entityId: any;
            } | null;
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
          readonly eventMappings: ReadonlyArray<{
            readonly completeForWholeAccount: boolean;
            readonly eventName: string;
            readonly rules: ReadonlyArray<{
              readonly booleanValue: boolean | null;
              readonly dateValue: any | null;
              readonly numberValue: number | null;
              readonly propertyName: string;
              readonly ruleType: StepEventMappingRuleRuleType;
              readonly textValue: string | null;
              readonly valueType: StepEventMappingRuleValueType;
            }>;
          }>;
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
      readonly notificationSettings: {
        readonly action: boolean | null;
        readonly branching: boolean | null;
        readonly disable: boolean | null;
        readonly info: boolean | null;
        readonly input: boolean | null;
      } | null;
      readonly pageTargetingType: GuidePageTargetingEnumType;
      readonly pageTargetingUrl: string | null;
      readonly privateName: string | null;
      readonly theme: ThemeType;
      readonly updatedAt: any | null;
    } | null;
  } | null;
};
export type EditTemplateMutation = {
  response: EditTemplateMutation$data;
  variables: EditTemplateMutation$variables;
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
  "name": "updatedAt",
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
  "name": "privateName",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
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
  "name": "isSideQuest",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
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
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v24 = {
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
    (v15/*: any*/),
    (v12/*: any*/),
    (v10/*: any*/),
    (v11/*: any*/),
    (v16/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v13/*: any*/),
    (v21/*: any*/),
    (v22/*: any*/),
    (v23/*: any*/)
  ],
  "type": "ModalStyle",
  "abstractKey": null
},
v25 = {
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
    (v15/*: any*/),
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
    (v16/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v13/*: any*/),
    (v21/*: any*/),
    (v22/*: any*/),
    (v23/*: any*/)
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
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v16/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v26/*: any*/),
    (v21/*: any*/),
    (v27/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v13/*: any*/),
    (v22/*: any*/),
    (v23/*: any*/)
  ],
  "type": "CardStyle",
  "abstractKey": null
},
v32 = {
  "kind": "InlineFragment",
  "selections": [
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v16/*: any*/),
    (v17/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dotsColor",
      "storageKey": null
    },
    (v26/*: any*/),
    (v21/*: any*/),
    (v27/*: any*/),
    (v28/*: any*/),
    (v29/*: any*/),
    (v30/*: any*/),
    (v13/*: any*/)
  ],
  "type": "CarouselStyle",
  "abstractKey": null
},
v33 = {
  "kind": "InlineFragment",
  "selections": [
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
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
    (v16/*: any*/),
    (v17/*: any*/),
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
    (v21/*: any*/),
    (v13/*: any*/)
  ],
  "type": "ChecklistStyle",
  "abstractKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingType",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingUrl",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoLaunchEnabled",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "enableAutoLaunchAt",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "disableAutoLaunchAt",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "archivedAt",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expireBasedOn",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expireAfter",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "concreteType": "TemplateNotificationSettings",
  "kind": "LinkedField",
  "name": "notificationSettings",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "disable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "branching",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "input",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "action",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "info",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manualCompletionDisabled",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "eventName",
  "storageKey": null
},
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completeForWholeAccount",
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propertyName",
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueType",
  "storageKey": null
},
v53 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ruleType",
  "storageKey": null
},
v54 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "numberValue",
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textValue",
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "booleanValue",
  "storageKey": null
},
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dateValue",
  "storageKey": null
},
v58 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingQuestion",
  "storageKey": null
},
v59 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingMultiple",
  "storageKey": null
},
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingDismissDisabled",
  "storageKey": null
},
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingFormFactor",
  "storageKey": null
},
v62 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingKey",
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "choiceKey",
  "storageKey": null
},
v65 = {
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
v66 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityType",
  "storageKey": null
},
v67 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "templateEntityId",
  "storageKey": null
},
v68 = [
  (v3/*: any*/)
],
v69 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "moduleEntityId",
  "storageKey": null
},
v70 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v71 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "style",
  "storageKey": null
},
v72 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v73 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v74 = {
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
    (v49/*: any*/),
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
v75 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "destinationGuide",
  "storageKey": null
},
v76 = {
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
v77 = {
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
v78 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v79 = {
  "kind": "InlineFragment",
  "selections": [
    (v78/*: any*/),
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
v80 = {
  "kind": "InlineFragment",
  "selections": [
    (v78/*: any*/),
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
v81 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v82 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v83 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementText",
  "storageKey": null
},
v84 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementHtml",
  "storageKey": null
},
v85 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "required",
  "storageKey": null
},
v86 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "helperText",
  "storageKey": null
},
v87 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxValue",
  "storageKey": null
},
v88 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "placeholder",
      "storageKey": null
    },
    (v85/*: any*/),
    (v86/*: any*/),
    (v87/*: any*/)
  ],
  "type": "TextOrEmailSettings",
  "abstractKey": null
},
v89 = {
  "kind": "InlineFragment",
  "selections": [
    (v85/*: any*/),
    (v86/*: any*/)
  ],
  "type": "NpsSettings",
  "abstractKey": null
},
v90 = {
  "kind": "InlineFragment",
  "selections": [
    (v85/*: any*/),
    (v86/*: any*/),
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
    (v87/*: any*/)
  ],
  "type": "NumberPollSettings",
  "abstractKey": null
},
v91 = {
  "kind": "InlineFragment",
  "selections": [
    (v85/*: any*/),
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
        (v63/*: any*/),
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
v92 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "errors",
  "storageKey": null
},
v93 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v94 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v95 = [
  (v3/*: any*/),
  (v94/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditTemplatePayload",
        "kind": "LinkedField",
        "name": "editTemplate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
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
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "formFactorStyle",
                "plural": false,
                "selections": [
                  (v14/*: any*/),
                  (v24/*: any*/),
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
              (v39/*: any*/),
              (v40/*: any*/),
              (v41/*: any*/),
              (v42/*: any*/),
              (v43/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "modules",
                "plural": true,
                "selections": [
                  (v6/*: any*/),
                  (v44/*: any*/),
                  (v5/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototype",
                    "kind": "LinkedField",
                    "name": "stepPrototypes",
                    "plural": true,
                    "selections": [
                      (v6/*: any*/),
                      (v3/*: any*/),
                      (v45/*: any*/),
                      (v46/*: any*/),
                      (v47/*: any*/),
                      (v48/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepEventMapping",
                        "kind": "LinkedField",
                        "name": "eventMappings",
                        "plural": true,
                        "selections": [
                          (v49/*: any*/),
                          (v50/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StepEventMappingRule",
                            "kind": "LinkedField",
                            "name": "rules",
                            "plural": true,
                            "selections": [
                              (v51/*: any*/),
                              (v52/*: any*/),
                              (v53/*: any*/),
                              (v54/*: any*/),
                              (v55/*: any*/),
                              (v56/*: any*/),
                              (v57/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v58/*: any*/),
                      (v59/*: any*/),
                      (v60/*: any*/),
                      (v61/*: any*/),
                      (v62/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BranchingChoice",
                        "kind": "LinkedField",
                        "name": "branchingChoices",
                        "plural": true,
                        "selections": [
                          (v63/*: any*/),
                          (v64/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "style",
                            "plural": false,
                            "selections": [
                              (v65/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
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
                          (v64/*: any*/),
                          (v66/*: any*/),
                          (v67/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Template",
                            "kind": "LinkedField",
                            "name": "template",
                            "plural": false,
                            "selections": (v68/*: any*/),
                            "storageKey": null
                          },
                          (v69/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Module",
                            "kind": "LinkedField",
                            "name": "module",
                            "plural": false,
                            "selections": (v68/*: any*/),
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
                          (v3/*: any*/),
                          (v70/*: any*/),
                          (v71/*: any*/),
                          (v72/*: any*/),
                          (v73/*: any*/),
                          (v74/*: any*/),
                          (v75/*: any*/)
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
                              (v70/*: any*/),
                              (v73/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "meta",
                                "plural": false,
                                "selections": [
                                  (v76/*: any*/),
                                  (v77/*: any*/)
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
                              (v79/*: any*/),
                              (v80/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepPrototypeAutoCompleteInteraction",
                        "kind": "LinkedField",
                        "name": "autoCompleteInteraction",
                        "plural": false,
                        "selections": [
                          (v73/*: any*/),
                          (v70/*: any*/),
                          (v81/*: any*/),
                          (v82/*: any*/),
                          (v83/*: any*/),
                          (v84/*: any*/)
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
                          (v3/*: any*/),
                          (v63/*: any*/),
                          (v70/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "settings",
                            "plural": false,
                            "selections": [
                              (v88/*: any*/),
                              (v89/*: any*/),
                              (v90/*: any*/),
                              (v91/*: any*/)
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
          (v92/*: any*/)
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
    "name": "EditTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditTemplatePayload",
        "kind": "LinkedField",
        "name": "editTemplate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
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
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "formFactorStyle",
                "plural": false,
                "selections": [
                  (v93/*: any*/),
                  {
                    "kind": "TypeDiscriminator",
                    "abstractKey": "__isFormFactorStyle"
                  },
                  (v14/*: any*/),
                  (v24/*: any*/),
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
              (v39/*: any*/),
              (v40/*: any*/),
              (v41/*: any*/),
              (v42/*: any*/),
              (v43/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "modules",
                "plural": true,
                "selections": [
                  (v6/*: any*/),
                  (v44/*: any*/),
                  (v5/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototype",
                    "kind": "LinkedField",
                    "name": "stepPrototypes",
                    "plural": true,
                    "selections": [
                      (v6/*: any*/),
                      (v3/*: any*/),
                      (v45/*: any*/),
                      (v46/*: any*/),
                      (v47/*: any*/),
                      (v48/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepEventMapping",
                        "kind": "LinkedField",
                        "name": "eventMappings",
                        "plural": true,
                        "selections": [
                          (v49/*: any*/),
                          (v50/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StepEventMappingRule",
                            "kind": "LinkedField",
                            "name": "rules",
                            "plural": true,
                            "selections": [
                              (v51/*: any*/),
                              (v52/*: any*/),
                              (v53/*: any*/),
                              (v54/*: any*/),
                              (v55/*: any*/),
                              (v56/*: any*/),
                              (v57/*: any*/),
                              (v94/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v94/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v58/*: any*/),
                      (v59/*: any*/),
                      (v60/*: any*/),
                      (v61/*: any*/),
                      (v62/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BranchingChoice",
                        "kind": "LinkedField",
                        "name": "branchingChoices",
                        "plural": true,
                        "selections": [
                          (v63/*: any*/),
                          (v64/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "style",
                            "plural": false,
                            "selections": [
                              (v93/*: any*/),
                              {
                                "kind": "TypeDiscriminator",
                                "abstractKey": "__isBranchingStyle"
                              },
                              (v65/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
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
                          (v64/*: any*/),
                          (v66/*: any*/),
                          (v67/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Template",
                            "kind": "LinkedField",
                            "name": "template",
                            "plural": false,
                            "selections": (v95/*: any*/),
                            "storageKey": null
                          },
                          (v69/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Module",
                            "kind": "LinkedField",
                            "name": "module",
                            "plural": false,
                            "selections": (v95/*: any*/),
                            "storageKey": null
                          },
                          (v94/*: any*/)
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
                          (v3/*: any*/),
                          (v70/*: any*/),
                          (v71/*: any*/),
                          (v72/*: any*/),
                          (v73/*: any*/),
                          (v74/*: any*/),
                          (v75/*: any*/),
                          (v94/*: any*/)
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
                              (v70/*: any*/),
                              (v73/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "meta",
                                "plural": false,
                                "selections": [
                                  (v93/*: any*/),
                                  (v76/*: any*/),
                                  (v77/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v94/*: any*/)
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
                              (v93/*: any*/),
                              (v79/*: any*/),
                              (v80/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v94/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepPrototypeAutoCompleteInteraction",
                        "kind": "LinkedField",
                        "name": "autoCompleteInteraction",
                        "plural": false,
                        "selections": [
                          (v73/*: any*/),
                          (v70/*: any*/),
                          (v81/*: any*/),
                          (v82/*: any*/),
                          (v83/*: any*/),
                          (v84/*: any*/),
                          (v94/*: any*/)
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
                          (v3/*: any*/),
                          (v63/*: any*/),
                          (v70/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "settings",
                            "plural": false,
                            "selections": [
                              (v93/*: any*/),
                              {
                                "kind": "TypeDiscriminator",
                                "abstractKey": "__isInputSettings"
                              },
                              (v88/*: any*/),
                              (v89/*: any*/),
                              (v90/*: any*/),
                              (v91/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v94/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v94/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v94/*: any*/)
                ],
                "storageKey": null
              },
              (v94/*: any*/)
            ],
            "storageKey": null
          },
          (v92/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ea990ccccd162e71cf49d0cde235745b",
    "id": null,
    "metadata": {},
    "name": "EditTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation EditTemplateMutation(\n  $input: EditTemplateInput!\n) {\n  editTemplate(input: $input) {\n    template {\n      updatedAt\n      entityId\n      privateName\n      description\n      name\n      theme\n      isSideQuest\n      formFactor\n      formFactorStyle {\n        __typename\n        __isFormFactorStyle: __typename\n        ... on BannerStyle {\n          bannerType\n          bannerPosition\n          backgroundColor\n          textColor\n          canDismiss\n          ctasOrientation\n        }\n        ... on ModalStyle {\n          modalSize\n          position\n          hasBackgroundOverlay\n          canDismiss\n          backgroundColor\n          textColor\n          stepBodyOrientation\n          mediaOrientation\n          verticalMediaOrientation\n          verticalMediaAlignment\n          horizontalMediaAlignment\n          ctasOrientation\n          imageWidth\n          mediaFontSize\n          mediaTextColor\n        }\n        ... on TooltipStyle {\n          backgroundColor\n          backgroundOverlayColor\n          backgroundOverlayOpacity\n          hasArrow\n          hasBackgroundOverlay\n          textColor\n          tooltipShowOn\n          tooltipSize\n          canDismiss\n          stepBodyOrientation\n          mediaOrientation\n          verticalMediaOrientation\n          verticalMediaAlignment\n          horizontalMediaAlignment\n          ctasOrientation\n          imageWidth\n          mediaFontSize\n          mediaTextColor\n        }\n        ... on CardStyle {\n          backgroundColor\n          textColor\n          canDismiss\n          stepBodyOrientation\n          mediaOrientation\n          verticalMediaOrientation\n          verticalMediaAlignment\n          horizontalMediaAlignment\n          height\n          imageWidth\n          borderColor\n          borderRadius\n          padding\n          advancedPadding\n          ctasOrientation\n          mediaFontSize\n          mediaTextColor\n        }\n        ... on CarouselStyle {\n          backgroundColor\n          textColor\n          canDismiss\n          stepBodyOrientation\n          mediaOrientation\n          dotsColor\n          height\n          imageWidth\n          borderColor\n          borderRadius\n          padding\n          advancedPadding\n          ctasOrientation\n        }\n        ... on VideoGalleryStyle {\n          backgroundColor\n          textColor\n          canDismiss\n          borderColor\n          borderRadius\n          padding\n          advancedPadding\n          selectedBackgroundColor\n          statusLabelColor\n        }\n        ... on ChecklistStyle {\n          stepBodyOrientation\n          mediaOrientation\n          height\n          hideStepGroupTitle\n          hideCompletedSteps\n          imageWidth\n          ctasOrientation\n        }\n      }\n      pageTargetingType\n      pageTargetingUrl\n      isAutoLaunchEnabled\n      enableAutoLaunchAt\n      disableAutoLaunchAt\n      archivedAt\n      expireBasedOn\n      expireAfter\n      notificationSettings {\n        disable\n        branching\n        input\n        action\n        info\n      }\n      modules {\n        name\n        displayTitle\n        description\n        entityId\n        stepPrototypes {\n          name\n          entityId\n          body\n          bodySlate\n          stepType\n          manualCompletionDisabled\n          eventMappings {\n            eventName\n            completeForWholeAccount\n            rules {\n              propertyName\n              valueType\n              ruleType\n              numberValue\n              textValue\n              booleanValue\n              dateValue\n              id\n            }\n            id\n          }\n          branchingQuestion\n          branchingMultiple\n          branchingDismissDisabled\n          branchingFormFactor\n          branchingKey\n          branchingChoices {\n            label\n            choiceKey\n            style {\n              __typename\n              __isBranchingStyle: __typename\n              ... on BranchingCardStyle {\n                backgroundImageUrl\n                backgroundImagePosition\n              }\n            }\n          }\n          branchingPaths {\n            choiceKey\n            entityType\n            templateEntityId\n            template {\n              entityId\n              id\n            }\n            moduleEntityId\n            module {\n              entityId\n              id\n            }\n            id\n          }\n          ctas {\n            entityId\n            type\n            style\n            text\n            url\n            settings {\n              bgColorField\n              textColorField\n              eventName\n              markComplete\n              implicit\n              opensInNewTab\n            }\n            destinationGuide\n            id\n          }\n          mediaReferences {\n            entityId\n            media {\n              type\n              url\n              meta {\n                __typename\n                ... on ImageMediaMeta {\n                  naturalWidth\n                  naturalHeight\n                }\n                ... on VideoMediaMeta {\n                  videoId\n                  videoType\n                }\n              }\n              id\n            }\n            settings {\n              __typename\n              ... on ImageMediaReferenceSettings {\n                alignment\n                fill\n                hyperlink\n                lightboxDisabled\n              }\n              ... on VideoMediaReferenceSettings {\n                alignment\n                playsInline\n              }\n            }\n            id\n          }\n          autoCompleteInteraction {\n            url\n            type\n            wildcardUrl\n            elementSelector\n            elementText\n            elementHtml\n            id\n          }\n          inputs {\n            entityId\n            label\n            type\n            settings {\n              __typename\n              __isInputSettings: __typename\n              ... on TextOrEmailSettings {\n                placeholder\n                required\n                helperText\n                maxValue\n              }\n              ... on NpsSettings {\n                required\n                helperText\n              }\n              ... on NumberPollSettings {\n                required\n                helperText\n                minLabel\n                minValue\n                maxLabel\n                maxValue\n              }\n              ... on DropdownSettings {\n                required\n                multiSelect\n                variation\n                options {\n                  label\n                  value\n                }\n              }\n            }\n            id\n          }\n          id\n        }\n        id\n      }\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "c523f1de3b48950ea4ed5d38b458f554";

export default node;
