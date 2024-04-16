/**
 * @generated SignedSource<<e4c601e1a776b144efd706325cf84968>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteUserInput = {
  userEntityId: any;
};
export type DeleteUserMutation$variables = {
  input: DeleteUserInput;
};
export type DeleteUserMutation$data = {
  readonly deleteUser: {
    readonly deletedUserId: string | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type DeleteUserMutation = {
  response: DeleteUserMutation$data;
  variables: DeleteUserMutation$variables;
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
    "concreteType": "DeleteUserPayload",
    "kind": "LinkedField",
    "name": "deleteUser",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "deletedUserId",
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
    "name": "DeleteUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a103ebad4aaeb201dfedc79cfda767be",
    "id": null,
    "metadata": {},
    "name": "DeleteUserMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteUserMutation(\n  $input: DeleteUserInput!\n) {\n  deleteUser(input: $input) {\n    deletedUserId\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "4c3a0adcb06100c25f136a08a3983321";

export default node;
