/**
 * @generated SignedSource<<80ceb6b3f15aa36791342e00156cb8ef>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteTemplateInput = {
  templateEntityId: any;
};
export type DeleteTemplateMutation$variables = {
  input: DeleteTemplateInput;
};
export type DeleteTemplateMutation$data = {
  readonly deleteTemplate: {
    readonly deletedTemplateId: string | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type DeleteTemplateMutation = {
  response: DeleteTemplateMutation$data;
  variables: DeleteTemplateMutation$variables;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "DeleteTemplatePayload",
    "kind": "LinkedField",
    "name": "deleteTemplate",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "deletedTemplateId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "errors",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteTemplateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteTemplateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "db8aadc81a76ccb32c1368cd356824a9",
    "id": null,
    "metadata": {},
    "name": "DeleteTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteTemplateMutation(\n  $input: DeleteTemplateInput!\n) {\n  deleteTemplate(input: $input) {\n    deletedTemplateId\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "f625685b3da488c7e79fe8154162655e";

export default node;
