/**
 * @generated SignedSource<<a586988527af9f932a99ba23e2c1a2a7>>
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
export type SaveNewAudienceInput = {
  name: string;
  targets?: TemplateTargetsInputType | null;
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
export type SaveNewAudienceMutation$variables = {
  input: SaveNewAudienceInput;
};
export type SaveNewAudienceMutation$data = {
  readonly saveNewAudience: {
    readonly audience: {
      readonly entityId: any;
    } | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type SaveNewAudienceMutation = {
  response: SaveNewAudienceMutation$data;
  variables: SaveNewAudienceMutation$variables;
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
  "name": "errors",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SaveNewAudienceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SaveNewAudiencePayload",
        "kind": "LinkedField",
        "name": "saveNewAudience",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AudienceRule",
            "kind": "LinkedField",
            "name": "audience",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
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
    "name": "SaveNewAudienceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SaveNewAudiencePayload",
        "kind": "LinkedField",
        "name": "saveNewAudience",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AudienceRule",
            "kind": "LinkedField",
            "name": "audience",
            "plural": false,
            "selections": [
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ad60a38ec0d4faae41bd0878f457f776",
    "id": null,
    "metadata": {},
    "name": "SaveNewAudienceMutation",
    "operationKind": "mutation",
    "text": "mutation SaveNewAudienceMutation(\n  $input: SaveNewAudienceInput!\n) {\n  saveNewAudience(input: $input) {\n    audience {\n      entityId\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "8c353a181d1915f95cc43184834ed925";

export default node;
