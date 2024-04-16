/**
 * @generated SignedSource<<f9c0a9676cf3c6a330c06e44f4e016ba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AuditEventNameEnumType = "account_blocked" | "account_unblocked" | "archived" | "autocompleted_changed" | "autolaunch_changed" | "content_changed" | "created" | "expiration_criteria_changed" | "gptEvent" | "launched" | "location_changed" | "manual_launched" | "paused" | "priority_changed" | "removed" | "reset" | "settings_changed" | "sub_content_changed" | "templateBootstrapped";
export type HistoryTabQuery$variables = {
  templateEntityId: any;
};
export type HistoryTabQuery$data = {
  readonly templateAuditTrail: ReadonlyArray<{
    readonly data: string | null;
    readonly eventName: AuditEventNameEnumType;
    readonly timestamp: any;
    readonly user: {
      readonly avatarUrl: string | null;
      readonly fullName: string | null;
    } | null;
  } | null> | null;
};
export type HistoryTabQuery = {
  response: HistoryTabQuery$data;
  variables: HistoryTabQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "templateEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "templateEntityId",
    "variableName": "templateEntityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "eventName",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timestamp",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "data",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HistoryTabQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AuditEvent",
        "kind": "LinkedField",
        "name": "templateAuditTrail",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "HistoryTabQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AuditEvent",
        "kind": "LinkedField",
        "name": "templateAuditTrail",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fee53d052a3a32bdb263477a1f405929",
    "id": null,
    "metadata": {},
    "name": "HistoryTabQuery",
    "operationKind": "query",
    "text": "query HistoryTabQuery(\n  $templateEntityId: EntityId!\n) {\n  templateAuditTrail(templateEntityId: $templateEntityId) {\n    eventName\n    timestamp\n    user {\n      fullName\n      avatarUrl\n      id\n    }\n    data\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "6a280517f87f7258e260a507261f4970";

export default node;
