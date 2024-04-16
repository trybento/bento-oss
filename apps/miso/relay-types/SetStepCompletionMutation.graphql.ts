/**
 * @generated SignedSource<<9bbf2334a9a061a5dfc9a177ec50ec7c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SetStepCompletionInput = {
  isComplete: boolean;
  stepEntityId: any;
};
export type SetStepCompletionMutation$variables = {
  input: SetStepCompletionInput;
};
export type SetStepCompletionMutation$data = {
  readonly setStepCompletion: {
    readonly step: {
      readonly completedAt: any | null;
      readonly completedByAccountUser: {
        readonly entityId: any;
      } | null;
      readonly completedByUser: {
        readonly entityId: any;
      } | null;
      readonly entityId: any;
      readonly id: string;
      readonly isComplete: boolean;
    } | null;
  } | null;
};
export type SetStepCompletionMutation = {
  response: SetStepCompletionMutation$data;
  variables: SetStepCompletionMutation$variables;
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
  "name": "id",
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
  "name": "isComplete",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completedAt",
  "storageKey": null
},
v6 = [
  (v3/*: any*/)
],
v7 = [
  (v3/*: any*/),
  (v2/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SetStepCompletionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SetStepCompletionPayload",
        "kind": "LinkedField",
        "name": "setStepCompletion",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Step",
            "kind": "LinkedField",
            "name": "step",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "completedByUser",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountUser",
                "kind": "LinkedField",
                "name": "completedByAccountUser",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              }
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
    "name": "SetStepCompletionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SetStepCompletionPayload",
        "kind": "LinkedField",
        "name": "setStepCompletion",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Step",
            "kind": "LinkedField",
            "name": "step",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "completedByUser",
                "plural": false,
                "selections": (v7/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountUser",
                "kind": "LinkedField",
                "name": "completedByAccountUser",
                "plural": false,
                "selections": (v7/*: any*/),
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
    "cacheID": "ecdaca0e97f47cdf9dff7df8bb25b1db",
    "id": null,
    "metadata": {},
    "name": "SetStepCompletionMutation",
    "operationKind": "mutation",
    "text": "mutation SetStepCompletionMutation(\n  $input: SetStepCompletionInput!\n) {\n  setStepCompletion(input: $input) {\n    step {\n      id\n      entityId\n      isComplete\n      completedAt\n      completedByUser {\n        entityId\n        id\n      }\n      completedByAccountUser {\n        entityId\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "465ddfb53fa0a8c086f18754de17ad7d";

export default node;
