/**
 * @generated SignedSource<<9fff94db0433570c56562735afbe7618>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type DiagnosticStateEnum = "critical" | "healthy" | "noData" | "warning";
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
import { FragmentRefs } from "relay-runtime";
export type OrgSettings_organization$data = {
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
  readonly " $fragmentType": "OrgSettings_organization";
};
export type OrgSettings_organization$key = {
  readonly " $data"?: OrgSettings_organization$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrgSettings_organization">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrgSettings_organization",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "entityId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "state",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "trialStartedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "trialEndedAt",
      "storageKey": null
    },
    {
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
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "0a4f42616175962330799f88246a764b";

export default node;
