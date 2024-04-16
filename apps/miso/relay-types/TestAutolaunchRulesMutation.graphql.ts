/**
 * @generated SignedSource<<9b4273c5b3f23fd535706fb0174f3b2d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AttributeValueTypeEnumType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type TargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetTypeEnumType = "all" | "attribute_rules" | "role";
export type TestAutolaunchRulesInput = {
  targets?: TemplateTargetsInputType | null;
  templateEntityId?: string | null;
};
export type TemplateTargetsInputType = {
  account: TemplateTargetInputType;
  accountUser: TemplateTargetInputType;
  audiences?: TemplateTargetInputType | null;
};
export type TemplateTargetInputType = {
  groups?: ReadonlyArray<TemplateTargetGroupInputType> | null;
  type: TargetTypeEnumType;
};
export type TemplateTargetGroupInputType = {
  rules: ReadonlyArray<TemplateTargetRuleInputType>;
};
export type TemplateTargetRuleInputType = {
  attribute: string;
  ruleType: TargetRuleTypeEnumType;
  value: any;
  valueType: AttributeValueTypeEnumType;
};
export type TestAutolaunchRulesMutation$variables = {
  input: TestAutolaunchRulesInput;
};
export type TestAutolaunchRulesMutation$data = {
  readonly testAutolaunchRules: {
    readonly accountUsers: number | null;
    readonly accounts: number | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type TestAutolaunchRulesMutation = {
  response: TestAutolaunchRulesMutation$data;
  variables: TestAutolaunchRulesMutation$variables;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "TestAutolaunchRulesPayload",
    "kind": "LinkedField",
    "name": "testAutolaunchRules",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accountUsers",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accounts",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "errors",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TestAutolaunchRulesMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TestAutolaunchRulesMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b4558b69b3c0efb789afed193bd577c4",
    "id": null,
    "metadata": {},
    "name": "TestAutolaunchRulesMutation",
    "operationKind": "mutation",
    "text": "mutation TestAutolaunchRulesMutation(\n  $input: TestAutolaunchRulesInput!\n) {\n  testAutolaunchRules(input: $input) {\n    accountUsers\n    accounts\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "ea3956a0f84f5c6555c2bc019244131e";

export default node;
