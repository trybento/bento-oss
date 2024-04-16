/**
 * @generated SignedSource<<62de892f6d4b49d8dd0a42bd04462552>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UnarchiveAccountInput = {
  accountEntityId: any;
};
export type UnarchiveAccountMutation$variables = {
  input: UnarchiveAccountInput;
};
export type UnarchiveAccountMutation$data = {
  readonly unarchiveAccount: {
    readonly account: {
      readonly entityId: any;
      readonly name: string;
    } | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type UnarchiveAccountMutation = {
  response: UnarchiveAccountMutation$data;
  variables: UnarchiveAccountMutation$variables;
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
  "name": "errors",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UnarchiveAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UnarchiveAccountPayload",
        "kind": "LinkedField",
        "name": "unarchiveAccount",
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
              (v2/*: any*/),
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
    "name": "UnarchiveAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UnarchiveAccountPayload",
        "kind": "LinkedField",
        "name": "unarchiveAccount",
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
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
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
    "cacheID": "f6814ef8f9c543ab207dba698754aeba",
    "id": null,
    "metadata": {},
    "name": "UnarchiveAccountMutation",
    "operationKind": "mutation",
    "text": "mutation UnarchiveAccountMutation(\n  $input: UnarchiveAccountInput!\n) {\n  unarchiveAccount(input: $input) {\n    account {\n      entityId\n      name\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "79be1d26bec47af2ecdc42e15c30498d";

export default node;
