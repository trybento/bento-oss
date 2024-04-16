/**
 * @generated SignedSource<<599904b038d265c3d3c4c87726742f30>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type BlockedAccountsQuery$variables = {};
export type BlockedAccountsQuery$data = {
  readonly accounts: ReadonlyArray<{
    readonly blockedAt: any | null;
    readonly blockedBy: {
      readonly email: string;
      readonly fullName: string | null;
    } | null;
    readonly entityId: any;
    readonly externalId: string | null;
    readonly name: string;
  }>;
};
export type BlockedAccountsQuery = {
  response: BlockedAccountsQuery$data;
  variables: BlockedAccountsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "blocked",
    "value": true
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
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
  "name": "externalId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "blockedAt",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "BlockedAccountsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "accounts",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "blockedBy",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": "accounts(blocked:true)"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "BlockedAccountsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "accounts",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "blockedBy",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": "accounts(blocked:true)"
      }
    ]
  },
  "params": {
    "cacheID": "23625ce9d1d0cd505303828b7cb0eae9",
    "id": null,
    "metadata": {},
    "name": "BlockedAccountsQuery",
    "operationKind": "query",
    "text": "query BlockedAccountsQuery {\n  accounts(blocked: true) {\n    name\n    entityId\n    externalId\n    blockedAt\n    blockedBy {\n      fullName\n      email\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "0e2b483c09ba4f32db087ad4fc887f6b";

export default node;
