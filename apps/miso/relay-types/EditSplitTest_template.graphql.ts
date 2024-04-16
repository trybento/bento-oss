/**
 * @generated SignedSource<<d8c7be5a27516c236b6919277904a32c>>
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
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
export type TargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetTypeEnumType = "all" | "attribute_rules" | "role";
export type TemplateState = "draft" | "live" | "removed" | "stopped";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
import { FragmentRefs } from "relay-runtime";
export type EditSplitTest_template$data = {
  readonly archivedAt: any | null;
  readonly description: string | null;
  readonly designType: GuideDesignTypeEnumType;
  readonly disableAutoLaunchAt: any | null;
  readonly editedAt: any | null;
  readonly enableAutoLaunchAt: any | null;
  readonly entityId: any;
  readonly formFactor: GuideFormFactorEnumType | null;
  readonly isAutoLaunchEnabled: boolean | null;
  readonly isCyoa: boolean;
  readonly isSideQuest: boolean | null;
  readonly isTemplate: boolean;
  readonly launchedAt: any | null;
  readonly modules: ReadonlyArray<{
    readonly name: string | null;
  }>;
  readonly name: string | null;
  readonly notificationSettings: {
    readonly action: boolean | null;
    readonly branching: boolean | null;
    readonly disable: boolean | null;
    readonly info: boolean | null;
    readonly input: boolean | null;
  } | null;
  readonly pageTargetingType: GuidePageTargetingEnumType;
  readonly pageTargetingUrl: string | null;
  readonly priorityRanking: number;
  readonly privateName: string | null;
  readonly propagationCount: number;
  readonly propagationQueue: number;
  readonly splitTargets: ReadonlyArray<{
    readonly description: string | null;
    readonly designType: GuideDesignTypeEnumType;
    readonly entityId: any;
    readonly formFactor: GuideFormFactorEnumType | null;
    readonly isCyoa: boolean;
    readonly name: string | null;
    readonly privateName: string | null;
    readonly stepsCount: number;
    readonly theme: ThemeType;
  } | null>;
  readonly splitTestState: SplitTestStateEnumType;
  readonly state: TemplateState;
  readonly targetingSet: any | null;
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
  readonly " $fragmentType": "EditSplitTest_template";
};
export type EditSplitTest_template$key = {
  readonly " $data"?: EditSplitTest_template$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditSplitTest_template">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v9 = [
  (v5/*: any*/),
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
  "name": "EditSplitTest_template",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
    (v3/*: any*/),
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
      "name": "state",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "splitTestState",
      "storageKey": null
    },
    (v4/*: any*/),
    (v5/*: any*/),
    (v6/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "launchedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "propagationQueue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "propagationCount",
      "storageKey": null
    },
    (v7/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isSideQuest",
      "storageKey": null
    },
    (v8/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "editedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "targetingSet",
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
        (v8/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v3/*: any*/),
        (v6/*: any*/),
        (v7/*: any*/),
        (v4/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "stepsCount",
          "storageKey": null
        }
      ],
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
      "name": "pageTargetingType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pageTargetingUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TemplateNotificationSettings",
      "kind": "LinkedField",
      "name": "notificationSettings",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "disable",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "branching",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "input",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "action",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "info",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Module",
      "kind": "LinkedField",
      "name": "modules",
      "plural": true,
      "selections": [
        (v1/*: any*/)
      ],
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
      "name": "priorityRanking",
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
          "selections": (v9/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "TargetType",
          "kind": "LinkedField",
          "name": "accountUser",
          "plural": false,
          "selections": (v9/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "TargetType",
          "kind": "LinkedField",
          "name": "audiences",
          "plural": false,
          "selections": (v9/*: any*/),
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

(node as any).hash = "1d2ad4f5ce9d3100b843a57d72d7abc6";

export default node;
