/**
 * @generated SignedSource<<b30db4cd55c08f2b48ad2bb68a02971e>>
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
export type Template_targets$data = {
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
  readonly " $fragmentType": "Template_targets";
};
export type Template_targets$key = {
  readonly " $data"?: Template_targets$data;
  readonly " $fragmentSpreads": FragmentRefs<"Template_targets">;
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
  "name": "Template_targets",
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
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "TargetType",
          "kind": "LinkedField",
          "name": "audiences",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Template",
  "abstractKey": null
};
})();

(node as any).hash = "c3b338f69ca8d3bc7405445e0991accd";

export default node;
