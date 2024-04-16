/**
 * @generated SignedSource<<ceae5934f97323ba7228e81747f3513f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ConfirmDeleteModuleModalQuery$variables = {
  moduleEntityId: any;
};
export type ConfirmDeleteModuleModalQuery$data = {
  readonly module: {
    readonly isEmpty: boolean;
    readonly name: string | null;
  } | null;
};
export type ConfirmDeleteModuleModalQuery = {
  response: ConfirmDeleteModuleModalQuery$data;
  variables: ConfirmDeleteModuleModalQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "moduleEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "moduleEntityId"
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
    "name": "ConfirmDeleteModuleModalQuery",
    "selections": [
      {
        "alias": "module",
        "args": (v1/*: any*/),
        "concreteType": "Module",
        "kind": "LinkedField",
        "name": "findModule",
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
    "name": "ConfirmDeleteModuleModalQuery",
    "selections": [
      {
        "alias": "module",
        "args": (v1/*: any*/),
        "concreteType": "Module",
        "kind": "LinkedField",
        "name": "findModule",
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
    "cacheID": "e50740d9229c92d7e14fe55914c48860",
    "id": null,
    "metadata": {},
    "name": "ConfirmDeleteModuleModalQuery",
    "operationKind": "query",
    "text": "query ConfirmDeleteModuleModalQuery(\n  $moduleEntityId: EntityId!\n) {\n  module: findModule(entityId: $moduleEntityId) {\n    name\n    isEmpty\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "94f9c6e71dbe06b03fe293212d747556";

export default node;
