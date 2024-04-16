/**
 * @generated SignedSource<<2c47940e0d65cfb1c18a994d701e25e0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AutoCompleteInteractionType = "guide_completion";
export type BranchingEntityTypeEnum = "guide" | "module" | "template";
export type BranchingFormFactorEnumType = "cards" | "dropdown";
export type CYOABackgroundImagePosition = "background" | "bottom" | "left" | "right" | "top";
export type ContextualTagAlignmentEnumType = "bottom_left" | "bottom_right" | "center_left" | "center_right" | "top_left" | "top_right";
export type ContextualTagTooltipAlignmentEnumType = "bottom" | "left" | "right" | "top";
export type ContextualTagTypeEnumType = "badge" | "badge_dot" | "badge_icon" | "dot" | "highlight" | "icon";
export type CreateGuideVariationEnumType = "horizontal" | "vertical";
export type DropdownInputVariationEnumType = "cards" | "dropdown";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type InputStepFieldTypeEnumType = "date" | "dropdown" | "email" | "nps" | "numberPoll" | "paragraph" | "text";
export type MediaTypeEnumType = "image" | "number_attribute" | "video";
export type StepAutoCompleteInteractionTypeEnumType = "click";
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepEventMappingRuleRuleType = "eq" | "gt" | "gte" | "lt" | "lte";
export type StepEventMappingRuleValueType = "boolean" | "date" | "number" | "text";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type VisualTagHighlightType = "halo" | "none" | "overlay" | "solid";
export type CreateTemplateInput = {
  templateData: CreateTemplateTemplateInput;
  variation?: CreateGuideVariationEnumType | null;
};
export type CreateTemplateTemplateInput = {
  description?: string | null;
  formFactor?: GuideFormFactorEnumType | null;
  isCyoa?: boolean | null;
  isSideQuest?: boolean | null;
  modules?: ReadonlyArray<EditModuleModuleData> | null;
  name?: string | null;
  pageTargetingType?: GuidePageTargetingEnumType | null;
  pageTargetingUrl?: string | null;
  privateName?: string | null;
  theme?: ThemeType | null;
  type: GuideTypeEnumType;
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
export type CreateTemplateMutation$variables = {
  input: CreateTemplateInput;
};
export type CreateTemplateMutation$data = {
  readonly createTemplate: {
    readonly errors: ReadonlyArray<string> | null;
    readonly template: {
      readonly entityId: any;
      readonly formFactor: GuideFormFactorEnumType | null;
      readonly isSideQuest: boolean | null;
      readonly modules: ReadonlyArray<{
        readonly description: string | null;
        readonly displayTitle: string | null;
        readonly entityId: any;
        readonly name: string | null;
        readonly stepPrototypes: ReadonlyArray<{
          readonly body: string | null;
          readonly bodySlate: any | null;
          readonly entityId: any;
          readonly name: string;
          readonly stepType: StepTypeEnum;
        }>;
      }>;
      readonly name: string | null;
      readonly privateName: string | null;
      readonly theme: ThemeType;
    } | null;
  } | null;
};
export type CreateTemplateMutation = {
  response: CreateTemplateMutation$data;
  variables: CreateTemplateMutation$variables;
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
  "name": "name",
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
  "name": "isSideQuest",
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
  "name": "theme",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "errors",
  "storageKey": null
},
v14 = {
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
    "name": "CreateTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateTemplatePayload",
        "kind": "LinkedField",
        "name": "createTemplate",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "modules",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototype",
                    "kind": "LinkedField",
                    "name": "stepPrototypes",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v2/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v13/*: any*/)
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
    "name": "CreateTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateTemplatePayload",
        "kind": "LinkedField",
        "name": "createTemplate",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "modules",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototype",
                    "kind": "LinkedField",
                    "name": "stepPrototypes",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v2/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v14/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v14/*: any*/)
                ],
                "storageKey": null
              },
              (v14/*: any*/)
            ],
            "storageKey": null
          },
          (v13/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e98b214d4c62aa7fd5669856a5edc9dc",
    "id": null,
    "metadata": {},
    "name": "CreateTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation CreateTemplateMutation(\n  $input: CreateTemplateInput!\n) {\n  createTemplate(input: $input) {\n    template {\n      entityId\n      name\n      privateName\n      isSideQuest\n      formFactor\n      theme\n      modules {\n        name\n        displayTitle\n        description\n        entityId\n        stepPrototypes {\n          name\n          entityId\n          body\n          bodySlate\n          stepType\n          id\n        }\n        id\n      }\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "fc5525f92ee1417a4d479dac962495f2";

export default node;
