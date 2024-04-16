/**
 * @generated SignedSource<<37950b41c5ad8af55074b0553fb0105c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type GuideBaseState = "active" | "archived" | "draft" | "inactive" | "obsoleted" | "paused";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
import { FragmentRefs } from "relay-runtime";
export type AnalyticsActiveGuidesTable_query$data = {
  readonly guideBasesConnection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly account: {
          readonly entityId: any;
          readonly name: string;
        };
        readonly accountGuide: {
          readonly completedStepsCount: number;
          readonly entityId: any;
          readonly stepsCount: number;
        } | null;
        readonly averageCompletionPercentage: number;
        readonly entityId: any;
        readonly isModifiedFromTemplate: boolean;
        readonly isTargetedForSplitTesting: SplitTestStateEnumType;
        readonly lastActiveAt: any | null;
        readonly name: string | null;
        readonly participantsWhoViewedCount: number;
        readonly state: GuideBaseState;
        readonly stepsCompletedCount: number;
        readonly type: GuideTypeEnumType;
        readonly usersCompletedAStepCount: number;
        readonly wasAutoLaunched: boolean;
      };
    } | null> | null;
  } | null;
  readonly " $fragmentType": "AnalyticsActiveGuidesTable_query";
};
export type AnalyticsActiveGuidesTable_query$key = {
  readonly " $data"?: AnalyticsActiveGuidesTable_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"AnalyticsActiveGuidesTable_query">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "guideBasesConnection"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
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
      "name": "templateEntityId"
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
      "operation": require('./AnalyticsActiveGuidesTablePaginationQuery.graphql')
    }
  },
  "name": "AnalyticsActiveGuidesTable_query",
  "selections": [
    {
      "alias": "guideBasesConnection",
      "args": [
        {
          "kind": "Variable",
          "name": "createdFromTemplateEntityId",
          "variableName": "templateEntityId"
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
      "concreteType": "GuideBasesConnectionConnection",
      "kind": "LinkedField",
      "name": "__AnalyticsActiveGuidesTable_guideBasesConnection_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "GuideBasesConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "GuideBase",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "averageCompletionPercentage",
                  "storageKey": null
                },
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "state",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "wasAutoLaunched",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "isModifiedFromTemplate",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "type",
                  "storageKey": null
                },
                (v2/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "isTargetedForSplitTesting",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Guide",
                  "kind": "LinkedField",
                  "name": "accountGuide",
                  "plural": false,
                  "selections": [
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "completedStepsCount",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "stepsCount",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Account",
                  "kind": "LinkedField",
                  "name": "account",
                  "plural": false,
                  "selections": [
                    (v1/*: any*/),
                    (v2/*: any*/)
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "stepsCompletedCount",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "participantsWhoViewedCount",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "usersCompletedAStepCount",
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

(node as any).hash = "e19693470f751b087364689b5be73eb2";

export default node;
