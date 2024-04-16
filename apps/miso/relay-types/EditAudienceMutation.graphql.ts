/**
 * @generated SignedSource<<bb9b3b92a2be922c5110b1cab0e403c9>>
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
export type EditAudienceInput = {
  entityId: any;
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
export type EditAudienceMutation$variables = {
  input: EditAudienceInput;
};
export type EditAudienceMutation$data = {
  readonly editAudience: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type EditAudienceMutation = {
  response: EditAudienceMutation$data;
  variables: EditAudienceMutation$variables;
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
    "concreteType": "EditAudiencePayload",
    "kind": "LinkedField",
    "name": "editAudience",
    "plural": false,
    "selections": [
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
    "name": "EditAudienceMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditAudienceMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0386895bd1ff29f399e4c3faf906dd26",
    "id": null,
    "metadata": {},
    "name": "EditAudienceMutation",
    "operationKind": "mutation",
    "text": "mutation EditAudienceMutation(\n  $input: EditAudienceInput!\n) {\n  editAudience(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "7e0e3eae023ba4789d4e24199da322fd";

export default node;
