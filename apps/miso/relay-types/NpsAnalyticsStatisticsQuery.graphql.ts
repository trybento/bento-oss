/**
 * @generated SignedSource<<1970b049aec478086b00ea9bb309f0e8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type NpsAnalyticsStatisticsQuery$variables = {
  entityId: any;
};
export type NpsAnalyticsStatisticsQuery$data = {
  readonly npsSurvey: {
    readonly name: string;
    readonly scoreBreakdown: {
      readonly detractors: number;
      readonly passives: number;
      readonly promoters: number;
      readonly responses: number;
      readonly score: number | null;
    } | null;
    readonly totalViews: number;
  } | null;
};
export type NpsAnalyticsStatisticsQuery = {
  response: NpsAnalyticsStatisticsQuery$data;
  variables: NpsAnalyticsStatisticsQuery$variables;
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
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalViews",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "NpsScoreBreakdown",
  "kind": "LinkedField",
  "name": "scoreBreakdown",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "responses",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "promoters",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "passives",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "detractors",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "score",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NpsAnalyticsStatisticsQuery",
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
          (v4/*: any*/)
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
    "name": "NpsAnalyticsStatisticsQuery",
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
    "cacheID": "e8a6f83e8844558de3738a77228387ff",
    "id": null,
    "metadata": {},
    "name": "NpsAnalyticsStatisticsQuery",
    "operationKind": "query",
    "text": "query NpsAnalyticsStatisticsQuery(\n  $entityId: EntityId!\n) {\n  npsSurvey(entityId: $entityId) {\n    name\n    totalViews\n    scoreBreakdown {\n      responses\n      promoters\n      passives\n      detractors\n      score\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f579ccbfe62202d65bac13d41a8082c5";

export default node;
