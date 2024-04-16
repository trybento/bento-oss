/**
 * @generated SignedSource<<29e3d159d077501ce2f62a1927e0d1b8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type InlineEmbedAlignment = "center" | "left" | "right";
export type InlineEmbedPosition = "after" | "before" | "inside";
export type InlineEmbedState = "active" | "inactive";
export type InlineEmbedTargetingType = "all" | "attribute_rules" | "role";
export type TargetAttributeRuleRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
import { FragmentRefs } from "relay-runtime";
export type InlineEmbed_inlineEmbedWithTemplateId$data = {
  readonly alignment: InlineEmbedAlignment | null;
  readonly borderRadius: number;
  readonly bottomMargin: number;
  readonly elementSelector: string;
  readonly entityId: any;
  readonly leftMargin: number;
  readonly maxWidth: number | null;
  readonly padding: number;
  readonly position: InlineEmbedPosition;
  readonly rightMargin: number;
  readonly state: InlineEmbedState;
  readonly targeting: {
    readonly account: {
      readonly grouping: string | null;
      readonly rules: ReadonlyArray<{
        readonly attribute: string;
        readonly ruleType: TargetAttributeRuleRuleTypeEnumType;
        readonly value: any;
        readonly valueType: AttributeValueType;
      } | null> | null;
      readonly type: InlineEmbedTargetingType;
    };
    readonly accountUser: {
      readonly grouping: string | null;
      readonly rules: ReadonlyArray<{
        readonly attribute: string;
        readonly ruleType: TargetAttributeRuleRuleTypeEnumType;
        readonly value: any;
        readonly valueType: AttributeValueType;
      } | null> | null;
      readonly type: InlineEmbedTargetingType;
    };
  };
  readonly template: {
    readonly entityId: any;
  } | null;
  readonly topMargin: number;
  readonly url: string;
  readonly wildcardUrl: string;
  readonly " $fragmentType": "InlineEmbed_inlineEmbedWithTemplateId";
};
export type InlineEmbed_inlineEmbedWithTemplateId$key = {
  readonly " $data"?: InlineEmbed_inlineEmbedWithTemplateId$data;
  readonly " $fragmentSpreads": FragmentRefs<"InlineEmbed_inlineEmbedWithTemplateId">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v1 = [
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
    "concreteType": "InlineEmbedTargetingRule",
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
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "grouping",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InlineEmbed_inlineEmbedWithTemplateId",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "wildcardUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elementSelector",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "position",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "topMargin",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rightMargin",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bottomMargin",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "padding",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "borderRadius",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "leftMargin",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "alignment",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxWidth",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "InlineEmbedTargeting",
      "kind": "LinkedField",
      "name": "targeting",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "InlineEmbedTargetingSegment",
          "kind": "LinkedField",
          "name": "account",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "InlineEmbedTargetingSegment",
          "kind": "LinkedField",
          "name": "accountUser",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "state",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Template",
      "kind": "LinkedField",
      "name": "template",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "OrganizationInlineEmbed",
  "abstractKey": null
};
})();

(node as any).hash = "2f70ca73b6d67c3abadde1133715a7e8";

export default node;
