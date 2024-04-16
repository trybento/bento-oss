/**
 * @generated SignedSource<<73ebf11d7e50259897d958001378b949>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderDirection = "asc" | "desc";
export type CustomerUserAttributesQuery$variables = {
  accountEntityId: any;
  after?: string | null;
  auOrderBy?: string | null;
  auOrderDirection?: OrderDirection | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
};
export type CustomerUserAttributesQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CustomerUserAttributes_participants">;
};
export type CustomerUserAttributesQuery = {
  response: CustomerUserAttributesQuery$data;
  variables: CustomerUserAttributesQuery$variables;
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
  "name": "last"
},
v7 = [
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
    "kind": "Literal",
    "name": "includeInternal",
    "value": true
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
    "name": "CustomerUserAttributesQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "CustomerUserAttributes_participants"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v5/*: any*/),
      (v1/*: any*/),
      (v6/*: any*/),
      (v4/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "CustomerUserAttributesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v7/*: any*/),
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
                        "name": "attributes",
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
          "accountEntityId",
          "orderBy",
          "orderDirection",
          "includeInternal"
        ],
        "handle": "connection",
        "key": "CustomerUserAttributes_accountUserAnalytics",
        "kind": "LinkedHandle",
        "name": "accountUserAnalytics"
      }
    ]
  },
  "params": {
    "cacheID": "4bc4f8b0776f83e6f2fd2fd7db5465f1",
    "id": null,
    "metadata": {},
    "name": "CustomerUserAttributesQuery",
    "operationKind": "query",
    "text": "query CustomerUserAttributesQuery(\n  $accountEntityId: EntityId!\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n  $auOrderBy: String\n  $auOrderDirection: OrderDirection\n) {\n  ...CustomerUserAttributes_participants\n}\n\nfragment CustomerUserAttributes_participants on RootType {\n  accountUserAnalytics(accountEntityId: $accountEntityId, first: $first, after: $after, last: $last, before: $before, orderBy: $auOrderBy, orderDirection: $auOrderDirection, includeInternal: true) {\n    edges {\n      node {\n        accountUser {\n          fullName\n          attributes\n          id\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f4d5f45898fac6efe57f35371ad48657";

export default node;
