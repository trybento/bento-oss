/**
 * @generated SignedSource<<80d7e988a4b1651c1f8e27377e99d3b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AccountUsersQuery$variables = {
  accountEntityId: any;
};
export type AccountUsersQuery$data = {
  readonly account: {
    readonly accountUsers: ReadonlyArray<{
      readonly __typename: "AccountUser";
      readonly avatarUrl: string | null;
      readonly email: string | null;
      readonly entityId: any;
      readonly externalId: string | null;
      readonly fullName: string | null;
    }>;
  } | null;
};
export type AccountUsersQuery = {
  response: AccountUsersQuery$data;
  variables: AccountUsersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "accountEntityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
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
  "name": "externalId",
  "storageKey": null
},
v8 = {
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
    "name": "AccountUsersQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AccountUser",
            "kind": "LinkedField",
            "name": "accountUsers",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/)
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
    "name": "AccountUsersQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AccountUser",
            "kind": "LinkedField",
            "name": "accountUsers",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a5bcade3be27f80d92169c126546149c",
    "id": null,
    "metadata": {},
    "name": "AccountUsersQuery",
    "operationKind": "query",
    "text": "query AccountUsersQuery(\n  $accountEntityId: EntityId!\n) {\n  account: findAccount(entityId: $accountEntityId) {\n    accountUsers {\n      __typename\n      avatarUrl\n      entityId\n      fullName\n      email\n      externalId\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "89f25c4bf19b86ffc294324a39ab78a4";

export default node;
