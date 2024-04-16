/**
 * @generated SignedSource<<9480a6b58af4722f8e89b64bfc558154>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ManageActionType = "add" | "remove";
export type ManageBlockedAccountInput = {
  accountName: string;
  action?: ManageActionType | null;
};
export type ManageBlockedAccountMutation$variables = {
  input: ManageBlockedAccountInput;
};
export type ManageBlockedAccountMutation$data = {
  readonly manageBlockedAccount: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type ManageBlockedAccountMutation = {
  response: ManageBlockedAccountMutation$data;
  variables: ManageBlockedAccountMutation$variables;
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
    "concreteType": "ManageBlockedAccountPayload",
    "kind": "LinkedField",
    "name": "manageBlockedAccount",
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
    "name": "ManageBlockedAccountMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ManageBlockedAccountMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2759f632964448eb46cb877faf3d9a6c",
    "id": null,
    "metadata": {},
    "name": "ManageBlockedAccountMutation",
    "operationKind": "mutation",
    "text": "mutation ManageBlockedAccountMutation(\n  $input: ManageBlockedAccountInput!\n) {\n  manageBlockedAccount(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "1da9e5c9a7e587a30403c11174c5f82d";

export default node;
