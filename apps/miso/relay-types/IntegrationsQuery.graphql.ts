/**
 * @generated SignedSource<<2a5de210c09b03c274f1b3700d953615>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type EventHookTypeEnum = "all" | "guideCompleted" | "guideViewed" | "ping" | "stepCompleted" | "stepViewed";
export type IntegrationStateEnum = "active" | "inactive";
export type IntegrationTypeEnum = "zendesk";
export type WebhookStateTypeEnum = "active" | "inactive";
export type IntegrationsQuery$variables = {};
export type IntegrationsQuery$data = {
  readonly orgSettings: {
    readonly bentoApiKey: {
      readonly integratedAt: any | null;
      readonly key: string;
    } | null;
    readonly integrationApiKeys: ReadonlyArray<{
      readonly key: string;
      readonly state: IntegrationStateEnum;
      readonly type: IntegrationTypeEnum | null;
    }> | null;
    readonly webhooks: ReadonlyArray<{
      readonly eventType: EventHookTypeEnum;
      readonly secretKey: string | null;
      readonly state: WebhookStateTypeEnum;
      readonly webhookUrl: string;
    }> | null;
  } | null;
};
export type IntegrationsQuery = {
  response: IntegrationsQuery$data;
  variables: IntegrationsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "integratedAt",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "webhookUrl",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "eventType",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "secretKey",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "IntegrationsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "OrganizationOrgSettings",
        "kind": "LinkedField",
        "name": "orgSettings",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "SegmentApiKey",
            "kind": "LinkedField",
            "name": "bentoApiKey",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "IntegrationApiKey",
            "kind": "LinkedField",
            "name": "integrationApiKeys",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v0/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Webhook",
            "kind": "LinkedField",
            "name": "webhooks",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "IntegrationsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "OrganizationOrgSettings",
        "kind": "LinkedField",
        "name": "orgSettings",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "SegmentApiKey",
            "kind": "LinkedField",
            "name": "bentoApiKey",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "IntegrationApiKey",
            "kind": "LinkedField",
            "name": "integrationApiKeys",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v0/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Webhook",
            "kind": "LinkedField",
            "name": "webhooks",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ed621a5dcbaae2f96021f153e9fcbb17",
    "id": null,
    "metadata": {},
    "name": "IntegrationsQuery",
    "operationKind": "query",
    "text": "query IntegrationsQuery {\n  orgSettings {\n    bentoApiKey {\n      key\n      integratedAt\n      id\n    }\n    integrationApiKeys {\n      type\n      state\n      key\n      id\n    }\n    webhooks {\n      webhookUrl\n      eventType\n      state\n      secretKey\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "79a451027da713d350964336d75b12fd";

export default node;
