/**
 * @generated SignedSource<<b7649bd3c95a82b2b327f4bb6ee6a2ab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CurrentAccountProviderQuery$variables = {
  entityId: any;
};
export type CurrentAccountProviderQuery$data = {
  readonly account: {
    readonly accountUsers: ReadonlyArray<{
      readonly __typename: "AccountUser";
      readonly avatarUrl: string | null;
      readonly email: string | null;
      readonly entityId: any;
      readonly fullName: string | null;
    }>;
    readonly attributes: any;
    readonly entityId: any;
    readonly name: string;
  } | null;
  readonly organization: {
    readonly users: ReadonlyArray<{
      readonly __typename: "User";
      readonly avatarUrl: string | null;
      readonly email: string;
      readonly entityId: any;
      readonly fullName: string | null;
    }>;
  };
};
export type CurrentAccountProviderQuery = {
  response: CurrentAccountProviderQuery$data;
  variables: CurrentAccountProviderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "entityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "entityId"
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
  "name": "attributes",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v9 = [
  (v5/*: any*/),
  (v6/*: any*/),
  (v2/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = [
  (v5/*: any*/),
  (v6/*: any*/),
  (v2/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/),
  (v10/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CurrentAccountProviderQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AccountUser",
            "kind": "LinkedField",
            "name": "accountUsers",
            "plural": true,
            "selections": (v9/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "users",
            "plural": true,
            "selections": (v9/*: any*/),
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
    "name": "CurrentAccountProviderQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AccountUser",
            "kind": "LinkedField",
            "name": "accountUsers",
            "plural": true,
            "selections": (v11/*: any*/),
            "storageKey": null
          },
          (v10/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "users",
            "plural": true,
            "selections": (v11/*: any*/),
            "storageKey": null
          },
          (v10/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "110c2675195e2223ec50560357b72f0a",
    "id": null,
    "metadata": {},
    "name": "CurrentAccountProviderQuery",
    "operationKind": "query",
    "text": "query CurrentAccountProviderQuery(\n  $entityId: EntityId!\n) {\n  account: findAccount(entityId: $entityId) {\n    entityId\n    name\n    attributes\n    accountUsers {\n      __typename\n      avatarUrl\n      entityId\n      fullName\n      email\n      id\n    }\n    id\n  }\n  organization {\n    users {\n      __typename\n      avatarUrl\n      entityId\n      fullName\n      email\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "02a5076e86a3a707a3bd3332246e8430";

export default node;
