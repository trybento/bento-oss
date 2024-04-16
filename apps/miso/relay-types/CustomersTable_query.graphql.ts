/**
 * @generated SignedSource<<78b0823914bf05818633daefb8ff7db5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CustomersTable_query$data = {
  readonly accountsConnection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly createdInOrganizationAt: any | null;
        readonly entityId: any;
        readonly guideBasesCount: number;
        readonly id: string;
        readonly lastActiveAt: any | null;
        readonly name: string;
      };
    } | null> | null;
  } | null;
  readonly " $fragmentType": "CustomersTable_query";
};
export type CustomersTable_query$key = {
  readonly " $data"?: CustomersTable_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"CustomersTable_query">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "accountsConnection"
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "after"
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
    },
    {
      "kind": "RootArgument",
      "name": "orderBy"
    },
    {
      "kind": "RootArgument",
      "name": "orderDirection"
    },
    {
      "kind": "RootArgument",
      "name": "searchQuery"
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
      "operation": require('./CustomersTablePaginationQuery.graphql')
    }
  },
  "name": "CustomersTable_query",
  "selections": [
    {
      "alias": "accountsConnection",
      "args": [
        {
          "kind": "Variable",
          "name": "orderBy",
          "variableName": "orderBy"
        },
        {
          "kind": "Variable",
          "name": "orderDirection",
          "variableName": "orderDirection"
        },
        {
          "kind": "Variable",
          "name": "searchQuery",
          "variableName": "searchQuery"
        }
      ],
      "concreteType": "AccountsConnectionConnection",
      "kind": "LinkedField",
      "name": "__CustomersTable_accountsConnection_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "AccountsConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Account",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
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
                  "name": "entityId",
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
                  "kind": "ScalarField",
                  "name": "createdInOrganizationAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "guideBasesCount",
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

(node as any).hash = "fbd9cb836b8eb58a24958ef2af70f48b";

export default node;
