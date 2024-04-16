/**
 * @generated SignedSource<<159d6c18cf0255264785e888647e8db0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type GuideBasesQuery$variables = {
  entityId: any;
};
export type GuideBasesQuery$data = {
  readonly guideBase: {
    readonly entityId: any;
    readonly type: GuideTypeEnumType;
  } | null;
};
export type GuideBasesQuery = {
  response: GuideBasesQuery$data;
  variables: GuideBasesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "entityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "entityId"
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
  "name": "type",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GuideBasesQuery",
    "selections": [
      {
        "alias": "guideBase",
        "args": (v1/*: any*/),
        "concreteType": "GuideBase",
        "kind": "LinkedField",
        "name": "findGuideBase",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
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
    "name": "GuideBasesQuery",
    "selections": [
      {
        "alias": "guideBase",
        "args": (v1/*: any*/),
        "concreteType": "GuideBase",
        "kind": "LinkedField",
        "name": "findGuideBase",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
    "cacheID": "30810e8f2d85cb6b61d9311ee1ab4e39",
    "id": null,
    "metadata": {},
    "name": "GuideBasesQuery",
    "operationKind": "query",
    "text": "query GuideBasesQuery(\n  $entityId: EntityId!\n) {\n  guideBase: findGuideBase(entityId: $entityId) {\n    entityId\n    type\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "85ecc3e7b356f55a9f230c301f53f3e0";

export default node;
