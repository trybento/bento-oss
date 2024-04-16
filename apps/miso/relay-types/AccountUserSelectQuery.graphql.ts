/**
 * @generated SignedSource<<8cb15461145067cd29650e813d86fb93>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AccountUserQueryFieldEnum = "email" | "externalId" | "fullName";
export type AccountUserSelectQuery$variables = {
  filterEntityId?: string | null;
  query?: string | null;
  queryField: AccountUserQueryFieldEnum;
};
export type AccountUserSelectQuery$data = {
  readonly entities: ReadonlyArray<{
    readonly account: {
      readonly name: string;
    };
    readonly email: string | null;
    readonly entityId: any;
    readonly externalId: string | null;
    readonly fullName: string | null;
  }>;
};
export type AccountUserSelectQuery = {
  response: AccountUserSelectQuery$data;
  variables: AccountUserSelectQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "filterEntityId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "query"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "queryField"
},
v3 = [
  {
    "kind": "Variable",
    "name": "filterAccountEntityId",
    "variableName": "filterEntityId"
  },
  {
    "kind": "Variable",
    "name": "query",
    "variableName": "query"
  },
  {
    "kind": "Variable",
    "name": "queryField",
    "variableName": "queryField"
  }
],
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
  "name": "externalId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AccountUserSelectQuery",
    "selections": [
      {
        "alias": "entities",
        "args": (v3/*: any*/),
        "concreteType": "AccountUser",
        "kind": "LinkedField",
        "name": "searchAccountUsers",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v8/*: any*/)
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "AccountUserSelectQuery",
    "selections": [
      {
        "alias": "entities",
        "args": (v3/*: any*/),
        "concreteType": "AccountUser",
        "kind": "LinkedField",
        "name": "searchAccountUsers",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v8/*: any*/),
              (v9/*: any*/)
            ],
            "storageKey": null
          },
          (v9/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3705506efc3567e526587ddca139113f",
    "id": null,
    "metadata": {},
    "name": "AccountUserSelectQuery",
    "operationKind": "query",
    "text": "query AccountUserSelectQuery(\n  $query: String\n  $queryField: AccountUserQueryFieldEnum!\n  $filterEntityId: String\n) {\n  entities: searchAccountUsers(query: $query, queryField: $queryField, filterAccountEntityId: $filterEntityId) {\n    entityId\n    externalId\n    fullName\n    email\n    account {\n      name\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2a071f9bae3b59510708d0882d445d9f";

export default node;
