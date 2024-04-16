/**
 * @generated SignedSource<<7be2ea75b235f7f7dc23d095b8c198de>>
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
export type BranchingPathEntityType = "guide" | "module" | "template";
export type CYOABackgroundImagePosition = "background" | "bottom" | "left" | "right" | "top";
export type ContextualTagAlignmentEnumType = "bottom_left" | "bottom_right" | "center_left" | "center_right" | "top_left" | "top_right";
export type ContextualTagTooltipAlignmentEnumType = "bottom" | "left" | "right" | "top";
export type ContextualTagTypeEnumType = "badge" | "badge_dot" | "badge_icon" | "dot" | "highlight" | "icon";
export type DropdownInputVariationEnumType = "cards" | "dropdown";
export type InputStepFieldTypeEnumType = "date" | "dropdown" | "email" | "nps" | "numberPoll" | "paragraph" | "text";
export type MediaTypeEnumType = "image" | "number_attribute" | "video";
export type StepAutoCompleteInteractionTypeEnumType = "click";
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepEventMappingRuleRuleType = "eq" | "gt" | "gte" | "lt" | "lte";
export type StepEventMappingRuleValueType = "boolean" | "date" | "number" | "text";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type VisualTagHighlightType = "halo" | "none" | "overlay" | "solid";
export type CreateModuleInput = {
  moduleData: EditModuleModuleData;
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
export type CreateModuleMutation$variables = {
  input: CreateModuleInput;
};
export type CreateModuleMutation$data = {
  readonly createModule: {
    readonly errors: ReadonlyArray<string> | null;
    readonly module: {
      readonly description: string | null;
      readonly displayTitle: string | null;
      readonly entityId: any;
      readonly name: string | null;
      readonly stepPrototypes: ReadonlyArray<{
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
        readonly branchingMultiple: boolean | null;
        readonly branchingPaths: ReadonlyArray<{
          readonly choiceKey: string | null;
          readonly entityType: BranchingPathEntityType;
          readonly module: {
            readonly entityId: any;
          } | null;
          readonly template: {
            readonly entityId: any;
          } | null;
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
    } | null;
  } | null;
};
export type CreateModuleMutation = {
  response: CreateModuleMutation$data;
  variables: CreateModuleMutation$variables;
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
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manualCompletionDisabled",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "eventName",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completeForWholeAccount",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propertyName",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueType",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ruleType",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "numberValue",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textValue",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "booleanValue",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dateValue",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingQuestion",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingMultiple",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingDismissDisabled",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingFormFactor",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "choiceKey",
  "storageKey": null
},
v25 = {
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
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityType",
  "storageKey": null
},
v27 = [
  (v5/*: any*/)
],
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "style",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v32 = {
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
    (v10/*: any*/),
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
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "destinationGuide",
  "storageKey": null
},
v34 = {
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
v35 = {
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
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v37 = {
  "kind": "InlineFragment",
  "selections": [
    (v36/*: any*/),
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
v38 = {
  "kind": "InlineFragment",
  "selections": [
    (v36/*: any*/),
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
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "errors",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v42 = [
  (v5/*: any*/),
  (v40/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateModuleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateModulePayload",
        "kind": "LinkedField",
        "name": "createModule",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "module",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepPrototype",
                "kind": "LinkedField",
                "name": "stepPrototypes",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepEventMapping",
                    "kind": "LinkedField",
                    "name": "eventMappings",
                    "plural": true,
                    "selections": [
                      (v10/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepEventMappingRule",
                        "kind": "LinkedField",
                        "name": "rules",
                        "plural": true,
                        "selections": [
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          (v18/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v21/*: any*/),
                  (v22/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BranchingChoice",
                    "kind": "LinkedField",
                    "name": "branchingChoices",
                    "plural": true,
                    "selections": [
                      (v23/*: any*/),
                      (v24/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "style",
                        "plural": false,
                        "selections": [
                          (v25/*: any*/)
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
                      (v24/*: any*/),
                      (v26/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Template",
                        "kind": "LinkedField",
                        "name": "template",
                        "plural": false,
                        "selections": (v27/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Module",
                        "kind": "LinkedField",
                        "name": "module",
                        "plural": false,
                        "selections": (v27/*: any*/),
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
                      (v5/*: any*/),
                      (v28/*: any*/),
                      (v29/*: any*/),
                      (v30/*: any*/),
                      (v31/*: any*/),
                      (v32/*: any*/),
                      (v33/*: any*/)
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
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Media",
                        "kind": "LinkedField",
                        "name": "media",
                        "plural": false,
                        "selections": [
                          (v28/*: any*/),
                          (v31/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "meta",
                            "plural": false,
                            "selections": [
                              (v34/*: any*/),
                              (v35/*: any*/)
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
                          (v37/*: any*/),
                          (v38/*: any*/)
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
          (v39/*: any*/)
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
    "name": "CreateModuleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateModulePayload",
        "kind": "LinkedField",
        "name": "createModule",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "module",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepPrototype",
                "kind": "LinkedField",
                "name": "stepPrototypes",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepEventMapping",
                    "kind": "LinkedField",
                    "name": "eventMappings",
                    "plural": true,
                    "selections": [
                      (v10/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepEventMappingRule",
                        "kind": "LinkedField",
                        "name": "rules",
                        "plural": true,
                        "selections": [
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          (v18/*: any*/),
                          (v40/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v40/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v21/*: any*/),
                  (v22/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BranchingChoice",
                    "kind": "LinkedField",
                    "name": "branchingChoices",
                    "plural": true,
                    "selections": [
                      (v23/*: any*/),
                      (v24/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "style",
                        "plural": false,
                        "selections": [
                          (v41/*: any*/),
                          {
                            "kind": "TypeDiscriminator",
                            "abstractKey": "__isBranchingStyle"
                          },
                          (v25/*: any*/)
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
                      (v24/*: any*/),
                      (v26/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Template",
                        "kind": "LinkedField",
                        "name": "template",
                        "plural": false,
                        "selections": (v42/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Module",
                        "kind": "LinkedField",
                        "name": "module",
                        "plural": false,
                        "selections": (v42/*: any*/),
                        "storageKey": null
                      },
                      (v40/*: any*/)
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
                      (v5/*: any*/),
                      (v28/*: any*/),
                      (v29/*: any*/),
                      (v30/*: any*/),
                      (v31/*: any*/),
                      (v32/*: any*/),
                      (v33/*: any*/),
                      (v40/*: any*/)
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
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Media",
                        "kind": "LinkedField",
                        "name": "media",
                        "plural": false,
                        "selections": [
                          (v28/*: any*/),
                          (v31/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "meta",
                            "plural": false,
                            "selections": [
                              (v41/*: any*/),
                              (v34/*: any*/),
                              (v35/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v40/*: any*/)
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
                          (v41/*: any*/),
                          (v37/*: any*/),
                          (v38/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v40/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v40/*: any*/)
                ],
                "storageKey": null
              },
              (v40/*: any*/)
            ],
            "storageKey": null
          },
          (v39/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2bcd81a0acd03ae8da1c600f782006cf",
    "id": null,
    "metadata": {},
    "name": "CreateModuleMutation",
    "operationKind": "mutation",
    "text": "mutation CreateModuleMutation(\n  $input: CreateModuleInput!\n) {\n  createModule(input: $input) {\n    module {\n      name\n      displayTitle\n      description\n      entityId\n      stepPrototypes {\n        name\n        entityId\n        body\n        bodySlate\n        stepType\n        manualCompletionDisabled\n        eventMappings {\n          eventName\n          completeForWholeAccount\n          rules {\n            propertyName\n            valueType\n            ruleType\n            numberValue\n            textValue\n            booleanValue\n            dateValue\n            id\n          }\n          id\n        }\n        branchingQuestion\n        branchingMultiple\n        branchingDismissDisabled\n        branchingFormFactor\n        branchingChoices {\n          label\n          choiceKey\n          style {\n            __typename\n            __isBranchingStyle: __typename\n            ... on BranchingCardStyle {\n              backgroundImageUrl\n              backgroundImagePosition\n            }\n          }\n        }\n        branchingPaths {\n          choiceKey\n          entityType\n          template {\n            entityId\n            id\n          }\n          module {\n            entityId\n            id\n          }\n          id\n        }\n        ctas {\n          entityId\n          type\n          style\n          text\n          url\n          settings {\n            bgColorField\n            textColorField\n            eventName\n            markComplete\n            implicit\n            opensInNewTab\n          }\n          destinationGuide\n          id\n        }\n        mediaReferences {\n          entityId\n          media {\n            type\n            url\n            meta {\n              __typename\n              ... on ImageMediaMeta {\n                naturalWidth\n                naturalHeight\n              }\n              ... on VideoMediaMeta {\n                videoId\n                videoType\n              }\n            }\n            id\n          }\n          settings {\n            __typename\n            ... on ImageMediaReferenceSettings {\n              alignment\n              fill\n              hyperlink\n              lightboxDisabled\n            }\n            ... on VideoMediaReferenceSettings {\n              alignment\n              playsInline\n            }\n          }\n          id\n        }\n        id\n      }\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "bd698ab12c36a710354ad92523e0fb33";

export default node;
