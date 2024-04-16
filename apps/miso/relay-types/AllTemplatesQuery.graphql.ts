/**
 * @generated SignedSource<<cc36a849d07cf372351e95d585cf31aa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
export type TemplateState = "draft" | "live" | "removed" | "stopped";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type AllTemplatesQuery$variables = {
  withMeta: boolean;
};
export type AllTemplatesQuery$data = {
  readonly templates: ReadonlyArray<{
    readonly archivedAt?: any | null;
    readonly designType?: GuideDesignTypeEnumType;
    readonly entityId: any;
    readonly formFactor?: GuideFormFactorEnumType | null;
    readonly isCyoa: boolean;
    readonly isSideQuest: boolean | null;
    readonly isTargetedForSplitTesting: SplitTestStateEnumType;
    readonly name: string | null;
    readonly privateName: string | null;
    readonly state: TemplateState;
    readonly theme?: ThemeType;
    readonly type: GuideTypeEnumType;
  }>;
};
export type AllTemplatesQuery = {
  response: AllTemplatesQuery$data;
  variables: AllTemplatesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "withMeta"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isTargetedForSplitTesting",
  "storageKey": null
},
v9 = {
  "condition": "withMeta",
  "kind": "Condition",
  "passingValue": true,
  "selections": [
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
      "name": "designType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "formFactor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "archivedAt",
      "storageKey": null
    }
  ]
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AllTemplatesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/)
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
    "name": "AllTemplatesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
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
    "cacheID": "9433de669ead1527e108f0707f39bd2c",
    "id": null,
    "metadata": {},
    "name": "AllTemplatesQuery",
    "operationKind": "query",
    "text": "query AllTemplatesQuery(\n  $withMeta: Boolean!\n) {\n  templates {\n    entityId\n    name\n    type\n    privateName\n    state\n    isCyoa\n    isSideQuest\n    isTargetedForSplitTesting\n    theme @include(if: $withMeta)\n    designType @include(if: $withMeta)\n    formFactor @include(if: $withMeta)\n    archivedAt @include(if: $withMeta)\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "60c4820d448707f0eacea62e59eb6cda";

export default node;
