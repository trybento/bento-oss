/**
 * @generated SignedSource<<cf506d52baea0af52f618ca294d5d9bc>>
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
export type ActiveGuidesTable_query$data = {
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
        readonly createdFromTemplate: {
          readonly entityId: any;
          readonly name: string | null;
        } | null;
        readonly entityId: any;
        readonly isModifiedFromTemplate: boolean;
        readonly isTargetedForSplitTesting: SplitTestStateEnumType;
        readonly lastActiveAt: any | null;
        readonly lastCompletedStep: {
          readonly completedAt: any | null;
          readonly name: string;
        } | null;
        readonly name: string | null;
        readonly participantsWhoViewedCount: number;
        readonly state: GuideBaseState;
        readonly stepsCompletedCount: number;
        readonly type: GuideTypeEnumType;
        readonly usersClickedCta: number | null;
        readonly usersCompletedAStepCount: number;
        readonly wasAutoLaunched: boolean;
      };
    } | null> | null;
  } | null;
  readonly " $fragmentType": "ActiveGuidesTable_query";
};
export type ActiveGuidesTable_query$key = {
  readonly " $data"?: ActiveGuidesTable_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"ActiveGuidesTable_query">;
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
      "name": "accountNameSearchQuery"
    },
    {
      "kind": "RootArgument",
      "name": "after"
    },
    {
      "kind": "RootArgument",
      "name": "assignedToEntityId"
    },
    {
      "kind": "RootArgument",
      "name": "before"
    },
    {
      "kind": "RootArgument",
      "name": "completionPercentage"
    },
    {
      "kind": "RootArgument",
      "name": "first"
    },
    {
      "kind": "RootArgument",
      "name": "hasBeenViewed"
    },
    {
      "kind": "RootArgument",
      "name": "last"
    },
    {
      "kind": "RootArgument",
      "name": "lastActiveWithin"
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
      "operation": require('./ActiveGuidesTablePaginationQuery.graphql')
    }
  },
  "name": "ActiveGuidesTable_query",
  "selections": [
    {
      "alias": "guideBasesConnection",
      "args": [
        {
          "kind": "Variable",
          "name": "accountNameSearchQuery",
          "variableName": "accountNameSearchQuery"
        },
        {
          "kind": "Variable",
          "name": "assignedToEntityId",
          "variableName": "assignedToEntityId"
        },
        {
          "kind": "Variable",
          "name": "completionPercentage",
          "variableName": "completionPercentage"
        },
        {
          "kind": "Variable",
          "name": "createdFromTemplateEntityId",
          "variableName": "templateEntityId"
        },
        {
          "kind": "Variable",
          "name": "hasBeenViewed",
          "variableName": "hasBeenViewed"
        },
        {
          "kind": "Variable",
          "name": "lastActiveWithin",
          "variableName": "lastActiveWithin"
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
      "name": "__ActiveGuidesTable_guideBasesConnection_connection",
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
                  "kind": "ScalarField",
                  "name": "usersClickedCta",
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
                  "concreteType": "Step",
                  "kind": "LinkedField",
                  "name": "lastCompletedStep",
                  "plural": false,
                  "selections": [
                    (v2/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "completedAt",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Template",
                  "kind": "LinkedField",
                  "name": "createdFromTemplate",
                  "plural": false,
                  "selections": [
                    (v2/*: any*/),
                    (v1/*: any*/)
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

(node as any).hash = "4ce6eedf12ac41b9ea9b27fad1d5f70d";

export default node;
