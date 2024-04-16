/**
 * @generated SignedSource<<d70d8cd5fca2a366360d25dc4cf054ef>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TemplatePropagationQueueQuery$variables = {
  templateEntityId: any;
};
export type TemplatePropagationQueueQuery$data = {
  readonly template: {
    readonly entityId: any;
    readonly propagationQueue: number;
  } | null;
};
export type TemplatePropagationQueueQuery = {
  response: TemplatePropagationQueueQuery$data;
  variables: TemplatePropagationQueueQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "templateEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "templateEntityId"
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
  "name": "propagationQueue",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TemplatePropagationQueueQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
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
    "name": "TemplatePropagationQueueQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
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
    "cacheID": "14dcd77cd8ac915cc395b8a7f6e164e6",
    "id": null,
    "metadata": {},
    "name": "TemplatePropagationQueueQuery",
    "operationKind": "query",
    "text": "query TemplatePropagationQueueQuery(\n  $templateEntityId: EntityId!\n) {\n  template: findTemplate(entityId: $templateEntityId) {\n    entityId\n    propagationQueue\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "9e5556e04191cdc3b5b03c32e4ada51f";

export default node;
