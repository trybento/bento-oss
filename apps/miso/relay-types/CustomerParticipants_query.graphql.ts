/**
 * @generated SignedSource<<8ff061a1231b3c846c7e4708d9efd3a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CustomerParticipants_query$data = {
  readonly accountUserAnalytics: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly accountUser: {
          readonly createdInOrganizationAt: any | null;
          readonly email: string | null;
          readonly fullName: string | null;
          readonly id: string;
        };
        readonly currentStep: {
          readonly name: string;
        } | null;
        readonly lastActiveInApp: any | null;
        readonly stepLastSeen: any | null;
        readonly stepsCompleted: number;
        readonly stepsViewed: number;
      } | null;
    } | null> | null;
  } | null;
  readonly " $fragmentType": "CustomerParticipants_query";
};
export type CustomerParticipants_query$key = {
  readonly " $data"?: CustomerParticipants_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"CustomerParticipants_query">;
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
      "name": "includeInternal"
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
      "operation": require('./CustomerParticipantsPaginationQuery.graphql')
    }
  },
  "name": "CustomerParticipants_query",
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
          "kind": "Variable",
          "name": "includeInternal",
          "variableName": "includeInternal"
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
      "name": "__CustomerParticipants_accountUserAnalytics_connection",
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
                      "name": "id",
                      "storageKey": null
                    },
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
                    }
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
    }
  ],
  "type": "RootType",
  "abstractKey": null
};
})();

(node as any).hash = "3c66302c725bf8097c943834bdcf9193";

export default node;
