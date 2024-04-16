/**
 * @generated SignedSource<<db326069c0287a673df2637be07fab7c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GuideBasesOrderBy = "accountName" | "averageStepsCompleted" | "averageStepsViewed" | "ctasClicked" | "lastActiveAt" | "lastCompletedStepAt" | "lastCompletedStepName" | "participantsWhoViewedCount" | "progress" | "state" | "stepsCompleted" | "usersCompletedAStep" | "usersViewedAStep";
export type OrderDirection = "asc" | "desc";
export type AnalyticsActiveGuidesTablePaginationQuery$variables = {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  orderBy?: GuideBasesOrderBy | null;
  orderDirection?: OrderDirection | null;
  templateEntityId?: any | null;
};
export type AnalyticsActiveGuidesTablePaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AnalyticsActiveGuidesTable_query">;
};
export type AnalyticsActiveGuidesTablePaginationQuery = {
  response: AnalyticsActiveGuidesTablePaginationQuery$data;
  variables: AnalyticsActiveGuidesTablePaginationQuery$variables;
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
    "name": "templateEntityId"
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
    "name": "createdFromTemplateEntityId",
    "variableName": "templateEntityId"
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
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AnalyticsActiveGuidesTablePaginationQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "AnalyticsActiveGuidesTable_query"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AnalyticsActiveGuidesTablePaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "GuideBasesConnectionConnection",
        "kind": "LinkedField",
        "name": "guideBasesConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBasesConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideBase",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "averageCompletionPercentage",
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "state",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "wasAutoLaunched",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isModifiedFromTemplate",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "type",
                    "storageKey": null
                  },
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isTargetedForSplitTesting",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Guide",
                    "kind": "LinkedField",
                    "name": "accountGuide",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "completedStepsCount",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "stepsCount",
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "account",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "stepsCompletedCount",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "participantsWhoViewedCount",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "usersCompletedAStepCount",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lastActiveAt",
                    "storageKey": null
                  },
                  (v4/*: any*/),
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
          "createdFromTemplateEntityId",
          "orderBy",
          "orderDirection"
        ],
        "handle": "connection",
        "key": "AnalyticsActiveGuidesTable_guideBasesConnection",
        "kind": "LinkedHandle",
        "name": "guideBasesConnection"
      }
    ]
  },
  "params": {
    "cacheID": "4b2af2c7e614e51efd3ba4e7d829a8df",
    "id": null,
    "metadata": {},
    "name": "AnalyticsActiveGuidesTablePaginationQuery",
    "operationKind": "query",
    "text": "query AnalyticsActiveGuidesTablePaginationQuery(\n  $after: String\n  $before: String\n  $first: Int\n  $last: Int\n  $orderBy: GuideBasesOrderBy\n  $orderDirection: OrderDirection\n  $templateEntityId: EntityId\n) {\n  ...AnalyticsActiveGuidesTable_query\n}\n\nfragment AnalyticsActiveGuidesTable_query on RootType {\n  guideBasesConnection(createdFromTemplateEntityId: $templateEntityId, first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy, orderDirection: $orderDirection) {\n    edges {\n      node {\n        averageCompletionPercentage\n        entityId\n        state\n        wasAutoLaunched\n        isModifiedFromTemplate\n        type\n        name\n        isTargetedForSplitTesting\n        accountGuide {\n          entityId\n          completedStepsCount\n          stepsCount\n          id\n        }\n        account {\n          entityId\n          name\n          id\n        }\n        stepsCompletedCount\n        participantsWhoViewedCount\n        usersCompletedAStepCount\n        lastActiveAt\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e19693470f751b087364689b5be73eb2";

export default node;
