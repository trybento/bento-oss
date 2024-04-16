/**
 * @generated SignedSource<<c3dc2f8273387f23b639fcc6adec7893>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ConfirmDeleteTemplateModalQuery$variables = {
  templateEntityId: any;
};
export type ConfirmDeleteTemplateModalQuery$data = {
  readonly template: {
    readonly isEmpty: boolean;
    readonly name: string | null;
  } | null;
};
export type ConfirmDeleteTemplateModalQuery = {
  response: ConfirmDeleteTemplateModalQuery$data;
  variables: ConfirmDeleteTemplateModalQuery$variables;
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
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isEmpty",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ConfirmDeleteTemplateModalQuery",
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
    "name": "ConfirmDeleteTemplateModalQuery",
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
    "cacheID": "f56c46a3820923508a70ed4d2608f2c9",
    "id": null,
    "metadata": {},
    "name": "ConfirmDeleteTemplateModalQuery",
    "operationKind": "query",
    "text": "query ConfirmDeleteTemplateModalQuery(\n  $templateEntityId: EntityId!\n) {\n  template: findTemplate(entityId: $templateEntityId) {\n    name\n    isEmpty\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "bf6da1b5338e611cd2be7cc548b6fe31";

export default node;
