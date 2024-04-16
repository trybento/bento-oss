/**
 * @generated SignedSource<<d0e4153dcd62c2ea5b99030f0049896f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type AttributeValueTypeEnumType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
export type TargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetTypeEnumType = "all" | "attribute_rules" | "role";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
import { FragmentRefs } from "relay-runtime";
export type TemplateOverflowMenuButton_template$data = {
  readonly archivedAt: any | null;
  readonly designType: GuideDesignTypeEnumType;
  readonly disableAutoLaunchAt: any | null;
  readonly enableAutoLaunchAt: any | null;
  readonly entityId: any;
  readonly formFactor: GuideFormFactorEnumType | null;
  readonly hasAutoLaunchedGuideBases: boolean;
  readonly hasGuideBases: boolean;
  readonly isAutoLaunchEnabled: boolean | null;
  readonly isCyoa: boolean;
  readonly isSideQuest: boolean | null;
  readonly isTargetedForSplitTesting: SplitTestStateEnumType;
  readonly isTemplate: boolean;
  readonly name: string | null;
  readonly privateName: string | null;
  readonly splitTargets: ReadonlyArray<{
    readonly name: string | null;
    readonly privateName: string | null;
  } | null>;
  readonly stoppedAt: any | null;
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
  readonly theme: ThemeType;
  readonly type: GuideTypeEnumType;
};
export type TemplateOverflowMenuButton_template$key = {
  readonly " $data"?: TemplateOverflowMenuButton_template$data;
  readonly " $fragmentSpreads": FragmentRefs<"TemplateOverflowMenuButton_template">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v3 = [
  (v1/*: any*/),
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
  "metadata": {
    "mask": false
  },
  "name": "TemplateOverflowMenuButton_template",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isCyoa",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "formFactor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "designType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isSideQuest",
      "storageKey": null
    },
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "entityId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isTargetedForSplitTesting",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "theme",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isAutoLaunchEnabled",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "enableAutoLaunchAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "disableAutoLaunchAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "archivedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "stoppedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isTemplate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasGuideBases",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Template",
      "kind": "LinkedField",
      "name": "splitTargets",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v2/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasAutoLaunchedGuideBases",
      "storageKey": null
    },
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
          "selections": (v3/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "TargetType",
          "kind": "LinkedField",
          "name": "accountUser",
          "plural": false,
          "selections": (v3/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "TargetType",
          "kind": "LinkedField",
          "name": "audiences",
          "plural": false,
          "selections": (v3/*: any*/),
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

(node as any).hash = "7cd00b75af0fbbc92bb05c6b5dc62abb";

export default node;
