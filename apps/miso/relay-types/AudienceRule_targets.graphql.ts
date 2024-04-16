/**
 * @generated SignedSource<<23c2746e2c37cb427bb7310bbbb0123b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type AttributeValueTypeEnumType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type TargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetTypeEnumType = "all" | "attribute_rules" | "role";
import { FragmentRefs } from "relay-runtime";
export type AudienceRule_targets$data = {
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
  } | null;
  readonly " $fragmentType": "AudienceRule_targets";
};
export type AudienceRule_targets$key = {
  readonly " $data"?: AudienceRule_targets$data;
  readonly " $fragmentSpreads": FragmentRefs<"AudienceRule_targets">;
};

const node: ReaderFragment = (function(){
var v0 = [
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
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AudienceRule_targets",
  "selections": [
    {
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
          "selections": (v0/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "TargetType",
          "kind": "LinkedField",
          "name": "accountUser",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "AudienceRule",
  "abstractKey": null
};
})();

(node as any).hash = "b5528ac0c982d1f3ebddd2fd21bd8561";

export default node;
