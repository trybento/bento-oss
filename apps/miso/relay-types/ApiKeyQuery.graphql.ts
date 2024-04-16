/**
 * @generated SignedSource<<5493bb2e902cbd53b7d142ba398bcbdb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ApiKeyQuery$variables = {};
export type ApiKeyQuery$data = {
  readonly orgSettings: {
    readonly bentoApiKey: {
      readonly integratedAt: any | null;
      readonly key: string;
    } | null;
  } | null;
};
export type ApiKeyQuery = {
  response: ApiKeyQuery$data;
  variables: ApiKeyQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "integratedAt",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ApiKeyQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "OrganizationOrgSettings",
        "kind": "LinkedField",
        "name": "orgSettings",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "SegmentApiKey",
            "kind": "LinkedField",
            "name": "bentoApiKey",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/)
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
    "name": "ApiKeyQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "OrganizationOrgSettings",
        "kind": "LinkedField",
        "name": "orgSettings",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "SegmentApiKey",
            "kind": "LinkedField",
            "name": "bentoApiKey",
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d5293a08bdf900a625e1e5b0d4b63da4",
    "id": null,
    "metadata": {},
    "name": "ApiKeyQuery",
    "operationKind": "query",
    "text": "query ApiKeyQuery {\n  orgSettings {\n    bentoApiKey {\n      key\n      integratedAt\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6af3edb6433046f324f6dc94d1a00b52";

export default node;
