/**
 * @generated SignedSource<<b7acaf9e8e8d8155b21615cfd86fd679>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type StepEventMappingRuleRuleType = "eq" | "gt" | "gte" | "lt" | "lte";
export type StepEventMappingRuleValueType = "boolean" | "date" | "number" | "text";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type DuplicateModuleInput = {
  entityId: any;
};
export type DuplicateModuleMutation$variables = {
  input: DuplicateModuleInput;
};
export type DuplicateModuleMutation$data = {
  readonly duplicateModule: {
    readonly errors: ReadonlyArray<string> | null;
    readonly module: {
      readonly description: string | null;
      readonly displayTitle: string | null;
      readonly entityId: any;
      readonly name: string | null;
      readonly stepPrototypes: ReadonlyArray<{
        readonly body: string | null;
        readonly bodySlate: any | null;
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
        readonly name: string;
        readonly stepType: StepTypeEnum;
      }>;
      readonly updatedAt: any | null;
    } | null;
  } | null;
};
export type DuplicateModuleMutation = {
  response: DuplicateModuleMutation$data;
  variables: DuplicateModuleMutation$variables;
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
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
  "name": "entityId",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
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
  "name": "errors",
  "storageKey": null
},
v20 = {
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
    "name": "DuplicateModuleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DuplicateModulePayload",
        "kind": "LinkedField",
        "name": "duplicateModule",
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
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepPrototype",
                "kind": "LinkedField",
                "name": "stepPrototypes",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
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
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v19/*: any*/)
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
    "name": "DuplicateModuleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DuplicateModulePayload",
        "kind": "LinkedField",
        "name": "duplicateModule",
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
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepPrototype",
                "kind": "LinkedField",
                "name": "stepPrototypes",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
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
                          (v20/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v20/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v20/*: any*/)
                ],
                "storageKey": null
              },
              (v20/*: any*/)
            ],
            "storageKey": null
          },
          (v19/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4f4dbc2221a69e19edbba533c500dab0",
    "id": null,
    "metadata": {},
    "name": "DuplicateModuleMutation",
    "operationKind": "mutation",
    "text": "mutation DuplicateModuleMutation(\n  $input: DuplicateModuleInput!\n) {\n  duplicateModule(input: $input) {\n    module {\n      updatedAt\n      name\n      displayTitle\n      description\n      entityId\n      stepPrototypes {\n        name\n        entityId\n        body\n        bodySlate\n        stepType\n        eventMappings {\n          eventName\n          completeForWholeAccount\n          rules {\n            propertyName\n            valueType\n            ruleType\n            numberValue\n            textValue\n            booleanValue\n            dateValue\n            id\n          }\n          id\n        }\n        id\n      }\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "c36e3b2dd706c614a04ab2447c920be4";

export default node;
