/**
 * @generated SignedSource<<b5d410bf66c1e4fa963e70c239ae9fc5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type NpsEndingTypeEnumType = "answer_based" | "date_based" | "manual";
export type NpsFollowUpQuestionTypeEnumType = "none" | "score_based" | "universal";
export type NpsPageTargetingTypeEnumType = "any_page" | "specific_page";
export type NpsStartingTypeEnumType = "date_based" | "manual";
export type NpsSurveyStateEnumType = "draft" | "live" | "stopped";
export type NpsDetailsQuery$variables = {
  npsEntityId: any;
};
export type NpsDetailsQuery$data = {
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
export type NpsDetailsQuery = {
  response: NpsDetailsQuery$data;
  variables: NpsDetailsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "npsEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "npsEntityId"
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
  "concreteType": "NpsSurveyPageTargeting",
  "kind": "LinkedField",
  "name": "pageTargeting",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
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
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "targets",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NpsDetailsQuery",
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
          (v17/*: any*/),
          (v18/*: any*/)
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
    "name": "NpsDetailsQuery",
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
          (v17/*: any*/),
          (v18/*: any*/),
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
    "cacheID": "82022fff77be73b270b977f6d7652ad2",
    "id": null,
    "metadata": {},
    "name": "NpsDetailsQuery",
    "operationKind": "query",
    "text": "query NpsDetailsQuery(\n  $npsEntityId: EntityId!\n) {\n  npsSurvey(entityId: $npsEntityId) {\n    entityId\n    name\n    question\n    state\n    fupType\n    deletedAt\n    fupSettings\n    endingType\n    launchedAt\n    endAt\n    startingType\n    startAt\n    priorityRanking\n    endAfterTotalAnswers\n    repeatInterval\n    pageTargeting {\n      type\n      url\n    }\n    targets\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "fc6257c331b0c9c63fa841b5986ee5d3";

export default node;
