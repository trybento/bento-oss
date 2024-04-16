/**
 * @generated SignedSource<<a97f88256f8902427a968b98f6e9085e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GuideBaseState = "active" | "archived" | "draft" | "inactive" | "obsoleted" | "paused";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type CustomerGuideBasesQuery$variables = {
  entityId: any;
};
export type CustomerGuideBasesQuery$data = {
  readonly account: {
    readonly archived: boolean;
    readonly entityId: any;
    readonly guideBases: ReadonlyArray<{
      readonly account: {
        readonly entityId: any;
        readonly name: string;
      };
      readonly accountGuide: {
        readonly entityId: any;
      } | null;
      readonly activatedAt: any | null;
      readonly averageCompletionPercentage: number;
      readonly averageStepsCompleted: number;
      readonly averageStepsViewed: number;
      readonly createdFromTemplate: {
        readonly entityId: any;
        readonly name: string | null;
        readonly privateName: string | null;
      } | null;
      readonly designType: GuideDesignTypeEnumType;
      readonly entityId: any;
      readonly formFactor: GuideFormFactorEnumType | null;
      readonly guideModuleBases: ReadonlyArray<{
        readonly hasBranchingStep: boolean | null;
        readonly hasInputStep: boolean | null;
      }>;
      readonly isCyoa: boolean;
      readonly isModifiedFromTemplate: boolean;
      readonly isSideQuest: boolean | null;
      readonly isTargetedForSplitTesting: SplitTestStateEnumType;
      readonly name: string | null;
      readonly participantsWhoViewedCount: number;
      readonly state: GuideBaseState;
      readonly theme: ThemeType;
      readonly type: GuideTypeEnumType;
      readonly wasAutoLaunched: boolean;
    }>;
    readonly name: string;
  } | null;
};
export type CustomerGuideBasesQuery = {
  response: CustomerGuideBasesQuery$data;
  variables: CustomerGuideBasesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "entityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "entityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "archived",
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
  "name": "activatedAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isTargetedForSplitTesting",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isModifiedFromTemplate",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "averageCompletionPercentage",
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
  "name": "privateName",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wasAutoLaunched",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBranchingStep",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasInputStep",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "averageStepsViewed",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "averageStepsCompleted",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "participantsWhoViewedCount",
  "storageKey": null
},
v23 = {
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
    "name": "CustomerGuideBasesQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "guideBases",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Guide",
                "kind": "LinkedField",
                "name": "accountGuide",
                "plural": false,
                "selections": [
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v5/*: any*/),
              (v6/*: any*/),
              (v3/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "createdFromTemplate",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v11/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v12/*: any*/),
              (v13/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideModuleBase",
                "kind": "LinkedField",
                "name": "guideModuleBases",
                "plural": true,
                "selections": [
                  (v14/*: any*/),
                  (v15/*: any*/)
                ],
                "storageKey": null
              },
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Account",
                "kind": "LinkedField",
                "name": "account",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          }
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
    "name": "CustomerGuideBasesQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "guideBases",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Guide",
                "kind": "LinkedField",
                "name": "accountGuide",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v23/*: any*/)
                ],
                "storageKey": null
              },
              (v5/*: any*/),
              (v6/*: any*/),
              (v3/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "createdFromTemplate",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v11/*: any*/),
                  (v3/*: any*/),
                  (v23/*: any*/)
                ],
                "storageKey": null
              },
              (v12/*: any*/),
              (v13/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideModuleBase",
                "kind": "LinkedField",
                "name": "guideModuleBases",
                "plural": true,
                "selections": [
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v23/*: any*/)
                ],
                "storageKey": null
              },
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Account",
                "kind": "LinkedField",
                "name": "account",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v2/*: any*/),
                  (v23/*: any*/)
                ],
                "storageKey": null
              },
              (v2/*: any*/),
              (v23/*: any*/)
            ],
            "storageKey": null
          },
          (v23/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "63861ef87d468b5aea66f96e5e1d0215",
    "id": null,
    "metadata": {},
    "name": "CustomerGuideBasesQuery",
    "operationKind": "query",
    "text": "query CustomerGuideBasesQuery(\n  $entityId: EntityId!\n) {\n  account: findAccount(entityId: $entityId) {\n    name\n    entityId\n    archived\n    guideBases {\n      accountGuide {\n        entityId\n        id\n      }\n      isCyoa\n      activatedAt\n      entityId\n      isTargetedForSplitTesting\n      isModifiedFromTemplate\n      averageCompletionPercentage\n      type\n      createdFromTemplate {\n        name\n        privateName\n        entityId\n        id\n      }\n      state\n      wasAutoLaunched\n      guideModuleBases {\n        hasBranchingStep\n        hasInputStep\n        id\n      }\n      formFactor\n      isSideQuest\n      theme\n      designType\n      averageStepsViewed\n      averageStepsCompleted\n      participantsWhoViewedCount\n      account {\n        entityId\n        name\n        id\n      }\n      name\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "6572000f2daf5fcf709562abdc84d322";

export default node;
