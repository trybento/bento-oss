/**
 * @generated SignedSource<<88084c38a94ff723e8e12ac145d1bd4b>>
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
export type SetAutoLaunchRulesAndTargetsForTemplateInput = {
  gptRequestId?: string | null;
  isAutoLaunchEnabled: boolean;
  onlySetAutolaunchState?: boolean | null;
  targets?: TemplateTargetsInputType | null;
  templateEntityId: any;
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
export type SetAutoLaunchRulesAndTargetsForTemplateMutation$variables = {
  input: SetAutoLaunchRulesAndTargetsForTemplateInput;
};
export type SetAutoLaunchRulesAndTargetsForTemplateMutation$data = {
  readonly setAutoLaunchRulesAndTargetsForTemplate: {
    readonly template: {
      readonly targets: {
        readonly account: {
          readonly groups: ReadonlyArray<{
            readonly rules: ReadonlyArray<{
              readonly attribute: string;
              readonly ruleType: TargetRuleTypeEnumType;
              readonly value: any;
              readonly valueType: AttributeValueTypeEnumType;
            }>;
          }> | null;
          readonly type: TargetTypeEnumType;
        };
        readonly accountUser: {
          readonly groups: ReadonlyArray<{
            readonly rules: ReadonlyArray<{
              readonly attribute: string;
              readonly ruleType: TargetRuleTypeEnumType;
              readonly value: any;
              readonly valueType: AttributeValueTypeEnumType;
            }>;
          }> | null;
          readonly type: TargetTypeEnumType;
        };
        readonly audiences: {
          readonly groups: ReadonlyArray<{
            readonly rules: ReadonlyArray<{
              readonly attribute: string;
              readonly ruleType: TargetRuleTypeEnumType;
              readonly value: any;
              readonly valueType: AttributeValueTypeEnumType;
            }>;
          }> | null;
          readonly type: TargetTypeEnumType;
        } | null;
      } | null;
    } | null;
  } | null;
};
export type SetAutoLaunchRulesAndTargetsForTemplateMutation = {
  response: SetAutoLaunchRulesAndTargetsForTemplateMutation$data;
  variables: SetAutoLaunchRulesAndTargetsForTemplateMutation$variables;
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
v2 = [
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
    "concreteType": "TargetGroupType",
    "kind": "LinkedField",
    "name": "groups",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TargetRuleType",
        "kind": "LinkedField",
        "name": "rules",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "attribute",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "ruleType",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "valueType",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "TargetsType",
  "kind": "LinkedField",
  "name": "targets",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "audiences",
      "plural": false,
      "selections": (v2/*: any*/),
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
    "name": "SetAutoLaunchRulesAndTargetsForTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SetAutoLaunchRulesAndTargetsForTemplatePayload",
        "kind": "LinkedField",
        "name": "setAutoLaunchRulesAndTargetsForTemplate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
            "plural": false,
            "selections": [
              (v3/*: any*/)
            ],
            "storageKey": null
          }
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
    "name": "SetAutoLaunchRulesAndTargetsForTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SetAutoLaunchRulesAndTargetsForTemplatePayload",
        "kind": "LinkedField",
        "name": "setAutoLaunchRulesAndTargetsForTemplate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
            "plural": false,
            "selections": [
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e3314dc67679315c0dad00e3f95bd9e2",
    "id": null,
    "metadata": {},
    "name": "SetAutoLaunchRulesAndTargetsForTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation SetAutoLaunchRulesAndTargetsForTemplateMutation(\n  $input: SetAutoLaunchRulesAndTargetsForTemplateInput!\n) {\n  setAutoLaunchRulesAndTargetsForTemplate(input: $input) {\n    template {\n      targets {\n        account {\n          type\n          groups {\n            rules {\n              attribute\n              ruleType\n              valueType\n              value\n            }\n          }\n        }\n        accountUser {\n          type\n          groups {\n            rules {\n              attribute\n              ruleType\n              valueType\n              value\n            }\n          }\n        }\n        audiences {\n          type\n          groups {\n            rules {\n              attribute\n              ruleType\n              valueType\n              value\n            }\n          }\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f844cb8e00d9aeca1413b76a8de8fecb";

export default node;
