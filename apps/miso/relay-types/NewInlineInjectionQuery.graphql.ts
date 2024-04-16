/**
 * @generated SignedSource<<e70759af0d160e7a881b011ad42053b6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type InlineEmbedState = "active" | "inactive";
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type NewInlineInjectionQuery$variables = {};
export type NewInlineInjectionQuery$data = {
  readonly onboardingInlineEmbeds: ReadonlyArray<{
    readonly entityId: any;
    readonly state: InlineEmbedState;
    readonly url: string;
  } | null> | null;
  readonly organization: {
    readonly state: OrganizationStateEnumType;
    readonly visualBuilderDefaultUrl: string | null;
  };
  readonly uiSettings: {
    readonly theme: ThemeType;
  } | null;
};
export type NewInlineInjectionQuery = {
  response: NewInlineInjectionQuery$data;
  variables: NewInlineInjectionQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
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
      "name": "theme",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "visualBuilderDefaultUrl",
  "storageKey": null
},
v3 = {
  "alias": "onboardingInlineEmbeds",
  "args": null,
  "concreteType": "OrganizationInlineEmbed",
  "kind": "LinkedField",
  "name": "inlineEmbeds",
  "plural": true,
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
      "name": "url",
      "storageKey": null
    },
    (v1/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "NewInlineInjectionQuery",
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      (v3/*: any*/)
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "NewInlineInjectionQuery",
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
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
      (v3/*: any*/)
    ]
  },
  "params": {
    "cacheID": "ae510ecea9c552b0391bf166c15ab6f4",
    "id": null,
    "metadata": {},
    "name": "NewInlineInjectionQuery",
    "operationKind": "query",
    "text": "query NewInlineInjectionQuery {\n  uiSettings {\n    theme\n  }\n  organization {\n    state\n    visualBuilderDefaultUrl\n    id\n  }\n  onboardingInlineEmbeds: inlineEmbeds {\n    entityId\n    url\n    state\n  }\n}\n"
  }
};
})();

(node as any).hash = "de08791c48aa4150bd258090d34efc6e";

export default node;
