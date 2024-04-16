/**
 * @generated SignedSource<<e112316952b459ec0a122a86f03f7d1e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type DiagnosticStateEnum = "critical" | "healthy" | "noData" | "warning";
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
export type OrgSettingsQuery$variables = {};
export type OrgSettingsQuery$data = {
  readonly orgSettings: {
    readonly defaultUserNotificationURL: string | null;
    readonly fallbackCommentsEmail: string | null;
    readonly sendAccountUserNudges: boolean | null;
    readonly sendEmailNotifications: boolean | null;
  } | null;
  readonly organization: {
    readonly createdAt: any;
    readonly diagnostics: {
      readonly hardCodedAccounts: DiagnosticStateEnum | null;
      readonly hardCodedUsers: DiagnosticStateEnum | null;
      readonly hasRecommendedAttributes: DiagnosticStateEnum | null;
      readonly inconsistentTypes: DiagnosticStateEnum | null;
      readonly nonIsoDates: DiagnosticStateEnum | null;
      readonly successfulInitialization: DiagnosticStateEnum | null;
      readonly validAccountUserIds: DiagnosticStateEnum | null;
    } | null;
    readonly entityId: any;
    readonly name: string;
    readonly state: OrganizationStateEnumType;
    readonly trialEndedAt: any | null;
    readonly trialStartedAt: any | null;
  };
};
export type OrgSettingsQuery = {
  response: OrgSettingsQuery$data;
  variables: OrgSettingsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "trialStartedAt",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "trialEndedAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "OrgDiagnostics",
  "kind": "LinkedField",
  "name": "diagnostics",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "successfulInitialization",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hardCodedUsers",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "validAccountUserIds",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hardCodedAccounts",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasRecommendedAttributes",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "inconsistentTypes",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "nonIsoDates",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
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
      "kind": "ScalarField",
      "name": "defaultUserNotificationURL",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sendAccountUserNudges",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sendEmailNotifications",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fallbackCommentsEmail",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrgSettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      },
      (v7/*: any*/)
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OrgSettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v7/*: any*/)
    ]
  },
  "params": {
    "cacheID": "86580edc472ad77986f193d1ec9ed03b",
    "id": null,
    "metadata": {},
    "name": "OrgSettingsQuery",
    "operationKind": "query",
    "text": "query OrgSettingsQuery {\n  organization {\n    entityId\n    name\n    state\n    createdAt\n    trialStartedAt\n    trialEndedAt\n    diagnostics {\n      successfulInitialization\n      hardCodedUsers\n      validAccountUserIds\n      hardCodedAccounts\n      hasRecommendedAttributes\n      inconsistentTypes\n      nonIsoDates\n    }\n    id\n  }\n  orgSettings {\n    defaultUserNotificationURL\n    sendAccountUserNudges\n    sendEmailNotifications\n    fallbackCommentsEmail\n  }\n}\n"
  }
};
})();

(node as any).hash = "e10abbaf54687f67e9c76186b738c86c";

export default node;
