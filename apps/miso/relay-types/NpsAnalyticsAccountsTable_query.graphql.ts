/**
 * @generated SignedSource<<195639987b120bf1c48e535609b33c2e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NpsAnalyticsAccountsTable_query$data = {
  readonly npsSurveyAccountsConnection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly accountEntityId: any;
        readonly accountName: string;
        readonly responses: number | null;
        readonly score: number | null;
      };
    } | null> | null;
  } | null;
  readonly " $fragmentType": "NpsAnalyticsAccountsTable_query";
};
export type NpsAnalyticsAccountsTable_query$key = {
  readonly " $data"?: NpsAnalyticsAccountsTable_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"NpsAnalyticsAccountsTable_query">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "npsSurveyAccountsConnection"
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
      "name": "npsSurveyEntityId"
    },
    {
      "kind": "RootArgument",
      "name": "orderBy"
    },
    {
      "kind": "RootArgument",
      "name": "orderDirection"
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
      "operation": require('./NpsAnalyticsAccountsTablePaginationQuery.graphql')
    }
  },
  "name": "NpsAnalyticsAccountsTable_query",
  "selections": [
    {
      "alias": "npsSurveyAccountsConnection",
      "args": [
        {
          "kind": "Variable",
          "name": "npsSurveyEntityId",
          "variableName": "npsSurveyEntityId"
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
      "concreteType": "NpsSurveyAccountsConnectionConnection",
      "kind": "LinkedField",
      "name": "__NpsAnalyticsAccountsTable_npsSurveyAccountsConnection_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "NpsSurveyAccountsConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "NpsSurveyAccount",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "accountEntityId",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "accountName",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "responses",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "score",
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

(node as any).hash = "34bfa19b288f99703b9730ba0f10332e";

export default node;
