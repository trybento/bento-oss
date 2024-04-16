/**
 * @generated SignedSource<<5b602e7abe6d4f88382b270ec70d24ab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type DiagnosticStateEnum = "critical" | "healthy" | "noData" | "warning";
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
export type OrganizationChangedSubscription$variables = {};
export type OrganizationChangedSubscription$data = {
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
  } | null;
};
export type OrganizationChangedSubscription = {
  response: OrganizationChangedSubscription$data;
  variables: OrganizationChangedSubscription$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationChangedSubscription",
    "selections": [
      {
        "alias": "organization",
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organizationChanged",
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
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OrganizationChangedSubscription",
    "selections": [
      {
        "alias": "organization",
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organizationChanged",
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
      }
    ]
  },
  "params": {
    "cacheID": "d69f352a5298db207a0e22f508789547",
    "id": null,
    "metadata": {},
    "name": "OrganizationChangedSubscription",
    "operationKind": "subscription",
    "text": "subscription OrganizationChangedSubscription {\n  organization: organizationChanged {\n    entityId\n    name\n    state\n    createdAt\n    trialStartedAt\n    trialEndedAt\n    diagnostics {\n      successfulInitialization\n      hardCodedUsers\n      validAccountUserIds\n      hardCodedAccounts\n      hasRecommendedAttributes\n      inconsistentTypes\n      nonIsoDates\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f989938469f21469380e1dfd5ec0ef79";

export default node;
