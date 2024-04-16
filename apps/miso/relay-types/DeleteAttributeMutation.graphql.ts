/**
 * @generated SignedSource<<d8c7f67daf64a63c4463b1dcf4d5b970>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteAttributeInput = {
  entityId: any;
};
export type DeleteAttributeMutation$variables = {
  input: DeleteAttributeInput;
};
export type DeleteAttributeMutation$data = {
  readonly deleteAttribute: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type DeleteAttributeMutation = {
  response: DeleteAttributeMutation$data;
  variables: DeleteAttributeMutation$variables;
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
    "concreteType": "DeleteAttributePayload",
    "kind": "LinkedField",
    "name": "deleteAttribute",
    "plural": false,
    "selections": [
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
    "name": "DeleteAttributeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteAttributeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "43f3a6f6c865c7d0d4b72435559517af",
    "id": null,
    "metadata": {},
    "name": "DeleteAttributeMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteAttributeMutation(\n  $input: DeleteAttributeInput!\n) {\n  deleteAttribute(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "61dc959bc6d970501c9e4efa5f38003a";

export default node;
