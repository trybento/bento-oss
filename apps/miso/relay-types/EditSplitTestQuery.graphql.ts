/**
 * @generated SignedSource<<7840f432b70827c25ec6fe01c78d95f5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AttributeValueTypeEnumType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type NpsStartingTypeEnumType = "date_based" | "manual";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
export type TargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetTypeEnumType = "all" | "attribute_rules" | "role";
export type TemplateState = "draft" | "live" | "removed" | "stopped";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type EditSplitTestQuery$variables = {
  splitTestEntityId: any;
};
export type EditSplitTestQuery$data = {
  readonly autoLaunchableTemplates: ReadonlyArray<{
    readonly designType: GuideDesignTypeEnumType;
    readonly entityId: any;
    readonly formFactor: GuideFormFactorEnumType | null;
    readonly isAutoLaunchEnabled: boolean | null;
    readonly isCyoa: boolean;
    readonly launchedAt: any | null;
    readonly name: string | null;
    readonly priorityRanking: number;
    readonly privateName: string | null;
    readonly splitTargets: ReadonlyArray<{
      readonly displayTitle: string | null;
      readonly entityId: any;
      readonly name: string | null;
      readonly privateName: string | null;
    } | null>;
    readonly type: GuideTypeEnumType;
  }>;
  readonly launchedNpsSurveys: ReadonlyArray<{
    readonly entityId: any;
    readonly launchedAt: any | null;
    readonly name: string;
    readonly priorityRanking: number;
    readonly startingType: NpsStartingTypeEnumType;
  }>;
  readonly splitTest: {
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
    readonly " $fragmentSpreads": FragmentRefs<"TemplateOverflowMenuButton_template">;
  } | null;
};
export type EditSplitTestQuery = {
  response: EditSplitTestQuery$data;
  variables: EditSplitTestQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "splitTestEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "splitTestEntityId"
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isTemplate",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "splitTestState",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "launchedAt",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propagationQueue",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propagationCount",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editedAt",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "targetingSet",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepsCount",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "archivedAt",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingType",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingUrl",
  "storageKey": null
},
v24 = {
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
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoLaunchEnabled",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "enableAutoLaunchAt",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "disableAutoLaunchAt",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "priorityRanking",
  "storageKey": null
},
v29 = [
  (v10/*: any*/),
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
],
v30 = {
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
      "selections": (v29/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v29/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "audiences",
      "plural": false,
      "selections": (v29/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v31 = [
  {
    "kind": "Literal",
    "name": "autoLaunchableOnly",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "category",
    "value": "all"
  }
],
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v33 = [
  {
    "kind": "Literal",
    "name": "launched",
    "value": true
  }
],
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startingType",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditSplitTestQuery",
    "selections": [
      {
        "alias": "splitTest",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
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
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v17/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v11/*: any*/),
              (v15/*: any*/),
              (v9/*: any*/),
              (v20/*: any*/)
            ],
            "storageKey": null
          },
          (v21/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/),
          (v24/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "modules",
            "plural": true,
            "selections": [
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v25/*: any*/),
          (v26/*: any*/),
          (v27/*: any*/),
          (v28/*: any*/),
          (v30/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TemplateOverflowMenuButton_template"
          }
        ],
        "storageKey": null
      },
      {
        "alias": "autoLaunchableTemplates",
        "args": (v31/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v12/*: any*/),
          (v10/*: any*/),
          (v28/*: any*/),
          (v25/*: any*/),
          (v15/*: any*/),
          (v17/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v32/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": "templates(autoLaunchableOnly:true,category:\"all\")"
      },
      {
        "alias": "launchedNpsSurveys",
        "args": (v33/*: any*/),
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurveys",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v12/*: any*/),
          (v34/*: any*/),
          (v28/*: any*/)
        ],
        "storageKey": "npsSurveys(launched:true)"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditSplitTestQuery",
    "selections": [
      {
        "alias": "splitTest",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
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
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v17/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v11/*: any*/),
              (v15/*: any*/),
              (v9/*: any*/),
              (v20/*: any*/),
              (v35/*: any*/)
            ],
            "storageKey": null
          },
          (v21/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/),
          (v24/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "modules",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v35/*: any*/)
            ],
            "storageKey": null
          },
          (v25/*: any*/),
          (v26/*: any*/),
          (v27/*: any*/),
          (v28/*: any*/),
          (v30/*: any*/),
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
            "name": "stoppedAt",
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
            "kind": "ScalarField",
            "name": "hasAutoLaunchedGuideBases",
            "storageKey": null
          },
          (v35/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "autoLaunchableTemplates",
        "args": (v31/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v12/*: any*/),
          (v10/*: any*/),
          (v28/*: any*/),
          (v25/*: any*/),
          (v15/*: any*/),
          (v17/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v32/*: any*/),
              (v35/*: any*/)
            ],
            "storageKey": null
          },
          (v35/*: any*/)
        ],
        "storageKey": "templates(autoLaunchableOnly:true,category:\"all\")"
      },
      {
        "alias": "launchedNpsSurveys",
        "args": (v33/*: any*/),
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurveys",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v12/*: any*/),
          (v34/*: any*/),
          (v28/*: any*/),
          (v35/*: any*/)
        ],
        "storageKey": "npsSurveys(launched:true)"
      }
    ]
  },
  "params": {
    "cacheID": "937175fba5afc1b8b8835f2e68154e73",
    "id": null,
    "metadata": {},
    "name": "EditSplitTestQuery",
    "operationKind": "query",
    "text": "query EditSplitTestQuery(\n  $splitTestEntityId: EntityId!\n) {\n  splitTest: findTemplate(entityId: $splitTestEntityId) {\n    entityId\n    name\n    privateName\n    isCyoa\n    isTemplate\n    state\n    splitTestState\n    description\n    type\n    theme\n    launchedAt\n    propagationQueue\n    propagationCount\n    formFactor\n    isSideQuest\n    designType\n    editedAt\n    targetingSet\n    splitTargets {\n      entityId\n      designType\n      name\n      privateName\n      isCyoa\n      theme\n      formFactor\n      description\n      stepsCount\n      id\n    }\n    archivedAt\n    pageTargetingType\n    pageTargetingUrl\n    notificationSettings {\n      disable\n      branching\n      input\n      action\n      info\n    }\n    modules {\n      name\n      id\n    }\n    isAutoLaunchEnabled\n    enableAutoLaunchAt\n    disableAutoLaunchAt\n    priorityRanking\n    targets {\n      account {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n      accountUser {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n      audiences {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n    }\n    ...TemplateOverflowMenuButton_template\n    id\n  }\n  autoLaunchableTemplates: templates(autoLaunchableOnly: true, category: all) {\n    entityId\n    name\n    privateName\n    isCyoa\n    launchedAt\n    type\n    priorityRanking\n    isAutoLaunchEnabled\n    formFactor\n    designType\n    splitTargets {\n      entityId\n      name\n      privateName\n      displayTitle\n      id\n    }\n    id\n  }\n  launchedNpsSurveys: npsSurveys(launched: true) {\n    entityId\n    name\n    launchedAt\n    startingType\n    priorityRanking\n    id\n  }\n}\n\nfragment TemplateOverflowMenuButton_template on Template {\n  name\n  type\n  isCyoa\n  formFactor\n  designType\n  isSideQuest\n  privateName\n  entityId\n  isTargetedForSplitTesting\n  theme\n  isAutoLaunchEnabled\n  enableAutoLaunchAt\n  disableAutoLaunchAt\n  archivedAt\n  stoppedAt\n  isTemplate\n  hasGuideBases\n  splitTargets {\n    name\n    privateName\n    id\n  }\n  hasAutoLaunchedGuideBases\n  targets {\n    account {\n      type\n      groups {\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n      }\n    }\n    accountUser {\n      type\n      groups {\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n      }\n    }\n    audiences {\n      type\n      groups {\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cc44f28f1dafdff5a4f8f570e32046d9";

export default node;
