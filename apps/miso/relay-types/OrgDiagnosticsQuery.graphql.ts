/**
 * @generated SignedSource<<4ff5c57ceeae36a8639c99d06ee44e7d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type DiagnosticStateEnum = "critical" | "healthy" | "noData" | "warning";
export type OrgDiagnosticsQuery$variables = {};
export type OrgDiagnosticsQuery$data = {
  readonly organization: {
    readonly diagnostics: {
      readonly hardCodedAccounts: DiagnosticStateEnum | null;
      readonly hardCodedUsers: DiagnosticStateEnum | null;
      readonly hasRecommendedAttributes: DiagnosticStateEnum | null;
      readonly inconsistentTypes: DiagnosticStateEnum | null;
      readonly nonIsoDates: DiagnosticStateEnum | null;
      readonly successfulInitialization: DiagnosticStateEnum | null;
      readonly validAccountUserIds: DiagnosticStateEnum | null;
    } | null;
  };
};
export type OrgDiagnosticsQuery = {
  response: OrgDiagnosticsQuery$data;
  variables: OrgDiagnosticsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
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
    "name": "OrgDiagnosticsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v0/*: any*/)
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
    "name": "OrgDiagnosticsQuery",
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
    "cacheID": "90b9c93de11439f3ff50cbf5e6bb9696",
    "id": null,
    "metadata": {},
    "name": "OrgDiagnosticsQuery",
    "operationKind": "query",
    "text": "query OrgDiagnosticsQuery {\n  organization {\n    diagnostics {\n      successfulInitialization\n      hardCodedUsers\n      validAccountUserIds\n      hardCodedAccounts\n      hasRecommendedAttributes\n      inconsistentTypes\n      nonIsoDates\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "52f22bb97c329b212eb646a6ef518d32";

export default node;
