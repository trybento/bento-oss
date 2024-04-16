/**
 * @generated SignedSource<<0d53b23cdcb9954f72d4b46e0448731e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RemoveTemplateInput = {
  templateEntityId: any;
};
export type RemoveTemplateMutation$variables = {
  input: RemoveTemplateInput;
};
export type RemoveTemplateMutation$data = {
  readonly removeTemplate: {
    readonly errors: ReadonlyArray<string> | null;
    readonly removedTemplateId: string | null;
  } | null;
};
export type RemoveTemplateMutation = {
  response: RemoveTemplateMutation$data;
  variables: RemoveTemplateMutation$variables;
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
    "concreteType": "RemoveTemplatePayload",
    "kind": "LinkedField",
    "name": "removeTemplate",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "removedTemplateId",
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
    "name": "RemoveTemplateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveTemplateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c7d1db4e6eafc47395d7ea5c35fdccd4",
    "id": null,
    "metadata": {},
    "name": "RemoveTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveTemplateMutation(\n  $input: RemoveTemplateInput!\n) {\n  removeTemplate(input: $input) {\n    removedTemplateId\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "adf01cf2a3737f27e1696ae2edf3eae8";

export default node;
