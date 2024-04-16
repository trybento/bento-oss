/**
 * @generated SignedSource<<d08ae2b3e4d5188d7376d24e64593380>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CustomerUserAttributes_participants$data = {
  readonly accountUserAnalytics: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly accountUser: {
          readonly attributes: any;
          readonly fullName: string | null;
        };
      } | null;
    } | null> | null;
  } | null;
  readonly " $fragmentType": "CustomerUserAttributes_participants";
};
export type CustomerUserAttributes_participants$key = {
  readonly " $data"?: CustomerUserAttributes_participants$data;
  readonly " $fragmentSpreads": FragmentRefs<"CustomerUserAttributes_participants">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "accountUserAnalytics"
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "accountEntityId"
    },
    {
      "kind": "RootArgument",
      "name": "after"
    },
    {
      "kind": "RootArgument",
      "name": "auOrderBy"
    },
    {
      "kind": "RootArgument",
      "name": "auOrderDirection"
    },
    {
      "kind": "RootArgument",
      "name": "before"
    },
    {
      "kind": "RootArgument",
      "name": "first"
    },
    {
      "kind": "RootArgument",
      "name": "last"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "bidirectional",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "after"
        },
        "backward": {
          "count": "last",
          "cursor": "before"
        },
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": require('./CustomerUserAttributesPaginationQuery.graphql')
    }
  },
  "name": "CustomerUserAttributes_participants",
  "selections": [
    {
      "alias": "accountUserAnalytics",
      "args": [
        {
          "kind": "Variable",
          "name": "accountEntityId",
          "variableName": "accountEntityId"
        },
        {
          "kind": "Literal",
          "name": "includeInternal",
          "value": true
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
      "concreteType": "AccountUserAnalyticsConnection",
      "kind": "LinkedField",
      "name": "__CustomerUserAttributes_accountUserAnalytics_connection",
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
    }
  ],
  "type": "RootType",
  "abstractKey": null
};
})();

(node as any).hash = "063331607fc598c55497f23b5f0ed90e";

export default node;
