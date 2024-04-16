/**
 * @generated SignedSource<<360d5292e5a8a864f7053890ffe3c0af>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type EditModuleDetailsInput = {
  moduleData: EditModuleDetailsTemplateInput;
};
export type EditModuleDetailsTemplateInput = {
  description?: string | null;
  displayTitle?: string | null;
  entityId: any;
  name?: string | null;
};
export type EditModuleDetailsMutation$variables = {
  input: EditModuleDetailsInput;
};
export type EditModuleDetailsMutation$data = {
  readonly editModuleDetails: {
    readonly errors: ReadonlyArray<string> | null;
    readonly module: {
      readonly description: string | null;
      readonly displayTitle: string | null;
      readonly entityId: any;
      readonly name: string | null;
      readonly updatedAt: any | null;
    } | null;
  } | null;
};
export type EditModuleDetailsMutation = {
  response: EditModuleDetailsMutation$data;
  variables: EditModuleDetailsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
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
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "errors",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditModuleDetailsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditModuleDetailsPayload",
        "kind": "LinkedField",
        "name": "editModuleDetails",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "module",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditModuleDetailsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditModuleDetailsPayload",
        "kind": "LinkedField",
        "name": "editModuleDetails",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "module",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f3a68d69363fa8bd20c37cfdedf500d7",
    "id": null,
    "metadata": {},
    "name": "EditModuleDetailsMutation",
    "operationKind": "mutation",
    "text": "mutation EditModuleDetailsMutation(\n  $input: EditModuleDetailsInput!\n) {\n  editModuleDetails(input: $input) {\n    module {\n      updatedAt\n      entityId\n      name\n      displayTitle\n      description\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "65c4c5c98a88d97c0724b6221c2d98a9";

export default node;
