/**
 * @generated SignedSource<<76243829603cbf67fc0b78e9ff6aa3af>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
export type LoggedInUserProviderQuery$variables = {};
export type LoggedInUserProviderQuery$data = {
  readonly loggedInUser: {
    readonly allOrgs: ReadonlyArray<{
      readonly entityId: any;
    } | null>;
    readonly avatarUrl: string | null;
    readonly createdAt: any;
    readonly email: string;
    readonly entityId: any;
    readonly extra: any | null;
    readonly fullName: string | null;
    readonly hasBentoOnboardingGuide: boolean;
    readonly isBentoOnboardingGuideComplete: boolean;
    readonly isSuperadmin: boolean;
    readonly organization: {
      readonly allottedGuides: number | null;
      readonly controlSyncing: boolean | null;
      readonly createdAt: any;
      readonly domain: string | null;
      readonly enabledFeatureFlags: ReadonlyArray<string>;
      readonly entityId: any;
      readonly hasAccountUsers: boolean | null;
      readonly hasAudiences: boolean | null;
      readonly hasDiagnosticWarnings: boolean;
      readonly name: string;
      readonly slug: string;
      readonly state: OrganizationStateEnumType;
    };
  };
};
export type LoggedInUserProviderQuery = {
  response: LoggedInUserProviderQuery$data;
  variables: LoggedInUserProviderQuery$variables;
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
  "name": "fullName",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSuperadmin",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBentoOnboardingGuide",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isBentoOnboardingGuideComplete",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "extra",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "domain",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "allottedGuides",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "enabledFeatureFlags",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "controlSyncing",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasAudiences",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasAccountUsers",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasDiagnosticWarnings",
  "storageKey": null
},
v19 = {
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
    "name": "LoggedInUserProviderQuery",
    "selections": [
      {
        "alias": "loggedInUser",
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "currentUser",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "kind": "LinkedField",
            "name": "allOrgs",
            "plural": true,
            "selections": [
              (v0/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v5/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/)
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
    "name": "LoggedInUserProviderQuery",
    "selections": [
      {
        "alias": "loggedInUser",
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "currentUser",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "kind": "LinkedField",
            "name": "allOrgs",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v19/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v5/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/)
            ],
            "storageKey": null
          },
          (v19/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4bb72cd3503468046b5524becc926e96",
    "id": null,
    "metadata": {},
    "name": "LoggedInUserProviderQuery",
    "operationKind": "query",
    "text": "query LoggedInUserProviderQuery {\n  loggedInUser: currentUser {\n    entityId\n    fullName\n    email\n    isSuperadmin\n    avatarUrl\n    createdAt\n    hasBentoOnboardingGuide\n    isBentoOnboardingGuideComplete\n    extra\n    allOrgs {\n      entityId\n      id\n    }\n    organization {\n      entityId\n      name\n      slug\n      state\n      domain\n      createdAt\n      allottedGuides\n      enabledFeatureFlags\n      controlSyncing\n      hasAudiences\n      hasAccountUsers\n      hasDiagnosticWarnings\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "7c2ad1906db260ff10262d3305ed2fe0";

export default node;
