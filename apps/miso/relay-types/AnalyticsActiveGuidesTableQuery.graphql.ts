/**
 * @generated SignedSource<<ba6ced790d365f9ceb2e127ca99b8265>>
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
export type AnalyticsActiveGuidesTableQuery$variables = {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  orderBy?: GuideBasesOrderBy | null;
  orderDirection?: OrderDirection | null;
  templateEntityId?: any | null;
};
export type AnalyticsActiveGuidesTableQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AnalyticsActiveGuidesTable_query">;
};
export type AnalyticsActiveGuidesTableQuery = {
  response: AnalyticsActiveGuidesTableQuery$data;
  variables: AnalyticsActiveGuidesTableQuery$variables;
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
  "name": "templateEntityId"
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
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v10 = {
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
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AnalyticsActiveGuidesTableQuery",
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
    "name": "AnalyticsActiveGuidesTableQuery",
    "selections": [
      {
        "alias": null,
        "args": (v7/*: any*/),
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
                  (v8/*: any*/),
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
                  (v9/*: any*/),
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
                      (v8/*: any*/),
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
                      (v10/*: any*/)
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
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/)
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
                  (v10/*: any*/),
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
    "cacheID": "0c79e6dcdba4e9793b202588f7bb33ff",
    "id": null,
    "metadata": {},
    "name": "AnalyticsActiveGuidesTableQuery",
    "operationKind": "query",
    "text": "query AnalyticsActiveGuidesTableQuery(\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n  $templateEntityId: EntityId\n  $orderBy: GuideBasesOrderBy\n  $orderDirection: OrderDirection\n) {\n  ...AnalyticsActiveGuidesTable_query\n}\n\nfragment AnalyticsActiveGuidesTable_query on RootType {\n  guideBasesConnection(createdFromTemplateEntityId: $templateEntityId, first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy, orderDirection: $orderDirection) {\n    edges {\n      node {\n        averageCompletionPercentage\n        entityId\n        state\n        wasAutoLaunched\n        isModifiedFromTemplate\n        type\n        name\n        isTargetedForSplitTesting\n        accountGuide {\n          entityId\n          completedStepsCount\n          stepsCount\n          id\n        }\n        account {\n          entityId\n          name\n          id\n        }\n        stepsCompletedCount\n        participantsWhoViewedCount\n        usersCompletedAStepCount\n        lastActiveAt\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "667840de73baecd3e4b1826cde32f2a6";

export default node;
