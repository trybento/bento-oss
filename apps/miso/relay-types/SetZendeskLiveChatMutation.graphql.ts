/**
 * @generated SignedSource<<d65657688cfffcd3ca3dc121d1e58539>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SetZendeskLiveChatInput = {
  enabled: boolean;
  entityId?: any | null;
};
export type SetZendeskLiveChatMutation$variables = {
  input: SetZendeskLiveChatInput;
};
export type SetZendeskLiveChatMutation$data = {
  readonly setZendeskLiveChat: {
    readonly integration: {
      readonly entityId: any;
    } | null;
  } | null;
};
export type SetZendeskLiveChatMutation = {
  response: SetZendeskLiveChatMutation$data;
  variables: SetZendeskLiveChatMutation$variables;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SetZendeskLiveChatMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SetZendeskLiveChatPayload",
        "kind": "LinkedField",
        "name": "setZendeskLiveChat",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "IntegrationApiKey",
            "kind": "LinkedField",
            "name": "integration",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SetZendeskLiveChatMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SetZendeskLiveChatPayload",
        "kind": "LinkedField",
        "name": "setZendeskLiveChat",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "IntegrationApiKey",
            "kind": "LinkedField",
            "name": "integration",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6186e0de050bb6d9a52f40b853b76592",
    "id": null,
    "metadata": {},
    "name": "SetZendeskLiveChatMutation",
    "operationKind": "mutation",
    "text": "mutation SetZendeskLiveChatMutation(\n  $input: SetZendeskLiveChatInput!\n) {\n  setZendeskLiveChat(input: $input) {\n    integration {\n      entityId\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "da20ebc7319aac3b6dcdc044edb6c899";

export default node;
