/**
 * @generated SignedSource<<80013dce511fcf2c514404e6541625a7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderDirection = "asc" | "desc";
export type CustomerParticipantsPaginationQuery$variables = {
  accountEntityId: any;
  after?: string | null;
  auOrderBy?: string | null;
  auOrderDirection?: OrderDirection | null;
  before?: string | null;
  first?: number | null;
  includeInternal?: boolean | null;
  last?: number | null;
};
export type CustomerParticipantsPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CustomerParticipants_query">;
};
export type CustomerParticipantsPaginationQuery = {
  response: CustomerParticipantsPaginationQuery$data;
  variables: CustomerParticipantsPaginationQuery$variables;
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
    "name": "CustomerParticipantsPaginationQuery",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CustomerParticipantsPaginationQuery",
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
    "cacheID": "d03acca289cafb78210f26d9ef8bf79f",
    "id": null,
    "metadata": {},
    "name": "CustomerParticipantsPaginationQuery",
    "operationKind": "query",
    "text": "query CustomerParticipantsPaginationQuery(\n  $accountEntityId: EntityId!\n  $after: String\n  $auOrderBy: String\n  $auOrderDirection: OrderDirection\n  $before: String\n  $first: Int\n  $includeInternal: Boolean\n  $last: Int\n) {\n  ...CustomerParticipants_query\n}\n\nfragment CustomerParticipants_query on RootType {\n  accountUserAnalytics(accountEntityId: $accountEntityId, includeInternal: $includeInternal, first: $first, after: $after, last: $last, before: $before, orderBy: $auOrderBy, orderDirection: $auOrderDirection) {\n    edges {\n      node {\n        accountUser {\n          id\n          fullName\n          createdInOrganizationAt\n          email\n        }\n        currentStep {\n          name\n          id\n        }\n        stepLastSeen\n        stepsViewed\n        lastActiveInApp\n        stepsCompleted\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3c66302c725bf8097c943834bdcf9193";

export default node;
