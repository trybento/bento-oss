/**
 * @generated SignedSource<<10219129f0f3f377d2db6feafdfc8596>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type BranchingFormFactorEnumType = "cards" | "dropdown";
export type BranchingPathEntityType = "guide" | "module" | "template";
export type CYOABackgroundImagePosition = "background" | "bottom" | "left" | "right" | "top";
export type DropdownInputVariationEnumType = "cards" | "dropdown";
export type InputStepFieldTypeEnumType = "date" | "dropdown" | "email" | "nps" | "numberPoll" | "paragraph" | "text";
export type MediaTypeEnumType = "image" | "number_attribute" | "video";
export type ModuleRuleType = "attribute_rules";
export type StepAutoCompleteInteractionTypeEnumType = "click";
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepEventMappingRuleRuleType = "eq" | "gt" | "gte" | "lt" | "lte";
export type StepEventMappingRuleValueType = "boolean" | "date" | "number" | "text";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type EditModuleQuery$variables = {
  moduleEntityId: any;
};
export type EditModuleQuery$data = {
  readonly module: {
    readonly displayTitle: string | null;
    readonly entityId: any;
    readonly lastEdited: {
      readonly timestamp: any | null;
    } | null;
    readonly name: string | null;
    readonly propagationCount: number;
    readonly propagationQueue: number;
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
      readonly snappyAt: any | null;
      readonly stepType: StepTypeEnum;
    }>;
    readonly targetingData: ReadonlyArray<{
      readonly autoLaunchRules: ReadonlyArray<{
        readonly ruleType: ModuleRuleType;
        readonly rules: ReadonlyArray<any>;
      }>;
      readonly targetTemplate: string;
    }>;
    readonly templates: ReadonlyArray<{
      readonly entityId: any;
    }>;
  } | null;
};
export type EditModuleQuery = {
  response: EditModuleQuery$data;
  variables: EditModuleQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "moduleEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "moduleEntityId"
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
  "name": "entityId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "TemplateLastEdited",
  "kind": "LinkedField",
  "name": "lastEdited",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "timestamp",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v6 = [
  (v4/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propagationQueue",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propagationCount",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "snappyAt",
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
  "name": "manualCompletionDisabled",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "eventName",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completeForWholeAccount",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propertyName",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueType",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ruleType",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "numberValue",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textValue",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "booleanValue",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dateValue",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingQuestion",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingMultiple",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingDismissDisabled",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingFormFactor",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "choiceKey",
  "storageKey": null
},
v29 = {
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
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityType",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "style",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v35 = {
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
    (v14/*: any*/),
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
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "destinationGuide",
  "storageKey": null
},
v37 = {
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
v38 = {
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
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v40 = {
  "kind": "InlineFragment",
  "selections": [
    (v39/*: any*/),
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
v41 = {
  "kind": "InlineFragment",
  "selections": [
    (v39/*: any*/),
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
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementText",
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementHtml",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "required",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "helperText",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxValue",
  "storageKey": null
},
v49 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "placeholder",
      "storageKey": null
    },
    (v46/*: any*/),
    (v47/*: any*/),
    (v48/*: any*/)
  ],
  "type": "TextOrEmailSettings",
  "abstractKey": null
},
v50 = {
  "kind": "InlineFragment",
  "selections": [
    (v46/*: any*/),
    (v47/*: any*/)
  ],
  "type": "NpsSettings",
  "abstractKey": null
},
v51 = {
  "kind": "InlineFragment",
  "selections": [
    (v46/*: any*/),
    (v47/*: any*/),
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
    (v48/*: any*/)
  ],
  "type": "NumberPollSettings",
  "abstractKey": null
},
v52 = {
  "kind": "InlineFragment",
  "selections": [
    (v46/*: any*/),
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
        (v27/*: any*/),
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
v53 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "targetTemplate",
  "storageKey": null
},
v54 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rules",
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v56 = [
  (v4/*: any*/),
  (v55/*: any*/)
],
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditModuleQuery",
    "selections": [
      {
        "alias": "module",
        "args": (v1/*: any*/),
        "concreteType": "Module",
        "kind": "LinkedField",
        "name": "findModule",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": (v6/*: any*/),
            "storageKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototype",
            "kind": "LinkedField",
            "name": "stepPrototypes",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v4/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepEventMapping",
                "kind": "LinkedField",
                "name": "eventMappings",
                "plural": true,
                "selections": [
                  (v14/*: any*/),
                  (v15/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepEventMappingRule",
                    "kind": "LinkedField",
                    "name": "rules",
                    "plural": true,
                    "selections": [
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v23/*: any*/),
              (v24/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "BranchingChoice",
                "kind": "LinkedField",
                "name": "branchingChoices",
                "plural": true,
                "selections": [
                  (v27/*: any*/),
                  (v28/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "style",
                    "plural": false,
                    "selections": [
                      (v29/*: any*/)
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
                  (v28/*: any*/),
                  (v30/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Template",
                    "kind": "LinkedField",
                    "name": "template",
                    "plural": false,
                    "selections": (v6/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Module",
                    "kind": "LinkedField",
                    "name": "module",
                    "plural": false,
                    "selections": (v6/*: any*/),
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
                  (v4/*: any*/),
                  (v31/*: any*/),
                  (v32/*: any*/),
                  (v33/*: any*/),
                  (v34/*: any*/),
                  (v35/*: any*/),
                  (v36/*: any*/)
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
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Media",
                    "kind": "LinkedField",
                    "name": "media",
                    "plural": false,
                    "selections": [
                      (v31/*: any*/),
                      (v34/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "meta",
                        "plural": false,
                        "selections": [
                          (v37/*: any*/),
                          (v38/*: any*/)
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
                      (v40/*: any*/),
                      (v41/*: any*/)
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
                  (v34/*: any*/),
                  (v31/*: any*/),
                  (v42/*: any*/),
                  (v43/*: any*/),
                  (v44/*: any*/),
                  (v45/*: any*/)
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
                  (v4/*: any*/),
                  (v27/*: any*/),
                  (v31/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "settings",
                    "plural": false,
                    "selections": [
                      (v49/*: any*/),
                      (v50/*: any*/),
                      (v51/*: any*/),
                      (v52/*: any*/)
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
            "concreteType": "ModuleTargetingData",
            "kind": "LinkedField",
            "name": "targetingData",
            "plural": true,
            "selections": [
              (v53/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ModuleAutoLaunchRule",
                "kind": "LinkedField",
                "name": "autoLaunchRules",
                "plural": true,
                "selections": [
                  (v18/*: any*/),
                  (v54/*: any*/)
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
    "name": "EditModuleQuery",
    "selections": [
      {
        "alias": "module",
        "args": (v1/*: any*/),
        "concreteType": "Module",
        "kind": "LinkedField",
        "name": "findModule",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": (v56/*: any*/),
            "storageKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototype",
            "kind": "LinkedField",
            "name": "stepPrototypes",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v4/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepEventMapping",
                "kind": "LinkedField",
                "name": "eventMappings",
                "plural": true,
                "selections": [
                  (v14/*: any*/),
                  (v15/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepEventMappingRule",
                    "kind": "LinkedField",
                    "name": "rules",
                    "plural": true,
                    "selections": [
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      (v55/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v55/*: any*/)
                ],
                "storageKey": null
              },
              (v23/*: any*/),
              (v24/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "BranchingChoice",
                "kind": "LinkedField",
                "name": "branchingChoices",
                "plural": true,
                "selections": [
                  (v27/*: any*/),
                  (v28/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "style",
                    "plural": false,
                    "selections": [
                      (v57/*: any*/),
                      {
                        "kind": "TypeDiscriminator",
                        "abstractKey": "__isBranchingStyle"
                      },
                      (v29/*: any*/)
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
                  (v28/*: any*/),
                  (v30/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Template",
                    "kind": "LinkedField",
                    "name": "template",
                    "plural": false,
                    "selections": (v56/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Module",
                    "kind": "LinkedField",
                    "name": "module",
                    "plural": false,
                    "selections": (v56/*: any*/),
                    "storageKey": null
                  },
                  (v55/*: any*/)
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
                  (v4/*: any*/),
                  (v31/*: any*/),
                  (v32/*: any*/),
                  (v33/*: any*/),
                  (v34/*: any*/),
                  (v35/*: any*/),
                  (v36/*: any*/),
                  (v55/*: any*/)
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
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Media",
                    "kind": "LinkedField",
                    "name": "media",
                    "plural": false,
                    "selections": [
                      (v31/*: any*/),
                      (v34/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "meta",
                        "plural": false,
                        "selections": [
                          (v57/*: any*/),
                          (v37/*: any*/),
                          (v38/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v55/*: any*/)
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
                      (v57/*: any*/),
                      (v40/*: any*/),
                      (v41/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v55/*: any*/)
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
                  (v34/*: any*/),
                  (v31/*: any*/),
                  (v42/*: any*/),
                  (v43/*: any*/),
                  (v44/*: any*/),
                  (v45/*: any*/),
                  (v55/*: any*/)
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
                  (v4/*: any*/),
                  (v27/*: any*/),
                  (v31/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "settings",
                    "plural": false,
                    "selections": [
                      (v57/*: any*/),
                      {
                        "kind": "TypeDiscriminator",
                        "abstractKey": "__isInputSettings"
                      },
                      (v49/*: any*/),
                      (v50/*: any*/),
                      (v51/*: any*/),
                      (v52/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v55/*: any*/)
                ],
                "storageKey": null
              },
              (v55/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ModuleTargetingData",
            "kind": "LinkedField",
            "name": "targetingData",
            "plural": true,
            "selections": [
              (v53/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ModuleAutoLaunchRule",
                "kind": "LinkedField",
                "name": "autoLaunchRules",
                "plural": true,
                "selections": [
                  (v18/*: any*/),
                  (v54/*: any*/),
                  (v55/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v55/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "12e07e447e95deae3daade89c8189380",
    "id": null,
    "metadata": {},
    "name": "EditModuleQuery",
    "operationKind": "query",
    "text": "query EditModuleQuery(\n  $moduleEntityId: EntityId!\n) {\n  module: findModule(entityId: $moduleEntityId) {\n    name\n    displayTitle\n    entityId\n    lastEdited {\n      timestamp\n    }\n    templates {\n      entityId\n      id\n    }\n    propagationQueue\n    propagationCount\n    stepPrototypes {\n      name\n      entityId\n      snappyAt\n      body\n      bodySlate\n      stepType\n      manualCompletionDisabled\n      eventMappings {\n        eventName\n        completeForWholeAccount\n        rules {\n          propertyName\n          valueType\n          ruleType\n          numberValue\n          textValue\n          booleanValue\n          dateValue\n          id\n        }\n        id\n      }\n      branchingQuestion\n      branchingMultiple\n      branchingDismissDisabled\n      branchingFormFactor\n      branchingChoices {\n        label\n        choiceKey\n        style {\n          __typename\n          __isBranchingStyle: __typename\n          ... on BranchingCardStyle {\n            backgroundImageUrl\n            backgroundImagePosition\n          }\n        }\n      }\n      branchingPaths {\n        choiceKey\n        entityType\n        template {\n          entityId\n          id\n        }\n        module {\n          entityId\n          id\n        }\n        id\n      }\n      ctas {\n        entityId\n        type\n        style\n        text\n        url\n        settings {\n          bgColorField\n          textColorField\n          eventName\n          markComplete\n          implicit\n          opensInNewTab\n        }\n        destinationGuide\n        id\n      }\n      mediaReferences {\n        entityId\n        media {\n          type\n          url\n          meta {\n            __typename\n            ... on ImageMediaMeta {\n              naturalWidth\n              naturalHeight\n            }\n            ... on VideoMediaMeta {\n              videoId\n              videoType\n            }\n          }\n          id\n        }\n        settings {\n          __typename\n          ... on ImageMediaReferenceSettings {\n            alignment\n            fill\n            hyperlink\n            lightboxDisabled\n          }\n          ... on VideoMediaReferenceSettings {\n            alignment\n            playsInline\n          }\n        }\n        id\n      }\n      autoCompleteInteraction {\n        url\n        type\n        wildcardUrl\n        elementSelector\n        elementText\n        elementHtml\n        id\n      }\n      inputs {\n        entityId\n        label\n        type\n        settings {\n          __typename\n          __isInputSettings: __typename\n          ... on TextOrEmailSettings {\n            placeholder\n            required\n            helperText\n            maxValue\n          }\n          ... on NpsSettings {\n            required\n            helperText\n          }\n          ... on NumberPollSettings {\n            required\n            helperText\n            minLabel\n            minValue\n            maxLabel\n            maxValue\n          }\n          ... on DropdownSettings {\n            required\n            multiSelect\n            variation\n            options {\n              label\n              value\n            }\n          }\n        }\n        id\n      }\n      id\n    }\n    targetingData {\n      targetTemplate\n      autoLaunchRules {\n        ruleType\n        rules\n        id\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "3774c9ad641433ff8c5e692f6c1d2289";

export default node;
