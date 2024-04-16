/**
 * @generated SignedSource<<73fd2b1d2c25613b961f76281513ebc9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type DiagnosticStateEnum = "critical" | "healthy" | "noData" | "warning";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type InlineEmbedState = "active" | "inactive";
export type OrgPlan = "Custom" | "Growth" | "Scale" | "Starter";
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
export type SidebarAvailabilityType = "default" | "hide" | "never_open";
export type TemplateState = "draft" | "live" | "removed" | "stopped";
export type BentoOnboardingGuideProviderQuery$variables = {};
export type BentoOnboardingGuideProviderQuery$data = {
  readonly organization: {
    readonly diagnostics: {
      readonly successfulInitialization: DiagnosticStateEnum | null;
    } | null;
    readonly hasAccountUsers: boolean | null;
    readonly hasIntegrations: ReadonlyArray<string | null> | null;
    readonly hasLaunchedGuides: boolean | null;
    readonly inlineEmbeds: ReadonlyArray<{
      readonly state: InlineEmbedState;
    } | null> | null;
    readonly plan: OrgPlan;
    readonly state: OrganizationStateEnumType;
    readonly templates: ReadonlyArray<{
      readonly designType: GuideDesignTypeEnumType;
      readonly formFactor: GuideFormFactorEnumType | null;
      readonly isSideQuest: boolean | null;
      readonly state: TemplateState;
    }>;
    readonly trialEndedAt: any | null;
    readonly users: ReadonlyArray<{
      readonly entityId: any;
    }>;
  };
  readonly uiSettings: {
    readonly sidebarAvailability: SidebarAvailabilityType;
  } | null;
};
export type BentoOnboardingGuideProviderQuery = {
  response: BentoOnboardingGuideProviderQuery$data;
  variables: BentoOnboardingGuideProviderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "plan",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasLaunchedGuides",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasAccountUsers",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "OrganizationInlineEmbed",
  "kind": "LinkedField",
  "name": "inlineEmbeds",
  "plural": true,
  "selections": [
    (v0/*: any*/)
  ],
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "trialEndedAt",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasIntegrations",
  "storageKey": null
},
v11 = {
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
    }
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "OrganizationUISettings",
  "kind": "LinkedField",
  "name": "uiSettings",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sidebarAvailability",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v13 = {
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
    "name": "BentoOnboardingGuideProviderQuery",
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
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "users",
            "plural": true,
            "selections": [
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/)
        ],
        "storageKey": null
      },
      (v12/*: any*/)
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "BentoOnboardingGuideProviderQuery",
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
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v13/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "users",
            "plural": true,
            "selections": [
              (v7/*: any*/),
              (v13/*: any*/)
            ],
            "storageKey": null
          },
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v13/*: any*/)
        ],
        "storageKey": null
      },
      (v12/*: any*/)
    ]
  },
  "params": {
    "cacheID": "330b815998b99cd512572745dc1ccaea",
    "id": null,
    "metadata": {},
    "name": "BentoOnboardingGuideProviderQuery",
    "operationKind": "query",
    "text": "query BentoOnboardingGuideProviderQuery {\n  organization {\n    state\n    plan\n    hasLaunchedGuides\n    hasAccountUsers\n    templates {\n      state\n      formFactor\n      isSideQuest\n      designType\n      id\n    }\n    users {\n      entityId\n      id\n    }\n    inlineEmbeds {\n      state\n    }\n    trialEndedAt\n    hasIntegrations\n    diagnostics {\n      successfulInitialization\n    }\n    id\n  }\n  uiSettings {\n    sidebarAvailability\n  }\n}\n"
  }
};
})();

(node as any).hash = "8e44d7a24d0c752afe3279b1f8439936";

export default node;
