/**
 * @generated SignedSource<<000d3143c4bab7327ec74755d0ef6df5>>
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
export type StepAutoCompleteInteractionTypeEnumType = "click";
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepEventMappingRuleRuleType = "eq" | "gt" | "gte" | "lt" | "lte";
export type StepEventMappingRuleValueType = "boolean" | "date" | "number" | "text";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type AllModulesQuery$variables = {};
export type AllModulesQuery$data = {
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
    readonly templates: ReadonlyArray<{
      readonly entityId: any;
    }>;
  }>;
};
export type AllModulesQuery = {
  response: AllModulesQuery$data;
  variables: AllModulesQuery$variables;
};

const node: ConcreteRequest = (function(){
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
  "name": "displayTitle",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v4 = [
  (v3/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manualCompletionDisabled",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "eventName",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completeForWholeAccount",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propertyName",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueType",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ruleType",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "numberValue",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textValue",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "booleanValue",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dateValue",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingQuestion",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingMultiple",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingDismissDisabled",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingFormFactor",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingKey",
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
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "templateEntityId",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "moduleEntityId",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "style",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v33 = {
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
    (v9/*: any*/),
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
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "destinationGuide",
  "storageKey": null
},
v35 = {
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
v36 = {
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
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v38 = {
  "kind": "InlineFragment",
  "selections": [
    (v37/*: any*/),
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
v39 = {
  "kind": "InlineFragment",
  "selections": [
    (v37/*: any*/),
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
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "required",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "helperText",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxValue",
  "storageKey": null
},
v43 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "placeholder",
      "storageKey": null
    },
    (v40/*: any*/),
    (v41/*: any*/),
    (v42/*: any*/)
  ],
  "type": "TextOrEmailSettings",
  "abstractKey": null
},
v44 = {
  "kind": "InlineFragment",
  "selections": [
    (v40/*: any*/),
    (v41/*: any*/)
  ],
  "type": "NpsSettings",
  "abstractKey": null
},
v45 = {
  "kind": "InlineFragment",
  "selections": [
    (v40/*: any*/),
    (v41/*: any*/),
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
    (v42/*: any*/)
  ],
  "type": "NumberPollSettings",
  "abstractKey": null
},
v46 = {
  "kind": "InlineFragment",
  "selections": [
    (v40/*: any*/),
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
        (v23/*: any*/),
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
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementText",
  "storageKey": null
},
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementHtml",
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v52 = [
  (v3/*: any*/),
  (v51/*: any*/)
],
v53 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AllModulesQuery",
    "selections": [
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
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": (v4/*: any*/),
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
              (v3/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepEventMapping",
                "kind": "LinkedField",
                "name": "eventMappings",
                "plural": true,
                "selections": [
                  (v9/*: any*/),
                  (v10/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepEventMappingRule",
                    "kind": "LinkedField",
                    "name": "rules",
                    "plural": true,
                    "selections": [
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v18/*: any*/),
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
                  (v27/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Template",
                    "kind": "LinkedField",
                    "name": "template",
                    "plural": false,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  },
                  (v28/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Module",
                    "kind": "LinkedField",
                    "name": "module",
                    "plural": false,
                    "selections": (v4/*: any*/),
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
                  (v29/*: any*/),
                  (v30/*: any*/),
                  (v31/*: any*/),
                  (v32/*: any*/),
                  (v33/*: any*/),
                  (v34/*: any*/)
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
                      (v29/*: any*/),
                      (v32/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "meta",
                        "plural": false,
                        "selections": [
                          (v35/*: any*/),
                          (v36/*: any*/)
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
                      (v38/*: any*/),
                      (v39/*: any*/)
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
                  (v3/*: any*/),
                  (v23/*: any*/),
                  (v29/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "settings",
                    "plural": false,
                    "selections": [
                      (v43/*: any*/),
                      (v44/*: any*/),
                      (v45/*: any*/),
                      (v46/*: any*/)
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
                  (v32/*: any*/),
                  (v29/*: any*/),
                  (v47/*: any*/),
                  (v48/*: any*/),
                  (v49/*: any*/),
                  (v50/*: any*/)
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AllModulesQuery",
    "selections": [
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
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": (v52/*: any*/),
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
              (v3/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepEventMapping",
                "kind": "LinkedField",
                "name": "eventMappings",
                "plural": true,
                "selections": [
                  (v9/*: any*/),
                  (v10/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepEventMappingRule",
                    "kind": "LinkedField",
                    "name": "rules",
                    "plural": true,
                    "selections": [
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v51/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v51/*: any*/)
                ],
                "storageKey": null
              },
              (v18/*: any*/),
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
                      (v53/*: any*/),
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
                  (v27/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Template",
                    "kind": "LinkedField",
                    "name": "template",
                    "plural": false,
                    "selections": (v52/*: any*/),
                    "storageKey": null
                  },
                  (v28/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Module",
                    "kind": "LinkedField",
                    "name": "module",
                    "plural": false,
                    "selections": (v52/*: any*/),
                    "storageKey": null
                  },
                  (v51/*: any*/)
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
                  (v29/*: any*/),
                  (v30/*: any*/),
                  (v31/*: any*/),
                  (v32/*: any*/),
                  (v33/*: any*/),
                  (v34/*: any*/),
                  (v51/*: any*/)
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
                      (v29/*: any*/),
                      (v32/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "meta",
                        "plural": false,
                        "selections": [
                          (v53/*: any*/),
                          (v35/*: any*/),
                          (v36/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v51/*: any*/)
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
                      (v53/*: any*/),
                      (v38/*: any*/),
                      (v39/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v51/*: any*/)
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
                  (v23/*: any*/),
                  (v29/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "settings",
                    "plural": false,
                    "selections": [
                      (v53/*: any*/),
                      {
                        "kind": "TypeDiscriminator",
                        "abstractKey": "__isInputSettings"
                      },
                      (v43/*: any*/),
                      (v44/*: any*/),
                      (v45/*: any*/),
                      (v46/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v51/*: any*/)
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
                  (v32/*: any*/),
                  (v29/*: any*/),
                  (v47/*: any*/),
                  (v48/*: any*/),
                  (v49/*: any*/),
                  (v50/*: any*/),
                  (v51/*: any*/)
                ],
                "storageKey": null
              },
              (v51/*: any*/)
            ],
            "storageKey": null
          },
          (v51/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "207dc67fa6ebd94f19a27d3f05ef07d7",
    "id": null,
    "metadata": {},
    "name": "AllModulesQuery",
    "operationKind": "query",
    "text": "query AllModulesQuery {\n  modules {\n    name\n    displayTitle\n    description\n    entityId\n    templates {\n      entityId\n      id\n    }\n    stepPrototypes {\n      name\n      entityId\n      body\n      bodySlate\n      stepType\n      manualCompletionDisabled\n      eventMappings {\n        eventName\n        completeForWholeAccount\n        rules {\n          propertyName\n          valueType\n          ruleType\n          numberValue\n          textValue\n          booleanValue\n          dateValue\n          id\n        }\n        id\n      }\n      branchingQuestion\n      branchingMultiple\n      branchingDismissDisabled\n      branchingFormFactor\n      branchingKey\n      branchingChoices {\n        label\n        choiceKey\n        style {\n          __typename\n          __isBranchingStyle: __typename\n          ... on BranchingCardStyle {\n            backgroundImageUrl\n            backgroundImagePosition\n          }\n        }\n      }\n      branchingPaths {\n        choiceKey\n        entityType\n        templateEntityId\n        template {\n          entityId\n          id\n        }\n        moduleEntityId\n        module {\n          entityId\n          id\n        }\n        id\n      }\n      ctas {\n        entityId\n        type\n        style\n        text\n        url\n        settings {\n          bgColorField\n          textColorField\n          eventName\n          markComplete\n          implicit\n          opensInNewTab\n        }\n        destinationGuide\n        id\n      }\n      mediaReferences {\n        entityId\n        media {\n          type\n          url\n          meta {\n            __typename\n            ... on ImageMediaMeta {\n              naturalWidth\n              naturalHeight\n            }\n            ... on VideoMediaMeta {\n              videoId\n              videoType\n            }\n          }\n          id\n        }\n        settings {\n          __typename\n          ... on ImageMediaReferenceSettings {\n            alignment\n            fill\n            hyperlink\n            lightboxDisabled\n          }\n          ... on VideoMediaReferenceSettings {\n            alignment\n            playsInline\n          }\n        }\n        id\n      }\n      inputs {\n        entityId\n        label\n        type\n        settings {\n          __typename\n          __isInputSettings: __typename\n          ... on TextOrEmailSettings {\n            placeholder\n            required\n            helperText\n            maxValue\n          }\n          ... on NpsSettings {\n            required\n            helperText\n          }\n          ... on NumberPollSettings {\n            required\n            helperText\n            minLabel\n            minValue\n            maxLabel\n            maxValue\n          }\n          ... on DropdownSettings {\n            required\n            multiSelect\n            variation\n            options {\n              label\n              value\n            }\n          }\n        }\n        id\n      }\n      autoCompleteInteraction {\n        url\n        type\n        wildcardUrl\n        elementSelector\n        elementText\n        elementHtml\n        id\n      }\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "46b7440d6af89084e0ae9e8975100812";

export default node;
