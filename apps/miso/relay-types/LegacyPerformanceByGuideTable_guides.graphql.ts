/**
 * @generated SignedSource<<662d4eba43eedd3dec537cb442a613f7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LegacyPerformanceByGuideTable_guides$data = {
  readonly analytics: {
    readonly guides: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly completedAStep: number | null;
          readonly template: {
            readonly entityId: any;
            readonly name: string | null;
          } | null;
          readonly totalStepsCompleted: number | null;
          readonly usersSeenGuide: number | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
  readonly " $fragmentType": "LegacyPerformanceByGuideTable_guides";
};
export type LegacyPerformanceByGuideTable_guides$key = {
  readonly " $data"?: LegacyPerformanceByGuideTable_guides$data;
  readonly " $fragmentSpreads": FragmentRefs<"LegacyPerformanceByGuideTable_guides">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "analytics",
  "guides"
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
      "name": "endDate"
    },
    {
      "kind": "RootArgument",
      "name": "first"
    },
    {
      "kind": "RootArgument",
      "name": "gpOrderBy"
    },
    {
      "kind": "RootArgument",
      "name": "gpOrderDirection"
    },
    {
      "kind": "RootArgument",
      "name": "last"
    },
    {
      "kind": "RootArgument",
      "name": "startDate"
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
      "operation": require('./LegacyPerformanceByGuideTablePaginationQuery.graphql')
    }
  },
  "name": "LegacyPerformanceByGuideTable_guides",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "endDate",
          "variableName": "endDate"
        },
        {
          "kind": "Variable",
          "name": "startDate",
          "variableName": "startDate"
        }
      ],
      "concreteType": "Analytics",
      "kind": "LinkedField",
      "name": "analytics",
      "plural": false,
      "selections": [
        {
          "alias": "guides",
          "args": [
            {
              "kind": "Variable",
              "name": "orderBy",
              "variableName": "gpOrderBy"
            },
            {
              "kind": "Variable",
              "name": "orderDirection",
              "variableName": "gpOrderDirection"
            }
          ],
          "concreteType": "GuidesAnalyticsConnection",
          "kind": "LinkedField",
          "name": "__LegacyPerformanceByGuideTable_guides_connection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "GuidesAnalyticsEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "GuidesAnalytics",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Template",
                      "kind": "LinkedField",
                      "name": "template",
                      "plural": false,
                      "selections": [
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
                          "name": "name",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "usersSeenGuide",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "completedAStep",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "totalStepsCompleted",
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
      "storageKey": null
    }
  ],
  "type": "RootType",
  "abstractKey": null
};
})();

(node as any).hash = "a5da656cc79c72cc8db06bd290433774";

export default node;
