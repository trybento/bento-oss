/**
 * @generated SignedSource<<f7a8b7692ace4dd813f53bfeefd99c3d>>
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
export type InlineEmbed_inlineEmbedTargetingRule$data = {
  readonly attribute: string;
  readonly ruleType: TargetAttributeRuleRuleTypeEnumType;
  readonly value: any;
  readonly valueType: AttributeValueType;
  readonly " $fragmentType": "InlineEmbed_inlineEmbedTargetingRule";
};
export type InlineEmbed_inlineEmbedTargetingRule$key = {
  readonly " $data"?: InlineEmbed_inlineEmbedTargetingRule$data;
  readonly " $fragmentSpreads": FragmentRefs<"InlineEmbed_inlineEmbedTargetingRule">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InlineEmbed_inlineEmbedTargetingRule",
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

(node as any).hash = "8b0f2c6ff151a6430f3482cb5cb072fa";

export default node;
