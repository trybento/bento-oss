/**
 * @generated SignedSource<<5fc0124bfa6374fddb241ee52f1f85af>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type EventHookTypeEnum = "all" | "guideCompleted" | "guideViewed" | "ping" | "stepCompleted" | "stepViewed";
export type WebhookTypeTypeEnum = "standard";
export type TestWebhookInput = {
  eventType?: EventHookTypeEnum | null;
  secretKey?: string | null;
  webhookType?: WebhookTypeTypeEnum | null;
  webhookUrl: string;
};
export type TestWebhookMutation$variables = {
  input: TestWebhookInput;
};
export type TestWebhookMutation$data = {
  readonly testWebhook: {
    readonly errors: ReadonlyArray<string> | null;
    readonly message: string | null;
  } | null;
};
export type TestWebhookMutation = {
  response: TestWebhookMutation$data;
  variables: TestWebhookMutation$variables;
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
    "concreteType": "TestWebhookPayload",
    "kind": "LinkedField",
    "name": "testWebhook",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "message",
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
    "name": "TestWebhookMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TestWebhookMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4d5fc43c5f1461c6132f2cc796d8c661",
    "id": null,
    "metadata": {},
    "name": "TestWebhookMutation",
    "operationKind": "mutation",
    "text": "mutation TestWebhookMutation(\n  $input: TestWebhookInput!\n) {\n  testWebhook(input: $input) {\n    message\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "988f4f04efba66bed00d3d99d971b460";

export default node;
