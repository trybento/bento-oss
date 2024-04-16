/**
 * @generated SignedSource<<2a4e917d1db9dc3445274457c860e809>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AttributeSoutceType = "api" | "bento" | "import" | "snippet";
export type AttributeType = "account" | "account_user";
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type AttributesTabQuery$variables = {};
export type AttributesTabQuery$data = {
  readonly attributes: ReadonlyArray<{
    readonly entityId: any;
    readonly mappedToAutocomplete: boolean | null;
    readonly mappedToAutolaunch: boolean | null;
    readonly name: string;
    readonly source: AttributeSoutceType | null;
    readonly type: AttributeType | null;
    readonly valueType: AttributeValueType;
    readonly values: ReadonlyArray<string | null>;
  }>;
};
export type AttributesTabQuery = {
  response: AttributesTabQuery$data;
  variables: AttributesTabQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "fullList",
    "value": true
  }
],
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
  "name": "entityId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueType",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "source",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mappedToAutolaunch",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mappedToAutocomplete",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "values",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AttributesTabQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Attribute",
        "kind": "LinkedField",
        "name": "attributes",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/)
        ],
        "storageKey": "attributes(fullList:true)"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AttributesTabQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Attribute",
        "kind": "LinkedField",
        "name": "attributes",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "attributes(fullList:true)"
      }
    ]
  },
  "params": {
    "cacheID": "78530b313c1aad92ebd53146de24028a",
    "id": null,
    "metadata": {},
    "name": "AttributesTabQuery",
    "operationKind": "query",
    "text": "query AttributesTabQuery {\n  attributes(fullList: true) {\n    name\n    entityId\n    valueType\n    type\n    source\n    mappedToAutolaunch\n    mappedToAutocomplete\n    values\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "379b9f755c8ee758ba397b3cc4706a78";

export default node;
