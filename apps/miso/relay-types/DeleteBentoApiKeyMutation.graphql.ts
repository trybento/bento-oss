/**
 * @generated SignedSource<<28f219bd36d71241e12f90aaff5223ea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type BentoApiKeyTypeEnum = "api";
export type DeleteBentoApiKeyInput = {
  keyType?: BentoApiKeyTypeEnum | null;
  orgEntityId?: string | null;
};
export type DeleteBentoApiKeyMutation$variables = {
  input: DeleteBentoApiKeyInput;
};
export type DeleteBentoApiKeyMutation$data = {
  readonly deleteBentoApiKey: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type DeleteBentoApiKeyMutation = {
  response: DeleteBentoApiKeyMutation$data;
  variables: DeleteBentoApiKeyMutation$variables;
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
    "concreteType": "DeleteBentoApiKeyPayload",
    "kind": "LinkedField",
    "name": "deleteBentoApiKey",
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
    "name": "DeleteBentoApiKeyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteBentoApiKeyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b3d98d36ada3e36bf35b7687d6130052",
    "id": null,
    "metadata": {},
    "name": "DeleteBentoApiKeyMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteBentoApiKeyMutation(\n  $input: DeleteBentoApiKeyInput!\n) {\n  deleteBentoApiKey(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "1cfb51ae28b33790ff8b9385f91ce88a";

export default node;
