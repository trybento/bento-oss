/**
 * @generated SignedSource<<300a370308f30619e2d8a05d61490f28>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NpsSurveyAccountsOrderBy = "accountName" | "responses" | "score";
export type OrderDirection = "asc" | "desc";
export type NpsAnalyticsAccountsTablePaginationQuery$variables = {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  npsSurveyEntityId: any;
  orderBy?: NpsSurveyAccountsOrderBy | null;
  orderDirection?: OrderDirection | null;
};
export type NpsAnalyticsAccountsTablePaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"NpsAnalyticsAccountsTable_query">;
};
export type NpsAnalyticsAccountsTablePaginationQuery = {
  response: NpsAnalyticsAccountsTablePaginationQuery$data;
  variables: NpsAnalyticsAccountsTablePaginationQuery$variables;
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
    "name": "npsSurveyEntityId"
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
    "name": "npsSurveyEntityId",
    "variableName": "npsSurveyEntityId"
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NpsAnalyticsAccountsTablePaginationQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "NpsAnalyticsAccountsTable_query"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NpsAnalyticsAccountsTablePaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NpsSurveyAccountsConnectionConnection",
        "kind": "LinkedField",
        "name": "npsSurveyAccountsConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "NpsSurveyAccountsConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "NpsSurveyAccount",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "accountEntityId",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "accountName",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "responses",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "score",
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
          "orderBy",
          "orderDirection",
          "npsSurveyEntityId"
        ],
        "handle": "connection",
        "key": "NpsAnalyticsAccountsTable_npsSurveyAccountsConnection",
        "kind": "LinkedHandle",
        "name": "npsSurveyAccountsConnection"
      }
    ]
  },
  "params": {
    "cacheID": "1eb9e446a9b96011520e67495815144d",
    "id": null,
    "metadata": {},
    "name": "NpsAnalyticsAccountsTablePaginationQuery",
    "operationKind": "query",
    "text": "query NpsAnalyticsAccountsTablePaginationQuery(\n  $after: String\n  $before: String\n  $first: Int\n  $last: Int\n  $npsSurveyEntityId: EntityId!\n  $orderBy: NpsSurveyAccountsOrderBy\n  $orderDirection: OrderDirection\n) {\n  ...NpsAnalyticsAccountsTable_query\n}\n\nfragment NpsAnalyticsAccountsTable_query on RootType {\n  npsSurveyAccountsConnection(first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy, orderDirection: $orderDirection, npsSurveyEntityId: $npsSurveyEntityId) {\n    edges {\n      node {\n        accountEntityId\n        accountName\n        responses\n        score\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "34bfa19b288f99703b9730ba0f10332e";

export default node;
