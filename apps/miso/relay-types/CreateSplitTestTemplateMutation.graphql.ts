/**
 * @generated SignedSource<<e2ce531dff6f61cf7c85cefe77643ec4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateSplitTestTemplateInput = {
  templateData: CreateSplitTestTemplateTemplateInput;
};
export type CreateSplitTestTemplateTemplateInput = {
  description?: string | null;
  name: string;
  privateName?: string | null;
  targetTemplates: ReadonlyArray<any | null>;
};
export type CreateSplitTestTemplateMutation$variables = {
  input: CreateSplitTestTemplateInput;
};
export type CreateSplitTestTemplateMutation$data = {
  readonly createSplitTestTemplate: {
    readonly errors: ReadonlyArray<string> | null;
    readonly template: {
      readonly entityId: any;
      readonly name: string | null;
      readonly privateName: string | null;
    } | null;
  } | null;
};
export type CreateSplitTestTemplateMutation = {
  response: CreateSplitTestTemplateMutation$data;
  variables: CreateSplitTestTemplateMutation$variables;
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
  "name": "errors",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateSplitTestTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateSplitTestTemplatePayload",
        "kind": "LinkedField",
        "name": "createSplitTestTemplate",
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
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v5/*: any*/)
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
    "name": "CreateSplitTestTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateSplitTestTemplatePayload",
        "kind": "LinkedField",
        "name": "createSplitTestTemplate",
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
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "04a2ab259f0afa29f5e1b41b33076deb",
    "id": null,
    "metadata": {},
    "name": "CreateSplitTestTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation CreateSplitTestTemplateMutation(\n  $input: CreateSplitTestTemplateInput!\n) {\n  createSplitTestTemplate(input: $input) {\n    template {\n      entityId\n      name\n      privateName\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "36264250478bd8edd27097c64dcad228";

export default node;
