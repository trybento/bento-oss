/**
 * @generated SignedSource<<d1bcc65f543cb5119365bc62e05dbfa4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
export type NewTagQuery$variables = {};
export type NewTagQuery$data = {
  readonly organization: {
    readonly state: OrganizationStateEnumType;
    readonly visualBuilderDefaultUrl: string | null;
  };
};
export type NewTagQuery = {
  response: NewTagQuery$data;
  variables: NewTagQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "visualBuilderDefaultUrl",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "NewTagQuery",
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
          (v1/*: any*/)
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
    "name": "NewTagQuery",
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
          (v1/*: any*/),
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
    "cacheID": "8538b7b46d9aa93e1789038515c7a03d",
    "id": null,
    "metadata": {},
    "name": "NewTagQuery",
    "operationKind": "query",
    "text": "query NewTagQuery {\n  organization {\n    state\n    visualBuilderDefaultUrl\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "29d6733ef4c0868caefe593372065058";

export default node;
