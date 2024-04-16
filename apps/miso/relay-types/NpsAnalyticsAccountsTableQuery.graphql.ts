/**
 * @generated SignedSource<<88ec2cc591efcf2055d3062f29d631a0>>
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
export type NpsAnalyticsAccountsTableQuery$variables = {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  npsSurveyEntityId: any;
  orderBy?: NpsSurveyAccountsOrderBy | null;
  orderDirection?: OrderDirection | null;
};
export type NpsAnalyticsAccountsTableQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"NpsAnalyticsAccountsTable_query">;
};
export type NpsAnalyticsAccountsTableQuery = {
  response: NpsAnalyticsAccountsTableQuery$data;
  variables: NpsAnalyticsAccountsTableQuery$variables;
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
  "name": "npsSurveyEntityId"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "orderBy"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "orderDirection"
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
    "name": "NpsAnalyticsAccountsTableQuery",
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
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Operation",
    "name": "NpsAnalyticsAccountsTableQuery",
    "selections": [
      {
        "alias": null,
        "args": (v7/*: any*/),
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
        "args": (v7/*: any*/),
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
    "cacheID": "6180b285b22cda9c626f6c7b920095a9",
    "id": null,
    "metadata": {},
    "name": "NpsAnalyticsAccountsTableQuery",
    "operationKind": "query",
    "text": "query NpsAnalyticsAccountsTableQuery(\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n  $orderBy: NpsSurveyAccountsOrderBy\n  $orderDirection: OrderDirection\n  $npsSurveyEntityId: EntityId!\n) {\n  ...NpsAnalyticsAccountsTable_query\n}\n\nfragment NpsAnalyticsAccountsTable_query on RootType {\n  npsSurveyAccountsConnection(first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy, orderDirection: $orderDirection, npsSurveyEntityId: $npsSurveyEntityId) {\n    edges {\n      node {\n        accountEntityId\n        accountName\n        responses\n        score\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4f79cf6565ed30c930fcd21ba024ff33";

export default node;
