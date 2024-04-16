/**
 * @generated SignedSource<<4d90b9c164b4ff9d1b2916b3cd357cf3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GuidesAnalyticsOrderBy = "completedAStep" | "templateName" | "totalStepsCompleted" | "usersSeenGuide";
export type OrderDirection = "asc" | "desc";
export type LegacyPerformanceByGuideTablePaginationQuery$variables = {
  after?: string | null;
  before?: string | null;
  endDate: string;
  first?: number | null;
  gpOrderBy?: GuidesAnalyticsOrderBy | null;
  gpOrderDirection?: OrderDirection | null;
  last?: number | null;
  startDate: string;
};
export type LegacyPerformanceByGuideTablePaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"LegacyPerformanceByGuideTable_guides">;
};
export type LegacyPerformanceByGuideTablePaginationQuery = {
  response: LegacyPerformanceByGuideTablePaginationQuery$data;
  variables: LegacyPerformanceByGuideTablePaginationQuery$variables;
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
    "name": "endDate"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "first"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "gpOrderBy"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "gpOrderDirection"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "last"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "startDate"
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
    "variableName": "gpOrderBy"
  },
  {
    "kind": "Variable",
    "name": "orderDirection",
    "variableName": "gpOrderDirection"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LegacyPerformanceByGuideTablePaginationQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "LegacyPerformanceByGuideTable_guides"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LegacyPerformanceByGuideTablePaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "endDate",
            "variableName": "endDate"
          },
          {
            "kind": "Variable",
            "name": "startDate",
            "variableName": "startDate"
          }
        ],
        "concreteType": "Analytics",
        "kind": "LinkedField",
        "name": "analytics",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "GuidesAnalyticsConnection",
            "kind": "LinkedField",
            "name": "guides",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "GuidesAnalyticsEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuidesAnalytics",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Template",
                        "kind": "LinkedField",
                        "name": "template",
                        "plural": false,
                        "selections": [
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
                            "name": "name",
                            "storageKey": null
                          },
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
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "usersSeenGuide",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "completedAStep",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "totalStepsCompleted",
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
              "orderDirection"
            ],
            "handle": "connection",
            "key": "LegacyPerformanceByGuideTable_guides",
            "kind": "LinkedHandle",
            "name": "guides"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e732be53f1f9ffe7dd630de70b68a99b",
    "id": null,
    "metadata": {},
    "name": "LegacyPerformanceByGuideTablePaginationQuery",
    "operationKind": "query",
    "text": "query LegacyPerformanceByGuideTablePaginationQuery(\n  $after: String\n  $before: String\n  $endDate: String!\n  $first: Int\n  $gpOrderBy: GuidesAnalyticsOrderBy\n  $gpOrderDirection: OrderDirection\n  $last: Int\n  $startDate: String!\n) {\n  ...LegacyPerformanceByGuideTable_guides\n}\n\nfragment LegacyPerformanceByGuideTable_guides on RootType {\n  analytics(startDate: $startDate, endDate: $endDate) {\n    guides(first: $first, after: $after, last: $last, before: $before, orderBy: $gpOrderBy, orderDirection: $gpOrderDirection) {\n      edges {\n        node {\n          template {\n            entityId\n            name\n            id\n          }\n          usersSeenGuide\n          completedAStep\n          totalStepsCompleted\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a5da656cc79c72cc8db06bd290433774";

export default node;
