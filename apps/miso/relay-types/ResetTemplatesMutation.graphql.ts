/**
 * @generated SignedSource<<9050bda404ed87a72f1237b039aa87a4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ResetTemplatesInput = {
  templateEntityIds?: ReadonlyArray<any> | null;
};
export type ResetTemplatesMutation$variables = {
  input: ResetTemplatesInput;
};
export type ResetTemplatesMutation$data = {
  readonly resetTemplates: {
    readonly errors: ReadonlyArray<string> | null;
    readonly resetTemplateIds: ReadonlyArray<string | null> | null;
  } | null;
};
export type ResetTemplatesMutation = {
  response: ResetTemplatesMutation$data;
  variables: ResetTemplatesMutation$variables;
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
    "concreteType": "ResetTemplatesPayload",
    "kind": "LinkedField",
    "name": "resetTemplates",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "resetTemplateIds",
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
    "name": "ResetTemplatesMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ResetTemplatesMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cedebb10bc212aa62807b382cf6ce971",
    "id": null,
    "metadata": {},
    "name": "ResetTemplatesMutation",
    "operationKind": "mutation",
    "text": "mutation ResetTemplatesMutation(\n  $input: ResetTemplatesInput!\n) {\n  resetTemplates(input: $input) {\n    resetTemplateIds\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "cf0da7cead0e7f4daeb40559a377ee7e";

export default node;
