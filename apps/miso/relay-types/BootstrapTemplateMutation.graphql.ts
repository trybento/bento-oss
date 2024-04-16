/**
 * @generated SignedSource<<effff2bf1efd45f7626a418f2d68d94d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type BootstrapTemplateInput = {
  entityId: any;
};
export type BootstrapTemplateMutation$variables = {
  input: BootstrapTemplateInput;
};
export type BootstrapTemplateMutation$data = {
  readonly bootstrapTemplates: {
    readonly errors: ReadonlyArray<string> | null;
    readonly template: {
      readonly entityId: any;
    } | null;
  } | null;
};
export type BootstrapTemplateMutation = {
  response: BootstrapTemplateMutation$data;
  variables: BootstrapTemplateMutation$variables;
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
  "name": "entityId",
  "storageKey": null
},
v3 = {
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
    "name": "BootstrapTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BootstrapTemplatePayload",
        "kind": "LinkedField",
        "name": "bootstrapTemplates",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
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
    "name": "BootstrapTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BootstrapTemplatePayload",
        "kind": "LinkedField",
        "name": "bootstrapTemplates",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
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
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "30c3708b69e96d1defd35e7198ff5a08",
    "id": null,
    "metadata": {},
    "name": "BootstrapTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation BootstrapTemplateMutation(\n  $input: BootstrapTemplateInput!\n) {\n  bootstrapTemplates(input: $input) {\n    template {\n      entityId\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "754b189a499a4c0e63079bc906bfc36e";

export default node;
