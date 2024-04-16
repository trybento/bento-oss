/**
 * @generated SignedSource<<84a6bcbe19bac23c33870e216826bdd7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TagVisibilityType = "active_step" | "always";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type VisualTagPulseLevelType = "none" | "standard";
export type OrganizationUISettingsQuery$variables = {};
export type OrganizationUISettingsQuery$data = {
  readonly uiSettings: {
    readonly additionalColors: ReadonlyArray<{
      readonly value: string;
    }>;
    readonly borderColor: string | null;
    readonly cyoaOptionBackgroundColor: string | null;
    readonly cyoaTextColor: string | null;
    readonly embedBackgroundHex: string | null;
    readonly fontColorHex: string | null;
    readonly isCyoaOptionBackgroundColorDark: boolean;
    readonly primaryColorHex: string | null;
    readonly secondaryColorHex: string | null;
    readonly tagBadgeIconBorderRadius: number | null;
    readonly tagBadgeIconPadding: number | null;
    readonly tagCustomIconUrl: string | null;
    readonly tagDotSize: number | null;
    readonly tagPrimaryColor: string | null;
    readonly tagPulseLevel: VisualTagPulseLevelType | null;
    readonly tagTextColor: string | null;
    readonly tagVisibility: TagVisibilityType;
    readonly theme: ThemeType;
  } | null;
};
export type OrganizationUISettingsQuery = {
  response: OrganizationUISettingsQuery$data;
  variables: OrganizationUISettingsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
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
        "name": "embedBackgroundHex",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "primaryColorHex",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "secondaryColorHex",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "AdditionalColorsType",
        "kind": "LinkedField",
        "name": "additionalColors",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "fontColorHex",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "theme",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cyoaOptionBackgroundColor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isCyoaOptionBackgroundColorDark",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cyoaTextColor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "borderColor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tagPrimaryColor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tagDotSize",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tagPulseLevel",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tagBadgeIconBorderRadius",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tagTextColor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tagBadgeIconPadding",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tagCustomIconUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tagVisibility",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationUISettingsQuery",
    "selections": (v0/*: any*/),
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OrganizationUISettingsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "f7c5a36bb8d1666bd3f78cd353d1bcc9",
    "id": null,
    "metadata": {},
    "name": "OrganizationUISettingsQuery",
    "operationKind": "query",
    "text": "query OrganizationUISettingsQuery {\n  uiSettings {\n    embedBackgroundHex\n    primaryColorHex\n    secondaryColorHex\n    additionalColors {\n      value\n    }\n    fontColorHex\n    theme\n    cyoaOptionBackgroundColor\n    isCyoaOptionBackgroundColorDark\n    cyoaTextColor\n    borderColor\n    tagPrimaryColor\n    tagDotSize\n    tagPulseLevel\n    tagBadgeIconBorderRadius\n    tagTextColor\n    tagBadgeIconPadding\n    tagCustomIconUrl\n    tagVisibility\n  }\n}\n"
  }
};
})();

(node as any).hash = "8b361758d33e5cd88d9f74f186c9a407";

export default node;
