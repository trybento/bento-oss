/**
 * @generated SignedSource<<e890b1e75ee21fb64d27a42e1c7c01cd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AttributeValueTypeEnumType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type GuideCategoryEnumType = "all" | "content" | "splitTest";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
export type TargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetTypeEnumType = "all" | "attribute_rules" | "role";
export type TemplateState = "draft" | "live" | "removed" | "stopped";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type LibrarySplitTestsQuery$variables = {
  category: GuideCategoryEnumType;
};
export type LibrarySplitTestsQuery$data = {
  readonly templates: ReadonlyArray<{
    readonly editedAt: any | null;
    readonly editedBy: {
      readonly email: string;
      readonly fullName: string | null;
    } | null;
    readonly entityId: any;
    readonly isAutoLaunchEnabled: boolean | null;
    readonly lastUsedAt: any | null;
    readonly name: string | null;
    readonly splitTargets: ReadonlyArray<{
      readonly description: string | null;
      readonly designType: GuideDesignTypeEnumType;
      readonly entityId: any;
      readonly formFactor: GuideFormFactorEnumType | null;
      readonly name: string | null;
      readonly privateName: string | null;
      readonly theme: ThemeType;
    } | null>;
    readonly splitTestState: SplitTestStateEnumType;
    readonly state: TemplateState;
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
    readonly type: GuideTypeEnumType;
    readonly " $fragmentSpreads": FragmentRefs<"TemplateOverflowMenuButton_template">;
  }>;
};
export type LibrarySplitTestsQuery = {
  response: LibrarySplitTestsQuery$data;
  variables: LibrarySplitTestsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "category"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "category",
    "variableName": "category"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "splitTestState",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoLaunchEnabled",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastUsedAt",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
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
  "name": "formFactor",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editedAt",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v17 = [
  (v2/*: any*/),
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
v18 = {
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
      "selections": (v17/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v17/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "audiences",
      "plural": false,
      "selections": (v17/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v19 = {
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
    "name": "LibrarySplitTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v7/*: any*/),
              (v9/*: any*/),
              (v5/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/)
            ],
            "storageKey": null
          },
          (v14/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "editedBy",
            "plural": false,
            "selections": [
              (v15/*: any*/),
              (v16/*: any*/)
            ],
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TemplateOverflowMenuButton_template"
          },
          (v18/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LibrarySplitTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v7/*: any*/),
              (v9/*: any*/),
              (v5/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v19/*: any*/)
            ],
            "storageKey": null
          },
          (v14/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "editedBy",
            "plural": false,
            "selections": [
              (v15/*: any*/),
              (v16/*: any*/),
              (v19/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isCyoa",
            "storageKey": null
          },
          (v12/*: any*/),
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isSideQuest",
            "storageKey": null
          },
          (v10/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isTargetedForSplitTesting",
            "storageKey": null
          },
          (v11/*: any*/),
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
            "kind": "ScalarField",
            "name": "hasAutoLaunchedGuideBases",
            "storageKey": null
          },
          (v18/*: any*/),
          (v19/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2c9eb3534b8f9100597c37e0cb979dde",
    "id": null,
    "metadata": {},
    "name": "LibrarySplitTestsQuery",
    "operationKind": "query",
    "text": "query LibrarySplitTestsQuery(\n  $category: GuideCategoryEnumType!\n) {\n  templates(category: $category) {\n    type\n    state\n    splitTestState\n    name\n    isAutoLaunchEnabled\n    entityId\n    lastUsedAt\n    splitTargets {\n      entityId\n      designType\n      name\n      privateName\n      theme\n      formFactor\n      description\n      id\n    }\n    editedAt\n    editedBy {\n      fullName\n      email\n      id\n    }\n    ...TemplateOverflowMenuButton_template\n    targets {\n      account {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n      accountUser {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n      audiences {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment TemplateOverflowMenuButton_template on Template {\n  name\n  type\n  isCyoa\n  formFactor\n  designType\n  isSideQuest\n  privateName\n  entityId\n  isTargetedForSplitTesting\n  theme\n  isAutoLaunchEnabled\n  enableAutoLaunchAt\n  disableAutoLaunchAt\n  archivedAt\n  stoppedAt\n  isTemplate\n  hasGuideBases\n  splitTargets {\n    name\n    privateName\n    id\n  }\n  hasAutoLaunchedGuideBases\n  targets {\n    account {\n      type\n      groups {\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n      }\n    }\n    accountUser {\n      type\n      groups {\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n      }\n    }\n    audiences {\n      type\n      groups {\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fd3a54fd55859ecb81db7b73ae1e3ed5";

export default node;
