/**
 * @generated SignedSource<<926cf1900c5f67bef3b501e7fed51bfa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderDirection = "asc" | "desc";
export type StepAnalyticsOrderBy = "daysToComplete" | "percentCompleted" | "seenStep" | "stepName";
export type LegacyPerformanceByStepTablePaginationQuery$variables = {
  after?: string | null;
  before?: string | null;
  endDate: string;
  first?: number | null;
  last?: number | null;
  spOrderBy?: StepAnalyticsOrderBy | null;
  spOrderDirection?: OrderDirection | null;
  startDate: string;
};
export type LegacyPerformanceByStepTablePaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"LegacyPerformanceByStepTable_steps">;
};
export type LegacyPerformanceByStepTablePaginationQuery = {
  response: LegacyPerformanceByStepTablePaginationQuery$data;
  variables: LegacyPerformanceByStepTablePaginationQuery$variables;
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
    "name": "last"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "spOrderBy"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "spOrderDirection"
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
    "variableName": "spOrderBy"
  },
  {
    "kind": "Variable",
    "name": "orderDirection",
    "variableName": "spOrderDirection"
  }
],
v2 = {
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
    "name": "LegacyPerformanceByStepTablePaginationQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "LegacyPerformanceByStepTable_steps"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LegacyPerformanceByStepTablePaginationQuery",
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
            "concreteType": "StepAnalyticsConnection",
            "kind": "LinkedField",
            "name": "steps",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "StepAnalyticsEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepAnalytics",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepPrototype",
                        "kind": "LinkedField",
                        "name": "step",
                        "plural": false,
                        "selections": [
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
                            "name": "isAutoCompletable",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Module",
                            "kind": "LinkedField",
                            "name": "module",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "entityId",
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "percentCompleted",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "daysToComplete",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "seenStep",
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
            "key": "LegacyPerformanceByStepTable_steps",
            "kind": "LinkedHandle",
            "name": "steps"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "cc5d6dc08a2f3cc4a400d852efe5ac1e",
    "id": null,
    "metadata": {},
    "name": "LegacyPerformanceByStepTablePaginationQuery",
    "operationKind": "query",
    "text": "query LegacyPerformanceByStepTablePaginationQuery(\n  $after: String\n  $before: String\n  $endDate: String!\n  $first: Int\n  $last: Int\n  $spOrderBy: StepAnalyticsOrderBy\n  $spOrderDirection: OrderDirection\n  $startDate: String!\n) {\n  ...LegacyPerformanceByStepTable_steps\n}\n\nfragment LegacyPerformanceByStepTable_steps on RootType {\n  analytics(startDate: $startDate, endDate: $endDate) {\n    steps(first: $first, after: $after, last: $last, before: $before, orderBy: $spOrderBy, orderDirection: $spOrderDirection) {\n      edges {\n        node {\n          step {\n            name\n            isAutoCompletable\n            module {\n              entityId\n              id\n            }\n            id\n          }\n          percentCompleted\n          daysToComplete\n          seenStep\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d1a3ed2bbe9c79a70562c4719e15e9cc";

export default node;
