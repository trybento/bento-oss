/**
 * @generated SignedSource<<25f9c8f324638597e6120f74a6ce8b11>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AccountQueryFieldEnum = "externalId" | "name";
export type AccountSelectQuery$variables = {
  filterEntityId?: string | null;
  query?: string | null;
  queryField: AccountQueryFieldEnum;
};
export type AccountSelectQuery$data = {
  readonly entities: ReadonlyArray<{
    readonly entityId: any;
    readonly externalId: string | null;
    readonly name: string;
  }>;
};
export type AccountSelectQuery = {
  response: AccountSelectQuery$data;
  variables: AccountSelectQuery$variables;
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
    "name": "filterAccountUserEntityId",
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
  "name": "name",
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
    "name": "AccountSelectQuery",
    "selections": [
      {
        "alias": "entities",
        "args": (v3/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "searchAccounts",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/)
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
    "name": "AccountSelectQuery",
    "selections": [
      {
        "alias": "entities",
        "args": (v3/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "searchAccounts",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "dc874a1edd0d67c11acf6558a41008dd",
    "id": null,
    "metadata": {},
    "name": "AccountSelectQuery",
    "operationKind": "query",
    "text": "query AccountSelectQuery(\n  $query: String\n  $queryField: AccountQueryFieldEnum!\n  $filterEntityId: String\n) {\n  entities: searchAccounts(query: $query, queryField: $queryField, filterAccountUserEntityId: $filterEntityId) {\n    entityId\n    externalId\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "a9595f29157d6ebc6f1401f28cf28089";

export default node;
