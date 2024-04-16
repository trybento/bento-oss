/**
 * @generated SignedSource<<f6c5d178d8b46900130b7e115d9adf52>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GuideBaseResetQuery$variables = {
  entityId: any;
};
export type GuideBaseResetQuery$data = {
  readonly account: {
    readonly hasGuides: boolean;
  } | null;
};
export type GuideBaseResetQuery = {
  response: GuideBaseResetQuery$data;
  variables: GuideBaseResetQuery$variables;
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
  "name": "hasGuides",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GuideBaseResetQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GuideBaseResetQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
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
    "cacheID": "18ebdd6bea246067a4aeb57207224d39",
    "id": null,
    "metadata": {},
    "name": "GuideBaseResetQuery",
    "operationKind": "query",
    "text": "query GuideBaseResetQuery(\n  $entityId: EntityId!\n) {\n  account: findAccount(entityId: $entityId) {\n    hasGuides\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "541cfe9dde3379d2432f36f033cf33bd";

export default node;
