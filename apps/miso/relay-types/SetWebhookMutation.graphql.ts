/**
 * @generated SignedSource<<3ea0ea6d0d1ff6877603b7fff07f0f65>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type EventHookTypeEnum = "all" | "guideCompleted" | "guideViewed" | "ping" | "stepCompleted" | "stepViewed";
export type WebhookStateTypeEnum = "active" | "inactive";
export type WebhookTypeTypeEnum = "standard";
export type SetWebhookInput = {
  eventType: EventHookTypeEnum;
  secretKey?: string | null;
  state: WebhookStateTypeEnum;
  webhookType?: WebhookTypeTypeEnum | null;
  webhookUrl: string;
};
export type SetWebhookMutation$variables = {
  input: SetWebhookInput;
};
export type SetWebhookMutation$data = {
  readonly setWebhook: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type SetWebhookMutation = {
  response: SetWebhookMutation$data;
  variables: SetWebhookMutation$variables;
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
    "concreteType": "SetWebhookPayload",
    "kind": "LinkedField",
    "name": "setWebhook",
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
    "name": "SetWebhookMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SetWebhookMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6d874a5893c40c14bed3faaed83ea402",
    "id": null,
    "metadata": {},
    "name": "SetWebhookMutation",
    "operationKind": "mutation",
    "text": "mutation SetWebhookMutation(\n  $input: SetWebhookInput!\n) {\n  setWebhook(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "6598695ccbca59576851e6279f8ea711";

export default node;
