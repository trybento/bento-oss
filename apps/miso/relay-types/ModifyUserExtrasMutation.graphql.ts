/**
 * @generated SignedSource<<78e44cadd311275dfc69c80452339c5f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ModifyUserExtrasUserInput = {
  key: string;
  userEntityId: any;
};
export type ModifyUserExtrasMutation$variables = {
  input: ModifyUserExtrasUserInput;
};
export type ModifyUserExtrasMutation$data = {
  readonly modifyUserExtras: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type ModifyUserExtrasMutation = {
  response: ModifyUserExtrasMutation$data;
  variables: ModifyUserExtrasMutation$variables;
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
    "concreteType": "ModifyUserExtrasUserPayload",
    "kind": "LinkedField",
    "name": "modifyUserExtras",
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
    "name": "ModifyUserExtrasMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ModifyUserExtrasMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cfbecafa0516f8a78439bc5fb003fe10",
    "id": null,
    "metadata": {},
    "name": "ModifyUserExtrasMutation",
    "operationKind": "mutation",
    "text": "mutation ModifyUserExtrasMutation(\n  $input: ModifyUserExtrasUserInput!\n) {\n  modifyUserExtras(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "7678668d2365d1d04fbac4db56b2fa69";

export default node;
