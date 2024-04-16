/**
 * @generated SignedSource<<c2e9220c8a34c80abb273d543027e764>>
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
export type CustomersTablePaginationQuery$variables = {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  orderBy?: AccountsOrderBy | null;
  orderDirection?: OrderDirection | null;
  searchQuery?: string | null;
};
export type CustomersTablePaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CustomersTable_query">;
};
export type CustomersTablePaginationQuery = {
  response: CustomersTablePaginationQuery$data;
  variables: CustomersTablePaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "before"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "first"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "last"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "orderBy"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "orderDirection"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "searchQuery"
  }
],
v1 = [
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CustomersTablePaginationQuery",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CustomersTablePaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
        "args": (v1/*: any*/),
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
    "cacheID": "adb2edb1b6d80be26c51f32daf658bac",
    "id": null,
    "metadata": {},
    "name": "CustomersTablePaginationQuery",
    "operationKind": "query",
    "text": "query CustomersTablePaginationQuery(\n  $after: String\n  $before: String\n  $first: Int\n  $last: Int\n  $orderBy: AccountsOrderBy\n  $orderDirection: OrderDirection\n  $searchQuery: String\n) {\n  ...CustomersTable_query\n}\n\nfragment CustomersTable_query on RootType {\n  accountsConnection(searchQuery: $searchQuery, first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy, orderDirection: $orderDirection) {\n    edges {\n      node {\n        id\n        name\n        entityId\n        lastActiveAt\n        createdInOrganizationAt\n        guideBasesCount\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fbd9cb836b8eb58a24958ef2af70f48b";

export default node;
