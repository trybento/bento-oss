/**
 * @generated SignedSource<<e9d8b53f639a1142ec078f8cc20cd327>>
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
export type NpsEndingTypeEnumType = "answer_based" | "date_based" | "manual";
export type NpsFollowUpQuestionTypeEnumType = "none" | "score_based" | "universal";
export type NpsPageTargetingTypeEnumType = "any_page" | "specific_page";
export type NpsStartingTypeEnumType = "date_based" | "manual";
export type NpsSurveyStateEnumType = "draft" | "live" | "stopped";
export type EditNpsQuery$variables = {
  entityId: any;
};
export type EditNpsQuery$data = {
  readonly launchedNpsSurveys: ReadonlyArray<{
    readonly entityId: any;
    readonly launchedAt: any | null;
    readonly name: string;
    readonly priorityRanking: number;
    readonly startingType: NpsStartingTypeEnumType;
  }>;
  readonly launchedTemplates: ReadonlyArray<{
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
  readonly npsSurvey: {
    readonly deletedAt: any | null;
    readonly endAfterTotalAnswers: number | null;
    readonly endAt: any | null;
    readonly endingType: NpsEndingTypeEnumType;
    readonly entityId: any;
    readonly fupSettings: any;
    readonly fupType: NpsFollowUpQuestionTypeEnumType;
    readonly launchedAt: any | null;
    readonly name: string;
    readonly pageTargeting: {
      readonly type: NpsPageTargetingTypeEnumType;
      readonly url: string | null;
    };
    readonly priorityRanking: number;
    readonly question: string;
    readonly repeatInterval: number | null;
    readonly startAt: any | null;
    readonly startingType: NpsStartingTypeEnumType;
    readonly state: NpsSurveyStateEnumType;
    readonly targets: any;
  } | null;
};
export type EditNpsQuery = {
  response: EditNpsQuery$data;
  variables: EditNpsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "entityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "entityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "question",
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
  "name": "fupType",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedAt",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fupSettings",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endingType",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "launchedAt",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startingType",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startAt",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "priorityRanking",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAfterTotalAnswers",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "repeatInterval",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "NpsSurveyPageTargeting",
  "kind": "LinkedField",
  "name": "pageTargeting",
  "plural": false,
  "selections": [
    (v17/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "targets",
  "storageKey": null
},
v20 = [
  {
    "kind": "Literal",
    "name": "launched",
    "value": true
  }
],
v21 = [
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
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoLaunchEnabled",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditNpsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurvey",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "launchedNpsSurveys",
        "args": (v20/*: any*/),
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurveys",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v10/*: any*/),
          (v12/*: any*/),
          (v14/*: any*/)
        ],
        "storageKey": "npsSurveys(launched:true)"
      },
      {
        "alias": "launchedTemplates",
        "args": (v21/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/),
          (v10/*: any*/),
          (v17/*: any*/),
          (v14/*: any*/),
          (v24/*: any*/),
          (v25/*: any*/),
          (v26/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v22/*: any*/),
              (v27/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditNpsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurvey",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v28/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "launchedNpsSurveys",
        "args": (v20/*: any*/),
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurveys",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v10/*: any*/),
          (v12/*: any*/),
          (v14/*: any*/),
          (v28/*: any*/)
        ],
        "storageKey": "npsSurveys(launched:true)"
      },
      {
        "alias": "launchedTemplates",
        "args": (v21/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/),
          (v10/*: any*/),
          (v17/*: any*/),
          (v14/*: any*/),
          (v24/*: any*/),
          (v25/*: any*/),
          (v26/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v22/*: any*/),
              (v27/*: any*/),
              (v28/*: any*/)
            ],
            "storageKey": null
          },
          (v28/*: any*/)
        ],
        "storageKey": "templates(autoLaunchableOnly:true,category:\"all\")"
      }
    ]
  },
  "params": {
    "cacheID": "2fe8e2525a7c7f3f88baef0fa4724797",
    "id": null,
    "metadata": {},
    "name": "EditNpsQuery",
    "operationKind": "query",
    "text": "query EditNpsQuery(\n  $entityId: EntityId!\n) {\n  npsSurvey(entityId: $entityId) {\n    entityId\n    name\n    question\n    state\n    fupType\n    deletedAt\n    fupSettings\n    endingType\n    launchedAt\n    endAt\n    startingType\n    startAt\n    priorityRanking\n    endAfterTotalAnswers\n    repeatInterval\n    pageTargeting {\n      type\n      url\n    }\n    targets\n    id\n  }\n  launchedNpsSurveys: npsSurveys(launched: true) {\n    entityId\n    name\n    launchedAt\n    startingType\n    priorityRanking\n    id\n  }\n  launchedTemplates: templates(autoLaunchableOnly: true, category: all) {\n    entityId\n    name\n    privateName\n    isCyoa\n    launchedAt\n    type\n    priorityRanking\n    isAutoLaunchEnabled\n    formFactor\n    designType\n    splitTargets {\n      entityId\n      name\n      privateName\n      displayTitle\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "176eb340385e91cf84cde4bbd1170444";

export default node;
