/**
 * @generated SignedSource<<c7acd64c454292466fabcd365b93037e>>
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
export type NpsStartingTypeEnumType = "date_based" | "manual";
export type RankableObjectsQuery$variables = {};
export type RankableObjectsQuery$data = {
  readonly autoLaunchableTemplates: ReadonlyArray<{
    readonly designType: GuideDesignTypeEnumType;
    readonly entityId: any;
    readonly formFactor: GuideFormFactorEnumType | null;
    readonly isAutoLaunchEnabled: boolean | null;
    readonly isCyoa: boolean;
    readonly launchedAt: any | null;
    readonly name: string | null;
    readonly priorityRanking: number;
    readonly privateName: string | null;
    readonly splitTargets: ReadonlyArray<{
      readonly displayTitle: string | null;
      readonly entityId: any;
      readonly name: string | null;
      readonly privateName: string | null;
    } | null>;
    readonly type: GuideTypeEnumType;
  }>;
  readonly launchedNpsSurveys: ReadonlyArray<{
    readonly entityId: any;
    readonly launchedAt: any | null;
    readonly name: string;
    readonly priorityRanking: number;
    readonly startingType: NpsStartingTypeEnumType;
  }>;
};
export type RankableObjectsQuery = {
  response: RankableObjectsQuery$data;
  variables: RankableObjectsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "launched",
    "value": true
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
  "name": "launchedAt",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startingType",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "priorityRanking",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "autoLaunchableOnly",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "category",
    "value": "all"
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoLaunchEnabled",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v14 = {
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
    "name": "RankableObjectsQuery",
    "selections": [
      {
        "alias": "launchedNpsSurveys",
        "args": (v0/*: any*/),
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurveys",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": "npsSurveys(launched:true)"
      },
      {
        "alias": "autoLaunchableTemplates",
        "args": (v6/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v3/*: any*/),
          (v9/*: any*/),
          (v5/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v7/*: any*/),
              (v13/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": "templates(autoLaunchableOnly:true,category:\"all\")"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RankableObjectsQuery",
    "selections": [
      {
        "alias": "launchedNpsSurveys",
        "args": (v0/*: any*/),
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurveys",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v14/*: any*/)
        ],
        "storageKey": "npsSurveys(launched:true)"
      },
      {
        "alias": "autoLaunchableTemplates",
        "args": (v6/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v3/*: any*/),
          (v9/*: any*/),
          (v5/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v7/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/)
            ],
            "storageKey": null
          },
          (v14/*: any*/)
        ],
        "storageKey": "templates(autoLaunchableOnly:true,category:\"all\")"
      }
    ]
  },
  "params": {
    "cacheID": "c894b583cad9989f84977d64479cd520",
    "id": null,
    "metadata": {},
    "name": "RankableObjectsQuery",
    "operationKind": "query",
    "text": "query RankableObjectsQuery {\n  launchedNpsSurveys: npsSurveys(launched: true) {\n    entityId\n    name\n    launchedAt\n    startingType\n    priorityRanking\n    id\n  }\n  autoLaunchableTemplates: templates(autoLaunchableOnly: true, category: all) {\n    entityId\n    name\n    privateName\n    isCyoa\n    launchedAt\n    type\n    priorityRanking\n    isAutoLaunchEnabled\n    formFactor\n    designType\n    splitTargets {\n      entityId\n      name\n      privateName\n      displayTitle\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "ee310bb1be0bbaeeb52e8850774df3aa";

export default node;
