/**
 * @generated SignedSource<<5b0df014177b8a8fbd8f13423e37bf03>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AccountsOrderBy = "createdInOrganizationAt" | "csmName" | "guidesCount" | "lastActiveAt" | "name" | "totalUsersWithGuidesCount";
export type OrderDirection = "asc" | "desc";
export type CustomersTableQuery$variables = {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  orderBy?: AccountsOrderBy | null;
  orderDirection?: OrderDirection | null;
  searchQuery?: string | null;
};
export type CustomersTableQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CustomersTable_query">;
};
export type CustomersTableQuery = {
  response: CustomersTableQuery$data;
  variables: CustomersTableQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "orderBy"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "orderDirection"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchQuery"
},
v7 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "before",
    "variableName": "before"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "last",
    "variableName": "last"
  },
  {
    "kind": "Variable",
    "name": "orderBy",
    "variableName": "orderBy"
  },
  {
    "kind": "Variable",
    "name": "orderDirection",
    "variableName": "orderDirection"
  },
  {
    "kind": "Variable",
    "name": "searchQuery",
    "variableName": "searchQuery"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CustomersTableQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "CustomersTable_query"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v6/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Operation",
    "name": "CustomersTableQuery",
    "selections": [
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": "AccountsConnectionConnection",
        "kind": "LinkedField",
        "name": "accountsConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AccountsConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Account",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "name",
                    "storageKey": null
                  },
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
                    "name": "lastActiveAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "createdInOrganizationAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "guideBasesCount",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasPreviousPage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "startCursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v7/*: any*/),
        "filters": [
          "searchQuery",
          "orderBy",
          "orderDirection"
        ],
        "handle": "connection",
        "key": "CustomersTable_accountsConnection",
        "kind": "LinkedHandle",
        "name": "accountsConnection"
      }
    ]
  },
  "params": {
    "cacheID": "8edce492cc7599b0c7414bc752107b07",
    "id": null,
    "metadata": {},
    "name": "CustomersTableQuery",
    "operationKind": "query",
    "text": "query CustomersTableQuery(\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n  $searchQuery: String\n  $orderBy: AccountsOrderBy\n  $orderDirection: OrderDirection\n) {\n  ...CustomersTable_query\n}\n\nfragment CustomersTable_query on RootType {\n  accountsConnection(searchQuery: $searchQuery, first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy, orderDirection: $orderDirection) {\n    edges {\n      node {\n        id\n        name\n        entityId\n        lastActiveAt\n        createdInOrganizationAt\n        guideBasesCount\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8c5ffa74924028b5fb03dd8e3bb9333d";

export default node;
