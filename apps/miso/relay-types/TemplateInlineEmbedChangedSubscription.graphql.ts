/**
 * @generated SignedSource<<ba0da769fc9ff140c8bc37e28920e137>>
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
export type TemplateInlineEmbedChangedSubscription$variables = {
  templateEntityId: any;
};
export type TemplateInlineEmbedChangedSubscription$data = {
  readonly inlineEmbed: {
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
  } | null;
};
export type TemplateInlineEmbedChangedSubscription = {
  response: TemplateInlineEmbedChangedSubscription$data;
  variables: TemplateInlineEmbedChangedSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "templateEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "templateEntityId",
    "variableName": "templateEntityId"
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
  "name": "url",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topMargin",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rightMargin",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bottomMargin",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "leftMargin",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxWidth",
  "storageKey": null
},
v15 = [
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
v16 = {
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
      "selections": (v15/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "InlineEmbedTargetingSegment",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v15/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TemplateInlineEmbedChangedSubscription",
    "selections": [
      {
        "alias": "inlineEmbed",
        "args": (v1/*: any*/),
        "concreteType": "OrganizationInlineEmbed",
        "kind": "LinkedField",
        "name": "templateInlineEmbedChanged",
        "plural": false,
        "selections": [
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
          (v13/*: any*/),
          (v14/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
            "plural": false,
            "selections": [
              (v2/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TemplateInlineEmbedChangedSubscription",
    "selections": [
      {
        "alias": "inlineEmbed",
        "args": (v1/*: any*/),
        "concreteType": "OrganizationInlineEmbed",
        "kind": "LinkedField",
        "name": "templateInlineEmbedChanged",
        "plural": false,
        "selections": [
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
          (v13/*: any*/),
          (v14/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fb5ee93f11c725c186639551e4bad985",
    "id": null,
    "metadata": {},
    "name": "TemplateInlineEmbedChangedSubscription",
    "operationKind": "subscription",
    "text": "subscription TemplateInlineEmbedChangedSubscription(\n  $templateEntityId: EntityId!\n) {\n  inlineEmbed: templateInlineEmbedChanged(templateEntityId: $templateEntityId) {\n    entityId\n    url\n    wildcardUrl\n    elementSelector\n    position\n    topMargin\n    rightMargin\n    bottomMargin\n    padding\n    borderRadius\n    leftMargin\n    alignment\n    maxWidth\n    targeting {\n      account {\n        type\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n        grouping\n      }\n      accountUser {\n        type\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n        grouping\n      }\n    }\n    state\n    template {\n      entityId\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b706f0dd0187be09bc12aa4b39db71df";

export default node;
