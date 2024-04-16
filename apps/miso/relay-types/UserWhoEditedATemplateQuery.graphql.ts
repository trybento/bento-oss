/**
 * @generated SignedSource<<8b9781a4352aad4a8bacf6ee2d6eb2c5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UserWhoEditedATemplateQuery$variables = {};
export type UserWhoEditedATemplateQuery$data = {
  readonly usersWhoEditedATemplate: ReadonlyArray<{
    readonly email: string;
    readonly entityId: any;
    readonly fullName: string | null;
  }>;
};
export type UserWhoEditedATemplateQuery = {
  response: UserWhoEditedATemplateQuery$data;
  variables: UserWhoEditedATemplateQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "UserWhoEditedATemplateQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "usersWhoEditedATemplate",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/)
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
    "name": "UserWhoEditedATemplateQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "usersWhoEditedATemplate",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3fded88d673c1b66b16503ae35a9ef15",
    "id": null,
    "metadata": {},
    "name": "UserWhoEditedATemplateQuery",
    "operationKind": "query",
    "text": "query UserWhoEditedATemplateQuery {\n  usersWhoEditedATemplate {\n    entityId\n    fullName\n    email\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "8f701d3025b4675b94c6ae3d5248101b";

export default node;
