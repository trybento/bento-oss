/**
 * @generated SignedSource<<c288a4bf7645a3c19237151358c66ea6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type EditSplitTestTemplateInput = {
  templateData: EditSplitTestTemplateTemplateInput;
};
export type EditSplitTestTemplateTemplateInput = {
  description?: string | null;
  disableAutoLaunchAt?: any | null;
  enableAutoLaunchAt?: any | null;
  entityId: any;
  name?: string | null;
  privateName?: string | null;
};
export type EditSplitTestTemplateMutation$variables = {
  input: EditSplitTestTemplateInput;
};
export type EditSplitTestTemplateMutation$data = {
  readonly editSplitTestTemplate: {
    readonly errors: ReadonlyArray<string> | null;
    readonly template: {
      readonly description: string | null;
      readonly entityId: any;
      readonly name: string | null;
      readonly privateName: string | null;
      readonly updatedAt: any | null;
    } | null;
  } | null;
};
export type EditSplitTestTemplateMutation = {
  response: EditSplitTestTemplateMutation$data;
  variables: EditSplitTestTemplateMutation$variables;
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
  "name": "privateName",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
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
    "name": "EditSplitTestTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditSplitTestTemplatePayload",
        "kind": "LinkedField",
        "name": "editSplitTestTemplate",
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
    "name": "EditSplitTestTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditSplitTestTemplatePayload",
        "kind": "LinkedField",
        "name": "editSplitTestTemplate",
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
    "cacheID": "cf68f023fd900376564749016e1a01c1",
    "id": null,
    "metadata": {},
    "name": "EditSplitTestTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation EditSplitTestTemplateMutation(\n  $input: EditSplitTestTemplateInput!\n) {\n  editSplitTestTemplate(input: $input) {\n    template {\n      updatedAt\n      entityId\n      privateName\n      description\n      name\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "6936b0cb3345224c95a64f8ad5cc005b";

export default node;
