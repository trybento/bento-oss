/**
 * @generated SignedSource<<b6cb97b82475cf31601c067def8217b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GuideBasesOrderBy = "accountName" | "averageStepsCompleted" | "averageStepsViewed" | "ctasClicked" | "lastActiveAt" | "lastCompletedStepAt" | "lastCompletedStepName" | "participantsWhoViewedCount" | "progress" | "state" | "stepsCompleted" | "usersCompletedAStep" | "usersViewedAStep";
export type GuideCompletionPercentageFilterEnum = "all" | "any" | "complete" | "lessThanHalf" | "lessThanOneHundred" | "lessThanOneQuarter" | "lessThanThreeQuarters" | "notStarted";
export type GuideLastActiveWithinFilterEnum = "all" | "lastDay" | "lastMonth" | "lastWeek";
export type OrderDirection = "asc" | "desc";
export type ActiveGuidesTablePaginationQuery$variables = {
  accountNameSearchQuery?: string | null;
  after?: string | null;
  assignedToEntityId?: string | null;
  before?: string | null;
  completionPercentage?: GuideCompletionPercentageFilterEnum | null;
  first?: number | null;
  hasBeenViewed?: boolean | null;
  last?: number | null;
  lastActiveWithin?: GuideLastActiveWithinFilterEnum | null;
  orderBy?: GuideBasesOrderBy | null;
  orderDirection?: OrderDirection | null;
  templateEntityId?: any | null;
};
export type ActiveGuidesTablePaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ActiveGuidesTable_query">;
};
export type ActiveGuidesTablePaginationQuery = {
  response: ActiveGuidesTablePaginationQuery$data;
  variables: ActiveGuidesTablePaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountNameSearchQuery"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "assignedToEntityId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "before"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "completionPercentage"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "first"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "hasBeenViewed"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "last"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "lastActiveWithin"
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
    "name": "accountNameSearchQuery",
    "variableName": "accountNameSearchQuery"
  },
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "assignedToEntityId",
    "variableName": "assignedToEntityId"
  },
  {
    "kind": "Variable",
    "name": "before",
    "variableName": "before"
  },
  {
    "kind": "Variable",
    "name": "completionPercentage",
    "variableName": "completionPercentage"
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
    "name": "hasBeenViewed",
    "variableName": "hasBeenViewed"
  },
  {
    "kind": "Variable",
    "name": "last",
    "variableName": "last"
  },
  {
    "kind": "Variable",
    "name": "lastActiveWithin",
    "variableName": "lastActiveWithin"
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
    "name": "ActiveGuidesTablePaginationQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "ActiveGuidesTable_query"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ActiveGuidesTablePaginationQuery",
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
                    "kind": "ScalarField",
                    "name": "usersClickedCta",
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
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Step",
                    "kind": "LinkedField",
                    "name": "lastCompletedStep",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "completedAt",
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Template",
                    "kind": "LinkedField",
                    "name": "createdFromTemplate",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v2/*: any*/),
                      (v4/*: any*/)
                    ],
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
          "completionPercentage",
          "assignedToEntityId",
          "lastActiveWithin",
          "createdFromTemplateEntityId",
          "accountNameSearchQuery",
          "hasBeenViewed",
          "orderBy",
          "orderDirection"
        ],
        "handle": "connection",
        "key": "ActiveGuidesTable_guideBasesConnection",
        "kind": "LinkedHandle",
        "name": "guideBasesConnection"
      }
    ]
  },
  "params": {
    "cacheID": "3000eb219b38ea92172ce0138a7f5b69",
    "id": null,
    "metadata": {},
    "name": "ActiveGuidesTablePaginationQuery",
    "operationKind": "query",
    "text": "query ActiveGuidesTablePaginationQuery(\n  $accountNameSearchQuery: String\n  $after: String\n  $assignedToEntityId: String\n  $before: String\n  $completionPercentage: GuideCompletionPercentageFilterEnum\n  $first: Int\n  $hasBeenViewed: Boolean\n  $last: Int\n  $lastActiveWithin: GuideLastActiveWithinFilterEnum\n  $orderBy: GuideBasesOrderBy\n  $orderDirection: OrderDirection\n  $templateEntityId: EntityId\n) {\n  ...ActiveGuidesTable_query\n}\n\nfragment ActiveGuidesTable_query on RootType {\n  guideBasesConnection(completionPercentage: $completionPercentage, assignedToEntityId: $assignedToEntityId, lastActiveWithin: $lastActiveWithin, createdFromTemplateEntityId: $templateEntityId, accountNameSearchQuery: $accountNameSearchQuery, hasBeenViewed: $hasBeenViewed, first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy, orderDirection: $orderDirection) {\n    edges {\n      node {\n        averageCompletionPercentage\n        entityId\n        state\n        wasAutoLaunched\n        isModifiedFromTemplate\n        type\n        name\n        isTargetedForSplitTesting\n        usersClickedCta\n        accountGuide {\n          entityId\n          completedStepsCount\n          stepsCount\n          id\n        }\n        account {\n          entityId\n          name\n          id\n        }\n        stepsCompletedCount\n        participantsWhoViewedCount\n        usersCompletedAStepCount\n        lastActiveAt\n        lastCompletedStep {\n          name\n          completedAt\n          id\n        }\n        createdFromTemplate {\n          name\n          entityId\n          id\n        }\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4ce6eedf12ac41b9ea9b27fad1d5f70d";

export default node;
