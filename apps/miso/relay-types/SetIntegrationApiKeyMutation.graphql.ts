/**
 * @generated SignedSource<<fad7e5d8e04879ed5d37fda4d6ab0e75>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type IntegrationStateEnum = "active" | "inactive";
export type IntegrationTypeEnum = "zendesk";
export type SetIntegrationApiKeyInput = {
  entityId?: any | null;
  integrationType: IntegrationTypeEnum;
  key?: string | null;
  state: IntegrationStateEnum;
};
export type SetIntegrationApiKeyMutation$variables = {
  input: SetIntegrationApiKeyInput;
};
export type SetIntegrationApiKeyMutation$data = {
  readonly setIntegrationApiKey: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type SetIntegrationApiKeyMutation = {
  response: SetIntegrationApiKeyMutation$data;
  variables: SetIntegrationApiKeyMutation$variables;
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
    "concreteType": "SetIntegrationApiKeyPayload",
    "kind": "LinkedField",
    "name": "setIntegrationApiKey",
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
    "name": "SetIntegrationApiKeyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SetIntegrationApiKeyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "08ba60e20df790c3a2d44fa85783d2ab",
    "id": null,
    "metadata": {},
    "name": "SetIntegrationApiKeyMutation",
    "operationKind": "mutation",
    "text": "mutation SetIntegrationApiKeyMutation(\n  $input: SetIntegrationApiKeyInput!\n) {\n  setIntegrationApiKey(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "6fd05efc085b80a79d0a29dae3ece11a";

export default node;
