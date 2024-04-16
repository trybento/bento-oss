/**
 * @generated SignedSource<<c5d35561a8f63b5db7d1c9687782dc95>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CustomersQuery$variables = {};
export type CustomersQuery$data = {
  readonly organization: {
    readonly slug: string;
  };
};
export type CustomersQuery = {
  response: CustomersQuery$data;
  variables: CustomersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CustomersQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v0/*: any*/)
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
    "name": "CustomersQuery",
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
    "cacheID": "f8e8ab42df4310868f94fd457f1af1ec",
    "id": null,
    "metadata": {},
    "name": "CustomersQuery",
    "operationKind": "query",
    "text": "query CustomersQuery {\n  organization {\n    slug\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "85320763836c8f75be709205fc5cd6d9";

export default node;
