/**
 * @generated SignedSource<<28fe4acc3b640973690f31ae9a8c9bf2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type BentoApiKeyTypeEnum = "api";
export type GenerateBentoApiKeyInput = {
  keyType?: BentoApiKeyTypeEnum | null;
  orgEntityId?: string | null;
  recreate?: boolean | null;
};
export type GenerateBentoApiKeyMutation$variables = {
  input: GenerateBentoApiKeyInput;
};
export type GenerateBentoApiKeyMutation$data = {
  readonly generateBentoApiKey: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type GenerateBentoApiKeyMutation = {
  response: GenerateBentoApiKeyMutation$data;
  variables: GenerateBentoApiKeyMutation$variables;
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
    "concreteType": "GenerateBentoApiKeyPayload",
    "kind": "LinkedField",
    "name": "generateBentoApiKey",
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
    "name": "GenerateBentoApiKeyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GenerateBentoApiKeyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a3c01c4d45ca172d17e9ece6e093cd60",
    "id": null,
    "metadata": {},
    "name": "GenerateBentoApiKeyMutation",
    "operationKind": "mutation",
    "text": "mutation GenerateBentoApiKeyMutation(\n  $input: GenerateBentoApiKeyInput!\n) {\n  generateBentoApiKey(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "f094935034de715a1a9a067c6a0c6f67";

export default node;
