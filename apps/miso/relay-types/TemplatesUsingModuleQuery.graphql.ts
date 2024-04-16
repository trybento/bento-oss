/**
 * @generated SignedSource<<5ad53fdd3c22d32cf4dd2487434afadd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TemplatesUsingModuleQuery$variables = {
  entityId: any;
};
export type TemplatesUsingModuleQuery$data = {
  readonly module: {
    readonly templates: ReadonlyArray<{
      readonly entityId: any;
      readonly name: string | null;
    }>;
  } | null;
};
export type TemplatesUsingModuleQuery = {
  response: TemplatesUsingModuleQuery$data;
  variables: TemplatesUsingModuleQuery$variables;
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
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v4 = {
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
    "name": "TemplatesUsingModuleQuery",
    "selections": [
      {
        "alias": "module",
        "args": (v1/*: any*/),
        "concreteType": "Module",
        "kind": "LinkedField",
        "name": "findModule",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
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
    "name": "TemplatesUsingModuleQuery",
    "selections": [
      {
        "alias": "module",
        "args": (v1/*: any*/),
        "concreteType": "Module",
        "kind": "LinkedField",
        "name": "findModule",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "14b4303ba1b12fd8e5ea60005178872a",
    "id": null,
    "metadata": {},
    "name": "TemplatesUsingModuleQuery",
    "operationKind": "query",
    "text": "query TemplatesUsingModuleQuery(\n  $entityId: EntityId!\n) {\n  module: findModule(entityId: $entityId) {\n    templates {\n      name\n      entityId\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "4879418aa1e965106e95e34ba3816336";

export default node;
