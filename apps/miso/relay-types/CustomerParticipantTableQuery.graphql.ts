/**
 * @generated SignedSource<<0d5b598b28a5a3c6b4d516ea88ab666c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderDirection = "asc" | "desc";
export type CustomerParticipantTableQuery$variables = {
  accountEntityId: any;
  after?: string | null;
  auOrderBy?: string | null;
  auOrderDirection?: OrderDirection | null;
  before?: string | null;
  first?: number | null;
  includeInternal?: boolean | null;
  last?: number | null;
  searchQuery?: string | null;
};
export type CustomerParticipantTableQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CustomerParticipantTable_query">;
};
export type CustomerParticipantTableQuery = {
  response: CustomerParticipantTableQuery$data;
  variables: CustomerParticipantTableQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "accountEntityId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "auOrderBy"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "auOrderDirection"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeInternal"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchQuery"
},
v9 = [
  {
    "kind": "Variable",
    "name": "accountEntityId",
    "variableName": "accountEntityId"
  },
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
    "name": "includeInternal",
    "variableName": "includeInternal"
  },
  {
    "kind": "Variable",
    "name": "last",
    "variableName": "last"
  },
  {
    "kind": "Variable",
    "name": "orderBy",
    "variableName": "auOrderBy"
  },
  {
    "kind": "Variable",
    "name": "orderDirection",
    "variableName": "auOrderDirection"
  },
  {
    "kind": "Variable",
    "name": "searchQuery",
    "variableName": "searchQuery"
  }
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = {
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
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CustomerParticipantTableQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "CustomerParticipantTable_query"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v6/*: any*/),
      (v5/*: any*/),
      (v1/*: any*/),
      (v8/*: any*/),
      (v7/*: any*/),
      (v4/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "CustomerParticipantTableQuery",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": "AccountUserAnalyticsConnection",
        "kind": "LinkedField",
        "name": "accountUserAnalytics",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AccountUserAnalyticsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountUserAnalytics",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountUser",
                    "kind": "LinkedField",
                    "name": "accountUser",
                    "plural": false,
                    "selections": [
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "fullName",
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
                        "name": "email",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "entityId",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Step",
                    "kind": "LinkedField",
                    "name": "currentStep",
                    "plural": false,
                    "selections": [
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Guide",
                        "kind": "LinkedField",
                        "name": "guide",
                        "plural": false,
                        "selections": [
                          (v11/*: any*/),
                          (v10/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "stepLastSeen",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "stepsViewed",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lastActiveInApp",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "stepsCompleted",
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
        "args": (v9/*: any*/),
        "filters": [
          "accountEntityId",
          "includeInternal",
          "searchQuery",
          "orderBy",
          "orderDirection"
        ],
        "handle": "connection",
        "key": "CustomerParticipants_accountUserAnalytics",
        "kind": "LinkedHandle",
        "name": "accountUserAnalytics"
      }
    ]
  },
  "params": {
    "cacheID": "c2789b65ede5d811c907a50722713454",
    "id": null,
    "metadata": {},
    "name": "CustomerParticipantTableQuery",
    "operationKind": "query",
    "text": "query CustomerParticipantTableQuery(\n  $accountEntityId: EntityId!\n  $includeInternal: Boolean\n  $first: Int\n  $after: String\n  $searchQuery: String\n  $last: Int\n  $before: String\n  $auOrderBy: String\n  $auOrderDirection: OrderDirection\n) {\n  ...CustomerParticipantTable_query\n}\n\nfragment CustomerParticipantTable_query on RootType {\n  accountUserAnalytics(accountEntityId: $accountEntityId, includeInternal: $includeInternal, searchQuery: $searchQuery, first: $first, after: $after, last: $last, before: $before, orderBy: $auOrderBy, orderDirection: $auOrderDirection) {\n    edges {\n      node {\n        accountUser {\n          id\n          fullName\n          createdInOrganizationAt\n          email\n          entityId\n        }\n        currentStep {\n          name\n          guide {\n            name\n            id\n          }\n          id\n        }\n        stepLastSeen\n        stepsViewed\n        lastActiveInApp\n        stepsCompleted\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "22a39d33310d33a0250d49a6fbb41d01";

export default node;
