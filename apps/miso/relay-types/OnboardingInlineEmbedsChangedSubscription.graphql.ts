/**
 * @generated SignedSource<<460bd3a57c7998fda13d310271458aa8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type InlineEmbedAlignment = "center" | "left" | "right";
export type InlineEmbedPosition = "after" | "before" | "inside";
export type InlineEmbedState = "active" | "inactive";
export type InlineEmbedTargetingType = "all" | "attribute_rules" | "role";
export type TargetAttributeRuleRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type OnboardingInlineEmbedsChangedSubscription$variables = {};
export type OnboardingInlineEmbedsChangedSubscription$data = {
  readonly inlineEmbeds: ReadonlyArray<{
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
  } | null> | null;
};
export type OnboardingInlineEmbedsChangedSubscription = {
  response: OnboardingInlineEmbedsChangedSubscription$data;
  variables: OnboardingInlineEmbedsChangedSubscription$variables;
};

const node: ConcreteRequest = (function(){
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
  "name": "url",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topMargin",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rightMargin",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bottomMargin",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "leftMargin",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxWidth",
  "storageKey": null
},
v13 = [
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
],
v14 = {
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
      "selections": (v13/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "InlineEmbedTargetingSegment",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v13/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OnboardingInlineEmbedsChangedSubscription",
    "selections": [
      {
        "alias": "inlineEmbeds",
        "args": null,
        "concreteType": "OrganizationInlineEmbed",
        "kind": "LinkedField",
        "name": "onboardingInlineEmbedsChanged",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
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
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OnboardingInlineEmbedsChangedSubscription",
    "selections": [
      {
        "alias": "inlineEmbeds",
        "args": null,
        "concreteType": "OrganizationInlineEmbed",
        "kind": "LinkedField",
        "name": "onboardingInlineEmbedsChanged",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
            "plural": false,
            "selections": [
              (v0/*: any*/),
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
    "cacheID": "0fc9e3f9638da9b55559d8f5ca011738",
    "id": null,
    "metadata": {},
    "name": "OnboardingInlineEmbedsChangedSubscription",
    "operationKind": "subscription",
    "text": "subscription OnboardingInlineEmbedsChangedSubscription {\n  inlineEmbeds: onboardingInlineEmbedsChanged {\n    entityId\n    url\n    wildcardUrl\n    elementSelector\n    position\n    topMargin\n    rightMargin\n    bottomMargin\n    padding\n    borderRadius\n    leftMargin\n    alignment\n    maxWidth\n    targeting {\n      account {\n        type\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n        grouping\n      }\n      accountUser {\n        type\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n        grouping\n      }\n    }\n    state\n    template {\n      entityId\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "776d009a8f6c0f520b64fef91d169edc";

export default node;
