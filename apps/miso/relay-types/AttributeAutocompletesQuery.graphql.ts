/**
 * @generated SignedSource<<e6076763006f684cf5b5969c84af7b68>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AttributeType = "account" | "account_user";
export type AttributeAutocompletesQuery$variables = {
  name: string;
  type: AttributeType;
};
export type AttributeAutocompletesQuery$data = {
  readonly attribute: {
    readonly autocompletes: ReadonlyArray<{
      readonly entityId: any;
      readonly module: {
        readonly entityId: any;
      } | null;
      readonly name: string;
      readonly templates: ReadonlyArray<{
        readonly entityId: any;
      } | null>;
    } | null>;
    readonly entityId: any;
  } | null;
};
export type AttributeAutocompletesQuery = {
  response: AttributeAutocompletesQuery$data;
  variables: AttributeAutocompletesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "type"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  },
  {
    "kind": "Variable",
    "name": "type",
    "variableName": "type"
  }
],
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
  "name": "name",
  "storageKey": null
},
v4 = [
  (v2/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = [
  (v2/*: any*/),
  (v5/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AttributeAutocompletesQuery",
    "selections": [
      {
        "alias": "attribute",
        "args": (v1/*: any*/),
        "concreteType": "Attribute",
        "kind": "LinkedField",
        "name": "findAttribute",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototype",
            "kind": "LinkedField",
            "name": "autocompletes",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "templates",
                "plural": true,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "module",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AttributeAutocompletesQuery",
    "selections": [
      {
        "alias": "attribute",
        "args": (v1/*: any*/),
        "concreteType": "Attribute",
        "kind": "LinkedField",
        "name": "findAttribute",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototype",
            "kind": "LinkedField",
            "name": "autocompletes",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "templates",
                "plural": true,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "module",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "29ee13d0b0616c7bd48f7c8f249e0f34",
    "id": null,
    "metadata": {},
    "name": "AttributeAutocompletesQuery",
    "operationKind": "query",
    "text": "query AttributeAutocompletesQuery(\n  $name: String!\n  $type: AttributeType!\n) {\n  attribute: findAttribute(name: $name, type: $type) {\n    entityId\n    autocompletes {\n      entityId\n      name\n      templates {\n        entityId\n        id\n      }\n      module {\n        entityId\n        id\n      }\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2b210ad0c01279a70a9e091ea5346821";

export default node;
