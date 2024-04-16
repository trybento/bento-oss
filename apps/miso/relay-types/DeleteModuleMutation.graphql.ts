/**
 * @generated SignedSource<<831af2bdcaf87e683001adb1931539e6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteModuleInput = {
  moduleEntityId: any;
};
export type DeleteModuleMutation$variables = {
  input: DeleteModuleInput;
};
export type DeleteModuleMutation$data = {
  readonly deleteModule: {
    readonly deletedModuleId: string | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type DeleteModuleMutation = {
  response: DeleteModuleMutation$data;
  variables: DeleteModuleMutation$variables;
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
    "concreteType": "DeleteModulePayload",
    "kind": "LinkedField",
    "name": "deleteModule",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "deletedModuleId",
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
    "name": "DeleteModuleMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteModuleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "87480f01f6ea75b03173199ea0e39826",
    "id": null,
    "metadata": {},
    "name": "DeleteModuleMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteModuleMutation(\n  $input: DeleteModuleInput!\n) {\n  deleteModule(input: $input) {\n    deletedModuleId\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "7f9e1540bb47ff4b44fbe045476732cf";

export default node;
