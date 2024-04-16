/**
 * @generated SignedSource<<3c72b71faeec89cfa24d759ff05b445f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
export type NewAiGuideQuery$variables = {};
export type NewAiGuideQuery$data = {
  readonly organization: {
    readonly state: OrganizationStateEnumType;
    readonly visualBuilderDefaultUrl: string | null;
  };
};
export type NewAiGuideQuery = {
  response: NewAiGuideQuery$data;
  variables: NewAiGuideQuery$variables;
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
    "name": "NewAiGuideQuery",
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
    "name": "NewAiGuideQuery",
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
    "cacheID": "97b5761e12b3545ee693671f2d7f4487",
    "id": null,
    "metadata": {},
    "name": "NewAiGuideQuery",
    "operationKind": "query",
    "text": "query NewAiGuideQuery {\n  organization {\n    state\n    visualBuilderDefaultUrl\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "b85d8692a1f0085394df6de02670d87d";

export default node;
