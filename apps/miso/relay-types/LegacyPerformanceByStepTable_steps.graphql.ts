/**
 * @generated SignedSource<<b738a5e32683d5ae163f7c230ddb072d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LegacyPerformanceByStepTable_steps$data = {
  readonly analytics: {
    readonly steps: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly daysToComplete: number | null;
          readonly percentCompleted: number | null;
          readonly seenStep: number | null;
          readonly step: {
            readonly isAutoCompletable: boolean;
            readonly module: {
              readonly entityId: any;
            } | null;
            readonly name: string;
          } | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
  readonly " $fragmentType": "LegacyPerformanceByStepTable_steps";
};
export type LegacyPerformanceByStepTable_steps$key = {
  readonly " $data"?: LegacyPerformanceByStepTable_steps$data;
  readonly " $fragmentSpreads": FragmentRefs<"LegacyPerformanceByStepTable_steps">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "analytics",
  "steps"
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
      "name": "last"
    },
    {
      "kind": "RootArgument",
      "name": "spOrderBy"
    },
    {
      "kind": "RootArgument",
      "name": "spOrderDirection"
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
      "operation": require('./LegacyPerformanceByStepTablePaginationQuery.graphql')
    }
  },
  "name": "LegacyPerformanceByStepTable_steps",
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
          "alias": "steps",
          "args": [
            {
              "kind": "Variable",
              "name": "orderBy",
              "variableName": "spOrderBy"
            },
            {
              "kind": "Variable",
              "name": "orderDirection",
              "variableName": "spOrderDirection"
            }
          ],
          "concreteType": "StepAnalyticsConnection",
          "kind": "LinkedField",
          "name": "__LegacyPerformanceByStepTable_steps_connection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "StepAnalyticsEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "StepAnalytics",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "StepPrototype",
                      "kind": "LinkedField",
                      "name": "step",
                      "plural": false,
                      "selections": [
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
                          "name": "isAutoCompletable",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Module",
                          "kind": "LinkedField",
                          "name": "module",
                          "plural": false,
                          "selections": [
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "entityId",
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
                      "args": null,
                      "kind": "ScalarField",
                      "name": "percentCompleted",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "daysToComplete",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "seenStep",
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

(node as any).hash = "d1a3ed2bbe9c79a70562c4719e15e9cc";

export default node;
