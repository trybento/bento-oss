/**
 * @generated SignedSource<<2f2282466b31d5e9b9696c1130b8590a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UnassignPrimaryContactFromAccountInput = {
  accountEntityId: any;
};
export type UnassignPrimaryContactFromAccountMutation$variables = {
  input: UnassignPrimaryContactFromAccountInput;
};
export type UnassignPrimaryContactFromAccountMutation$data = {
  readonly unassignPrimaryContactFromAccount: {
    readonly account: {
      readonly primaryContact: {
        readonly entityId: any;
        readonly id: string;
      } | null;
    } | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type UnassignPrimaryContactFromAccountMutation = {
  response: UnassignPrimaryContactFromAccountMutation$data;
  variables: UnassignPrimaryContactFromAccountMutation$variables;
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
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "primaryContact",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "entityId",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "errors",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UnassignPrimaryContactFromAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UnassignPrimaryContactFromAccountPayload",
        "kind": "LinkedField",
        "name": "unassignPrimaryContactFromAccount",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
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
    "name": "UnassignPrimaryContactFromAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UnassignPrimaryContactFromAccountPayload",
        "kind": "LinkedField",
        "name": "unassignPrimaryContactFromAccount",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "afab956c1781ca514340e9ee2496028f",
    "id": null,
    "metadata": {},
    "name": "UnassignPrimaryContactFromAccountMutation",
    "operationKind": "mutation",
    "text": "mutation UnassignPrimaryContactFromAccountMutation(\n  $input: UnassignPrimaryContactFromAccountInput!\n) {\n  unassignPrimaryContactFromAccount(input: $input) {\n    account {\n      primaryContact {\n        id\n        entityId\n      }\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "18e118ce37198cee770ca2f441b2078c";

export default node;
