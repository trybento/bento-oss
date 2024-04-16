/**
 * @generated SignedSource<<a1df6b996faeaa8a38b46ce9e8ce9148>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type InlineEmbedAlignment = "center" | "left" | "right";
export type InlineEmbedPosition = "after" | "before" | "inside";
export type InlineEmbedState = "active" | "inactive";
export type InlineEmbedTargetingType = "all" | "attribute_rules" | "role";
export type TargetAttributeRuleRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type AnalyticsDataQuery$variables = {
  endDate: string;
  startDate: string;
  withLaunches: boolean;
};
export type AnalyticsDataQuery$data = {
  readonly analytics?: {
    readonly launches: ReadonlyArray<{
      readonly count: number;
      readonly seenDate: any;
      readonly template: {
        readonly name: string | null;
        readonly privateName: string | null;
      };
    }>;
  } | null;
  readonly orgInlineEmbeds: ReadonlyArray<{
    readonly entityId: any;
    readonly state: InlineEmbedState;
    readonly url: string;
    readonly wildcardUrl: string;
  } | null> | null;
  readonly templates: ReadonlyArray<{
    readonly designType: GuideDesignTypeEnumType;
    readonly entityId: any;
    readonly formFactor: GuideFormFactorEnumType | null;
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
    readonly inputsCount: number;
    readonly isCyoa: boolean;
    readonly isSideQuest: boolean | null;
    readonly isTemplate: boolean;
    readonly name: string | null;
    readonly pageTargetingType: GuidePageTargetingEnumType;
    readonly pageTargetingUrl: string | null;
    readonly privateName: string | null;
    readonly stats: {
      readonly accountsSeen: number | null;
      readonly averageStepsCompleted: number | null;
      readonly averageStepsCompletedForEngaged: number | null;
      readonly completedAStep: number | null;
      readonly guidesViewed: number | null;
      readonly guidesWithCompletedStep: number | null;
      readonly inputStepAnswersCount: number | null;
      readonly percentCompleted: number | null;
      readonly percentGuidesCompleted: number | null;
      readonly usersAnswered: number | null;
      readonly usersClickedCta: number | null;
      readonly usersDismissed: number | null;
      readonly usersSavedForLater: number | null;
      readonly usersSeenGuide: number | null;
    } | null;
    readonly taggedElements: ReadonlyArray<{
      readonly entityId: any;
      readonly url: string;
      readonly wildcardUrl: string;
    }>;
    readonly theme: ThemeType;
    readonly type: GuideTypeEnumType;
  }>;
};
export type AnalyticsDataQuery = {
  response: AnalyticsDataQuery$data;
  variables: AnalyticsDataQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "endDate"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "startDate"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "withLaunches"
},
v3 = [
  {
    "kind": "Variable",
    "name": "endDate",
    "variableName": "endDate"
  },
  {
    "kind": "Variable",
    "name": "startDate",
    "variableName": "startDate"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "seenDate",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "count",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v8 = [
  {
    "kind": "Literal",
    "name": "activeOnly",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "includeArchived",
    "value": false
  }
],
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "inputsCount",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingType",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingUrl",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isTemplate",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topMargin",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rightMargin",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bottomMargin",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "leftMargin",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxWidth",
  "storageKey": null
},
v32 = [
  (v14/*: any*/),
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
v33 = {
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
      "selections": (v32/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "InlineEmbedTargetingSegment",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v32/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "useLocked",
      "value": false
    }
  ],
  "concreteType": "TemplateStats",
  "kind": "LinkedField",
  "name": "stats",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usersSeenGuide",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "completedAStep",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "percentCompleted",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usersDismissed",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usersClickedCta",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usersSavedForLater",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "guidesViewed",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "guidesWithCompletedStep",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "percentGuidesCompleted",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "averageStepsCompleted",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "averageStepsCompletedForEngaged",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "inputStepAnswersCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usersAnswered",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountsSeen",
      "storageKey": null
    }
  ],
  "storageKey": "stats(useLocked:false)"
},
v36 = {
  "alias": "orgInlineEmbeds",
  "args": null,
  "concreteType": "OrganizationInlineEmbed",
  "kind": "LinkedField",
  "name": "inlineEmbeds",
  "plural": true,
  "selections": [
    (v9/*: any*/),
    (v20/*: any*/),
    (v21/*: any*/),
    (v34/*: any*/)
  ],
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AnalyticsDataQuery",
    "selections": [
      {
        "condition": "withLaunches",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": "Analytics",
            "kind": "LinkedField",
            "name": "analytics",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LaunchAnalyticsNode",
                "kind": "LinkedField",
                "name": "launches",
                "plural": true,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Template",
                    "kind": "LinkedField",
                    "name": "template",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v7/*: any*/)
                    ],
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
      {
        "alias": null,
        "args": (v8/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v9/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationInlineEmbed",
            "kind": "LinkedField",
            "name": "inlineEmbed",
            "plural": false,
            "selections": [
              (v9/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              (v23/*: any*/),
              (v24/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              (v27/*: any*/),
              (v28/*: any*/),
              (v29/*: any*/),
              (v30/*: any*/),
              (v31/*: any*/),
              (v33/*: any*/),
              (v34/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "template",
                "plural": false,
                "selections": [
                  (v9/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v35/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototypeTaggedElement",
            "kind": "LinkedField",
            "name": "taggedElements",
            "plural": true,
            "selections": [
              (v9/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": "templates(activeOnly:true,includeArchived:false)"
      },
      (v36/*: any*/)
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "AnalyticsDataQuery",
    "selections": [
      {
        "condition": "withLaunches",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": "Analytics",
            "kind": "LinkedField",
            "name": "analytics",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LaunchAnalyticsNode",
                "kind": "LinkedField",
                "name": "launches",
                "plural": true,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Template",
                    "kind": "LinkedField",
                    "name": "template",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v37/*: any*/)
                    ],
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
      {
        "alias": null,
        "args": (v8/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v9/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationInlineEmbed",
            "kind": "LinkedField",
            "name": "inlineEmbed",
            "plural": false,
            "selections": [
              (v9/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              (v23/*: any*/),
              (v24/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              (v27/*: any*/),
              (v28/*: any*/),
              (v29/*: any*/),
              (v30/*: any*/),
              (v31/*: any*/),
              (v33/*: any*/),
              (v34/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "template",
                "plural": false,
                "selections": [
                  (v9/*: any*/),
                  (v37/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v35/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototypeTaggedElement",
            "kind": "LinkedField",
            "name": "taggedElements",
            "plural": true,
            "selections": [
              (v9/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              (v37/*: any*/)
            ],
            "storageKey": null
          },
          (v37/*: any*/)
        ],
        "storageKey": "templates(activeOnly:true,includeArchived:false)"
      },
      (v36/*: any*/)
    ]
  },
  "params": {
    "cacheID": "6a6d5a1792bfd8a453d7ea9b0c2391b2",
    "id": null,
    "metadata": {},
    "name": "AnalyticsDataQuery",
    "operationKind": "query",
    "text": "query AnalyticsDataQuery(\n  $startDate: String!\n  $endDate: String!\n  $withLaunches: Boolean!\n) {\n  analytics(startDate: $startDate, endDate: $endDate) @include(if: $withLaunches) {\n    launches {\n      seenDate\n      count\n      template {\n        name\n        privateName\n        id\n      }\n    }\n  }\n  templates(includeArchived: false, activeOnly: true) {\n    entityId\n    name\n    privateName\n    designType\n    formFactor\n    isCyoa\n    theme\n    type\n    isSideQuest\n    inputsCount\n    pageTargetingType\n    pageTargetingUrl\n    isTemplate\n    inlineEmbed {\n      entityId\n      url\n      wildcardUrl\n      elementSelector\n      position\n      topMargin\n      rightMargin\n      bottomMargin\n      padding\n      borderRadius\n      leftMargin\n      alignment\n      maxWidth\n      targeting {\n        account {\n          type\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n          grouping\n        }\n        accountUser {\n          type\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n          grouping\n        }\n      }\n      state\n      template {\n        entityId\n        id\n      }\n    }\n    stats(useLocked: false) {\n      usersSeenGuide\n      completedAStep\n      percentCompleted\n      usersDismissed\n      usersClickedCta\n      usersSavedForLater\n      guidesViewed\n      guidesWithCompletedStep\n      percentGuidesCompleted\n      averageStepsCompleted\n      averageStepsCompletedForEngaged\n      inputStepAnswersCount\n      usersAnswered\n      accountsSeen\n    }\n    taggedElements {\n      entityId\n      url\n      wildcardUrl\n      id\n    }\n    id\n  }\n  orgInlineEmbeds: inlineEmbeds {\n    entityId\n    url\n    wildcardUrl\n    state\n  }\n}\n"
  }
};
})();

(node as any).hash = "cbd541c00385b2e39bf786b3417b6797";

export default node;
