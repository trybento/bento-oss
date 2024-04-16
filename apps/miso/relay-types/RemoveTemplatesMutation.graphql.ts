/**
 * @generated SignedSource<<51ae2fc3332039aba7def56a669e663a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RemoveTemplatesInput = {
  templateEntityIds?: ReadonlyArray<any> | null;
};
export type RemoveTemplatesMutation$variables = {
  input: RemoveTemplatesInput;
};
export type RemoveTemplatesMutation$data = {
  readonly removeTemplates: {
    readonly errors: ReadonlyArray<string> | null;
    readonly removedTemplateIds: ReadonlyArray<string | null> | null;
  } | null;
};
export type RemoveTemplatesMutation = {
  response: RemoveTemplatesMutation$data;
  variables: RemoveTemplatesMutation$variables;
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
    "concreteType": "RemoveTemplatesPayload",
    "kind": "LinkedField",
    "name": "removeTemplates",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "removedTemplateIds",
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
    "name": "RemoveTemplatesMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveTemplatesMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "01631873488062353de1b786a3fda75a",
    "id": null,
    "metadata": {},
    "name": "RemoveTemplatesMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveTemplatesMutation(\n  $input: RemoveTemplatesInput!\n) {\n  removeTemplates(input: $input) {\n    removedTemplateIds\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "43d5adfb532dac2fb0449159e07e9912";

export default node;
