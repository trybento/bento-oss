/**
 * @generated SignedSource<<629140f0f5ee165bbcb816db26257deb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type DiagnosticStateEnum = "critical" | "healthy" | "noData" | "warning";
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
export type OrgSuccessfulInstallationQuery$variables = {};
export type OrgSuccessfulInstallationQuery$data = {
  readonly organization: {
    readonly diagnostics: {
      readonly successfulInitialization: DiagnosticStateEnum | null;
    } | null;
    readonly state: OrganizationStateEnumType;
  };
};
export type OrgSuccessfulInstallationQuery = {
  response: OrgSuccessfulInstallationQuery$data;
  variables: OrgSuccessfulInstallationQuery$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrgSuccessfulInstallationQuery",
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
          (v1/*: any*/)
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
    "name": "OrgSuccessfulInstallationQuery",
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
    "cacheID": "379b984f1b0112c322f1e067e7dd82c7",
    "id": null,
    "metadata": {},
    "name": "OrgSuccessfulInstallationQuery",
    "operationKind": "query",
    "text": "query OrgSuccessfulInstallationQuery {\n  organization {\n    state\n    diagnostics {\n      successfulInitialization\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "742b0c0beb5aec4edd283cfc02bbc27f";

export default node;
