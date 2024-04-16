/**
 * @generated SignedSource<<b3e080eb766443f49a3e0e579f1db573>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CustomerParticipantTable_query$data = {
  readonly accountUserAnalytics: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly accountUser: {
          readonly createdInOrganizationAt: any | null;
          readonly email: string | null;
          readonly entityId: any;
          readonly fullName: string | null;
          readonly id: string;
        };
        readonly currentStep: {
          readonly guide: {
            readonly name: string;
          } | null;
          readonly name: string;
        } | null;
        readonly lastActiveInApp: any | null;
        readonly stepLastSeen: any | null;
        readonly stepsCompleted: number;
        readonly stepsViewed: number;
      } | null;
    } | null> | null;
  } | null;
  readonly " $fragmentType": "CustomerParticipantTable_query";
};
export type CustomerParticipantTable_query$key = {
  readonly " $data"?: CustomerParticipantTable_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"CustomerParticipantTable_query">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "accountUserAnalytics"
],
v1 = {
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
      "operation": require('./CustomerParticipantsTablePaginationQuery.graphql')
    }
  },
  "name": "CustomerParticipantTable_query",
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
        },
        {
          "kind": "Variable",
          "name": "searchQuery",
          "variableName": "searchQuery"
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
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "entityId",
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
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Guide",
                      "kind": "LinkedField",
                      "name": "guide",
                      "plural": false,
                      "selections": [
                        (v1/*: any*/)
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

(node as any).hash = "b890d4ac60969c004d67e6139ea46c6b";

export default node;
