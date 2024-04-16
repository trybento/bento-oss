/**
 * @generated SignedSource<<89cdad972afe236c27bd545d66cd5f7e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AttributeType = "account" | "account_user";
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type AttributesProviderQuery$variables = {};
export type AttributesProviderQuery$data = {
  readonly attributes: ReadonlyArray<{
    readonly name: string;
    readonly type: AttributeType | null;
    readonly valueType: AttributeValueType;
  }>;
};
export type AttributesProviderQuery = {
  response: AttributesProviderQuery$data;
  variables: AttributesProviderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueType",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AttributesProviderQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Attribute",
        "kind": "LinkedField",
        "name": "attributes",
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
    "name": "AttributesProviderQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Attribute",
        "kind": "LinkedField",
        "name": "attributes",
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
    "cacheID": "65362b4054de5ef38eb3016537699882",
    "id": null,
    "metadata": {},
    "name": "AttributesProviderQuery",
    "operationKind": "query",
    "text": "query AttributesProviderQuery {\n  attributes {\n    type\n    name\n    valueType\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "e3ce63e35d1caecc2597722d532c1e51";

export default node;
