/**
 * @generated SignedSource<<0d5a9e3b9d32ef52841f6f643b903820>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type InviteUsersInput = {
  inviteUsers: string;
};
export type InviteUsersMutation$variables = {
  input: InviteUsersInput;
};
export type InviteUsersMutation$data = {
  readonly inviteUsers: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type InviteUsersMutation = {
  response: InviteUsersMutation$data;
  variables: InviteUsersMutation$variables;
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
    "concreteType": "InviteUsersPayload",
    "kind": "LinkedField",
    "name": "inviteUsers",
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
    "name": "InviteUsersMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "InviteUsersMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a2f57c8d49e0bcd873bc32dcd00b65df",
    "id": null,
    "metadata": {},
    "name": "InviteUsersMutation",
    "operationKind": "mutation",
    "text": "mutation InviteUsersMutation(\n  $input: InviteUsersInput!\n) {\n  inviteUsers(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "74f8d96207edf3eccbf278b699af3992";

export default node;
