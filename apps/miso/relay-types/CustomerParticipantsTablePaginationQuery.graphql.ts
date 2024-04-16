/**
 * @generated SignedSource<<e6fa76f857dce6276710a5ccd94f9c13>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderDirection = "asc" | "desc";
export type CustomerParticipantsTablePaginationQuery$variables = {
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
export type CustomerParticipantsTablePaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CustomerParticipantTable_query">;
};
export type CustomerParticipantsTablePaginationQuery = {
  response: CustomerParticipantsTablePaginationQuery$data;
  variables: CustomerParticipantsTablePaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountEntityId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "auOrderBy"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "auOrderDirection"
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
    "name": "includeInternal"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "last"
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CustomerParticipantsTablePaginationQuery",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CustomerParticipantsTablePaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                      (v2/*: any*/),
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
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Guide",
                        "kind": "LinkedField",
                        "name": "guide",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
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
        "args": (v1/*: any*/),
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
    "cacheID": "5ebbe7aef4334d9828b7d7ce338a1b3a",
    "id": null,
    "metadata": {},
    "name": "CustomerParticipantsTablePaginationQuery",
    "operationKind": "query",
    "text": "query CustomerParticipantsTablePaginationQuery(\n  $accountEntityId: EntityId!\n  $after: String\n  $auOrderBy: String\n  $auOrderDirection: OrderDirection\n  $before: String\n  $first: Int\n  $includeInternal: Boolean\n  $last: Int\n  $searchQuery: String\n) {\n  ...CustomerParticipantTable_query\n}\n\nfragment CustomerParticipantTable_query on RootType {\n  accountUserAnalytics(accountEntityId: $accountEntityId, includeInternal: $includeInternal, searchQuery: $searchQuery, first: $first, after: $after, last: $last, before: $before, orderBy: $auOrderBy, orderDirection: $auOrderDirection) {\n    edges {\n      node {\n        accountUser {\n          id\n          fullName\n          createdInOrganizationAt\n          email\n          entityId\n        }\n        currentStep {\n          name\n          guide {\n            name\n            id\n          }\n          id\n        }\n        stepLastSeen\n        stepsViewed\n        lastActiveInApp\n        stepsCompleted\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b890d4ac60969c004d67e6139ea46c6b";

export default node;
