/**
 * @generated SignedSource<<22c52a0bc326998d789ef1c2a4ca1601>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type TargetAttributeRuleRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
import { FragmentRefs } from "relay-runtime";
export type InlineEmbed_inlineEmbedTargetingRules$data = ReadonlyArray<{
  readonly attribute: string;
  readonly ruleType: TargetAttributeRuleRuleTypeEnumType;
  readonly value: any;
  readonly valueType: AttributeValueType;
  readonly " $fragmentType": "InlineEmbed_inlineEmbedTargetingRules";
}>;
export type InlineEmbed_inlineEmbedTargetingRules$key = ReadonlyArray<{
  readonly " $data"?: InlineEmbed_inlineEmbedTargetingRules$data;
  readonly " $fragmentSpreads": FragmentRefs<"InlineEmbed_inlineEmbedTargetingRules">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "InlineEmbed_inlineEmbedTargetingRules",
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
  "type": "InlineEmbedTargetingRule",
  "abstractKey": null
};

(node as any).hash = "011946028dfb963b848d190516591a8a";

export default node;
