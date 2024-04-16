/**
 * @generated SignedSource<<f5469a1110a2766e593a358754a69e39>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
export type NewAutocompleteElementQuery$variables = {};
export type NewAutocompleteElementQuery$data = {
  readonly organization: {
    readonly state: OrganizationStateEnumType;
    readonly visualBuilderDefaultUrl: string | null;
  };
};
export type NewAutocompleteElementQuery = {
  response: NewAutocompleteElementQuery$data;
  variables: NewAutocompleteElementQuery$variables;
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
    "name": "NewAutocompleteElementQuery",
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
    "name": "NewAutocompleteElementQuery",
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
    "cacheID": "c70a4d45710e2a10f112fbbf660cd6a9",
    "id": null,
    "metadata": {},
    "name": "NewAutocompleteElementQuery",
    "operationKind": "query",
    "text": "query NewAutocompleteElementQuery {\n  organization {\n    state\n    visualBuilderDefaultUrl\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "90600edb170f16098d102002455ba4e4";

export default node;
