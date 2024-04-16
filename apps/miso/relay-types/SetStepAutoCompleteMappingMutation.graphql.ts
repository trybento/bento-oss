/**
 * @generated SignedSource<<b03d2b870fc4a99dbe4bc60825a6f087>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type StepEventMappingRuleRuleType = "eq" | "gt" | "gte" | "lt" | "lte";
export type StepEventMappingRuleValueType = "boolean" | "date" | "number" | "text";
export type SetStepAutoCompleteMappingInput = {
  completeForWholeAccount: boolean;
  eventName: string;
  rules: ReadonlyArray<StepEventMappingRuleInputType>;
  stepPrototypeEntityId: string;
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
export type SetStepAutoCompleteMappingMutation$variables = {
  input: SetStepAutoCompleteMappingInput;
};
export type SetStepAutoCompleteMappingMutation$data = {
  readonly setStepAutoCompleteMapping: {
    readonly organization: {
      readonly name: string;
    } | null;
  } | null;
};
export type SetStepAutoCompleteMappingMutation = {
  response: SetStepAutoCompleteMappingMutation$data;
  variables: SetStepAutoCompleteMappingMutation$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SetStepAutoCompleteMappingMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SetStepAutoCompleteMappingPayload",
        "kind": "LinkedField",
        "name": "setStepAutoCompleteMapping",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          }
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
    "name": "SetStepAutoCompleteMappingMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SetStepAutoCompleteMappingPayload",
        "kind": "LinkedField",
        "name": "setStepAutoCompleteMapping",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5894c2d513bd4b17eea73c68fa635417",
    "id": null,
    "metadata": {},
    "name": "SetStepAutoCompleteMappingMutation",
    "operationKind": "mutation",
    "text": "mutation SetStepAutoCompleteMappingMutation(\n  $input: SetStepAutoCompleteMappingInput!\n) {\n  setStepAutoCompleteMapping(input: $input) {\n    organization {\n      name\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "535a21fadf028e3715ada52216f20faa";

export default node;
