/**
 * @generated SignedSource<<a6faede033d71cdbb924c68736e322a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type RuleAttributeValuesQuery$variables = {
  name?: string | null;
  q?: string | null;
  qs?: ReadonlyArray<string> | null;
  type?: string | null;
};
export type RuleAttributeValuesQuery$data = {
  readonly attributeValues: ReadonlyArray<string>;
};
export type RuleAttributeValuesQuery = {
  response: RuleAttributeValuesQuery$data;
  variables: RuleAttributeValuesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "q"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "qs"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "type"
},
v4 = [
  {
    "alias": "attributeValues",
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "q",
        "variableName": "q"
      },
      {
        "kind": "Variable",
        "name": "qs",
        "variableName": "qs"
      },
      {
        "kind": "Variable",
        "name": "type",
        "variableName": "type"
      }
    ],
    "kind": "ScalarField",
    "name": "findAttributeValues",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RuleAttributeValuesQuery",
    "selections": (v4/*: any*/),
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "RuleAttributeValuesQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "ae8bc4c63a1b0ea4c32031d1027a4dd1",
    "id": null,
    "metadata": {},
    "name": "RuleAttributeValuesQuery",
    "operationKind": "query",
    "text": "query RuleAttributeValuesQuery(\n  $name: String\n  $type: String\n  $q: String\n  $qs: [String!]\n) {\n  attributeValues: findAttributeValues(name: $name, type: $type, q: $q, qs: $qs)\n}\n"
  }
};
})();

(node as any).hash = "04b05917323f0a6ba1c7243abc5f339a";

export default node;
