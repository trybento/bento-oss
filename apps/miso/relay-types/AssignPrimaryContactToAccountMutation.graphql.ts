/**
 * @generated SignedSource<<5e23700a73cfaab30bc2155339996751>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AssignPrimaryContactToAccountInput = {
  accountEntityId: any;
  userEntityId: any;
};
export type AssignPrimaryContactToAccountMutation$variables = {
  input: AssignPrimaryContactToAccountInput;
};
export type AssignPrimaryContactToAccountMutation$data = {
  readonly assignPrimaryContactToAccount: {
    readonly account: {
      readonly primaryContact: {
        readonly entityId: any;
        readonly fullName: string | null;
        readonly id: string;
      } | null;
    } | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type AssignPrimaryContactToAccountMutation = {
  response: AssignPrimaryContactToAccountMutation$data;
  variables: AssignPrimaryContactToAccountMutation$variables;
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fullName",
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
    "name": "AssignPrimaryContactToAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AssignPrimaryContactToAccountPayload",
        "kind": "LinkedField",
        "name": "assignPrimaryContactToAccount",
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
    "name": "AssignPrimaryContactToAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AssignPrimaryContactToAccountPayload",
        "kind": "LinkedField",
        "name": "assignPrimaryContactToAccount",
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
    "cacheID": "2348e6554fced71c72734c7bbb4fa63e",
    "id": null,
    "metadata": {},
    "name": "AssignPrimaryContactToAccountMutation",
    "operationKind": "mutation",
    "text": "mutation AssignPrimaryContactToAccountMutation(\n  $input: AssignPrimaryContactToAccountInput!\n) {\n  assignPrimaryContactToAccount(input: $input) {\n    account {\n      primaryContact {\n        id\n        entityId\n        fullName\n      }\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "2be86c288a28bddc643b7b5513b24e09";

export default node;
