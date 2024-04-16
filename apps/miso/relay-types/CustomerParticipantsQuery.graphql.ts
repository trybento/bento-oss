/**
 * @generated SignedSource<<4acdab51b199db9bb1b2973d66549f28>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderDirection = "asc" | "desc";
export type CustomerParticipantsQuery$variables = {
  accountEntityId: any;
  after?: string | null;
  auOrderBy?: string | null;
  auOrderDirection?: OrderDirection | null;
  before?: string | null;
  first?: number | null;
  includeInternal?: boolean | null;
  last?: number | null;
};
export type CustomerParticipantsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CustomerParticipants_query">;
};
export type CustomerParticipantsQuery = {
  response: CustomerParticipantsQuery$data;
  variables: CustomerParticipantsQuery$variables;
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
v8 = [
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
  }
],
v9 = {
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
      (v6/*: any*/),
      (v7/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CustomerParticipantsQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "CustomerParticipants_query"
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
      (v7/*: any*/),
      (v4/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "CustomerParticipantsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v8/*: any*/),
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
                      (v9/*: any*/),
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
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      (v9/*: any*/)
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
        "args": (v8/*: any*/),
        "filters": [
          "accountEntityId",
          "includeInternal",
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
    "cacheID": "3971dee7a442d3167848889a92bc5dca",
    "id": null,
    "metadata": {},
    "name": "CustomerParticipantsQuery",
    "operationKind": "query",
    "text": "query CustomerParticipantsQuery(\n  $accountEntityId: EntityId!\n  $includeInternal: Boolean\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n  $auOrderBy: String\n  $auOrderDirection: OrderDirection\n) {\n  ...CustomerParticipants_query\n}\n\nfragment CustomerParticipants_query on RootType {\n  accountUserAnalytics(accountEntityId: $accountEntityId, includeInternal: $includeInternal, first: $first, after: $after, last: $last, before: $before, orderBy: $auOrderBy, orderDirection: $auOrderDirection) {\n    edges {\n      node {\n        accountUser {\n          id\n          fullName\n          createdInOrganizationAt\n          email\n        }\n        currentStep {\n          name\n          id\n        }\n        stepLastSeen\n        stepsViewed\n        lastActiveInApp\n        stepsCompleted\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "456a4e8ff502e363c1f53384d5ac2e32";

export default node;
