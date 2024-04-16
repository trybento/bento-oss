/**
 * @generated SignedSource<<d39fc0dbc976b9bd268d3cae06603ff0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UsersProviderQuery$variables = {};
export type UsersProviderQuery$data = {
  readonly organization: {
    readonly slug: string;
    readonly users: ReadonlyArray<{
      readonly avatarUrl: string | null;
      readonly email: string;
      readonly fullName: string | null;
      readonly " $fragmentSpreads": FragmentRefs<"OrgUsersDropdown_users">;
    }>;
  };
};
export type UsersProviderQuery = {
  response: UsersProviderQuery$data;
  variables: UsersProviderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "UsersProviderQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "users",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "OrgUsersDropdown_users"
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
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UsersProviderQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "users",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "entityId",
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a29bfc1847c97f142d5e6ce78cd4e23b",
    "id": null,
    "metadata": {},
    "name": "UsersProviderQuery",
    "operationKind": "query",
    "text": "query UsersProviderQuery {\n  organization {\n    slug\n    users {\n      email\n      avatarUrl\n      fullName\n      ...OrgUsersDropdown_users\n      id\n    }\n    id\n  }\n}\n\nfragment OrgUsersDropdown_users on User {\n  fullName\n  entityId\n  avatarUrl\n  email\n}\n"
  }
};
})();

(node as any).hash = "f0473114e18d6126575f6733f2765c9b";

export default node;
