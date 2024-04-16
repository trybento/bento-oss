/**
 * @generated SignedSource<<00cb2974bdccabb7731edd192ee42bb9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AttributeType = "account" | "account_user";
export type AttributeAutolaunchesQuery$variables = {
  name: string;
  type: AttributeType;
};
export type AttributeAutolaunchesQuery$data = {
  readonly attribute: {
    readonly autolaunches: ReadonlyArray<{
      readonly createdFromTemplate: {
        readonly entityId: any;
        readonly name: string | null;
        readonly privateName: string | null;
      } | null;
      readonly entityId: any;
      readonly name: string | null;
    } | null>;
    readonly entityId: any;
  } | null;
};
export type AttributeAutolaunchesQuery = {
  response: AttributeAutolaunchesQuery$data;
  variables: AttributeAutolaunchesQuery$variables;
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
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AttributeAutolaunchesQuery",
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
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "autolaunches",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "createdFromTemplate",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/)
                ],
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
    "name": "AttributeAutolaunchesQuery",
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
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "autolaunches",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "createdFromTemplate",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/)
                ],
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
    "cacheID": "05d4e03472c11c53ee2e6094f21e22b3",
    "id": null,
    "metadata": {},
    "name": "AttributeAutolaunchesQuery",
    "operationKind": "query",
    "text": "query AttributeAutolaunchesQuery(\n  $name: String!\n  $type: AttributeType!\n) {\n  attribute: findAttribute(name: $name, type: $type) {\n    entityId\n    autolaunches {\n      name\n      entityId\n      createdFromTemplate {\n        entityId\n        name\n        privateName\n        id\n      }\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "c48be5902251db30ed8908be7d37be5a";

export default node;
