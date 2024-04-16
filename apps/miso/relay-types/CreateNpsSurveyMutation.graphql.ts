/**
 * @generated SignedSource<<d26e82e9393c3894b624b81314e26df4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type NpsEndingTypeEnumType = "answer_based" | "date_based" | "manual";
export type NpsFollowUpQuestionTypeEnumType = "none" | "score_based" | "universal";
export type NpsPageTargetingTypeEnumType = "any_page" | "specific_page";
export type NpsStartingTypeEnumType = "date_based" | "manual";
export type NpsSurveyAttributeValueTypeEnumType = "boolean" | "date" | "number" | "stringArray" | "text";
export type NpsSurveyTargetGroupingEnumType = "all" | "any";
export type NpsSurveyTargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type NpsSurveyTargetTypeEnumType = "all" | "attribute_rules" | "role";
export type CreateNpsSurveyInput = {
  endAfterTotalAnswers?: number | null;
  endAt?: any | null;
  endingType?: NpsEndingTypeEnumType | null;
  fupSettings?: any | null;
  fupType?: NpsFollowUpQuestionTypeEnumType | null;
  name?: string | null;
  pageTargeting?: NpsSurveyPageTargetingInputType | null;
  priorityRanking?: number | null;
  question?: string | null;
  repeatInterval?: number | null;
  startAt?: any | null;
  startingType?: NpsStartingTypeEnumType | null;
  targets?: NpsSurveyTargetsInputType | null;
};
export type NpsSurveyPageTargetingInputType = {
  type?: NpsPageTargetingTypeEnumType | null;
  url?: string | null;
};
export type NpsSurveyTargetsInputType = {
  account: NpsSurveyTargetInputType;
  accountUser: NpsSurveyTargetInputType;
};
export type NpsSurveyTargetInputType = {
  grouping: NpsSurveyTargetGroupingEnumType;
  rules: ReadonlyArray<NpsSurveyTargetRuleInputType | null>;
  type: NpsSurveyTargetTypeEnumType;
};
export type NpsSurveyTargetRuleInputType = {
  attribute: string;
  ruleType: NpsSurveyTargetRuleTypeEnumType;
  value: any;
  valueType: NpsSurveyAttributeValueTypeEnumType;
};
export type CreateNpsSurveyMutation$variables = {
  input: CreateNpsSurveyInput;
};
export type CreateNpsSurveyMutation$data = {
  readonly createNpsSurvey: {
    readonly errors: ReadonlyArray<string> | null;
    readonly npsSurvey: {
      readonly entityId: any;
      readonly name: string;
    } | null;
  } | null;
};
export type CreateNpsSurveyMutation = {
  response: CreateNpsSurveyMutation$data;
  variables: CreateNpsSurveyMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
  "name": "errors",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateNpsSurveyMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateNpsSurveyPayload",
        "kind": "LinkedField",
        "name": "createNpsSurvey",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "NpsSurvey",
            "kind": "LinkedField",
            "name": "npsSurvey",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateNpsSurveyMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateNpsSurveyPayload",
        "kind": "LinkedField",
        "name": "createNpsSurvey",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "NpsSurvey",
            "kind": "LinkedField",
            "name": "npsSurvey",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
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
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "99f2b46e6dc4ac14406706b95f879685",
    "id": null,
    "metadata": {},
    "name": "CreateNpsSurveyMutation",
    "operationKind": "mutation",
    "text": "mutation CreateNpsSurveyMutation(\n  $input: CreateNpsSurveyInput!\n) {\n  createNpsSurvey(input: $input) {\n    npsSurvey {\n      entityId\n      name\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "eebaa2c7c8d28c5d9522bb668383f4ff";

export default node;
