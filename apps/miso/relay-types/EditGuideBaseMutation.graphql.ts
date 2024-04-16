/**
 * @generated SignedSource<<fff75e4415e29e81e15278ce44b68d6e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GuideBaseState = "active" | "archived" | "draft" | "inactive" | "obsoleted" | "paused";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type EditGuideBaseInput = {
  data: EditGuideBaseGuideBaseInput;
  guideBaseEntityId: any;
};
export type EditGuideBaseGuideBaseInput = {
  description?: string | null;
  modules: ReadonlyArray<EditGuideModuleBaseInput>;
  name: string;
};
export type EditGuideModuleBaseInput = {
  createdFromModuleEntityId?: any | null;
  entityId?: any | null;
  name: string;
  steps: ReadonlyArray<EditGuideStepBaseInput>;
};
export type EditGuideStepBaseInput = {
  bodySlate?: any | null;
  createdFromStepPrototypeEntityId?: any | null;
  dismissLabel?: string | null;
  entityId?: any | null;
  name?: string | null;
  stepType: StepTypeEnum;
};
export type EditGuideBaseMutation$variables = {
  input: EditGuideBaseInput;
};
export type EditGuideBaseMutation$data = {
  readonly editGuideBase: {
    readonly errors: ReadonlyArray<string> | null;
    readonly guideBase: {
      readonly description: string | null;
      readonly guideModuleBases: ReadonlyArray<{
        readonly createdFromModule: {
          readonly entityId: any;
        } | null;
        readonly dynamicallyAddedByStep: {
          readonly entityId: any;
          readonly name: string;
        } | null;
        readonly entityId: any;
        readonly guideStepBases: ReadonlyArray<{
          readonly bodySlate: any | null;
          readonly createdFromStepPrototype: {
            readonly entityId: any;
            readonly isAutoCompletable: boolean;
          } | null;
          readonly dismissLabel: string | null;
          readonly entityId: any;
          readonly name: string;
          readonly orderIndex: number;
          readonly stepType: StepTypeEnum;
        }>;
        readonly name: string;
        readonly orderIndex: number;
        readonly participants: ReadonlyArray<{
          readonly email: string | null;
          readonly fullName: string | null;
        }>;
        readonly participantsCount: number;
        readonly participantsWhoViewed: ReadonlyArray<{
          readonly email: string | null;
          readonly fullName: string | null;
        }>;
        readonly participantsWhoViewedCount: number;
      }>;
      readonly name: string | null;
      readonly state: GuideBaseState;
    } | null;
  } | null;
};
export type EditGuideBaseMutation = {
  response: EditGuideBaseMutation$data;
  variables: EditGuideBaseMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
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
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "orderIndex",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dismissLabel",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoCompletable",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v13 = [
  (v11/*: any*/),
  (v12/*: any*/)
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "participantsCount",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "participantsWhoViewedCount",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "errors",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v18 = [
  (v11/*: any*/),
  (v12/*: any*/),
  (v17/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditGuideBaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditGuideBasePayload",
        "kind": "LinkedField",
        "name": "editGuideBase",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "guideBase",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideModuleBase",
                "kind": "LinkedField",
                "name": "guideModuleBases",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  (v3/*: any*/),
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuideStepBase",
                    "kind": "LinkedField",
                    "name": "guideStepBases",
                    "plural": true,
                    "selections": [
                      (v5/*: any*/),
                      (v3/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v6/*: any*/),
                      (v9/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepPrototype",
                        "kind": "LinkedField",
                        "name": "createdFromStepPrototype",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v10/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountUser",
                    "kind": "LinkedField",
                    "name": "participants",
                    "plural": true,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  },
                  (v14/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountUser",
                    "kind": "LinkedField",
                    "name": "participantsWhoViewed",
                    "plural": true,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  },
                  (v15/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Step",
                    "kind": "LinkedField",
                    "name": "dynamicallyAddedByStep",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Module",
                    "kind": "LinkedField",
                    "name": "createdFromModule",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v16/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditGuideBaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditGuideBasePayload",
        "kind": "LinkedField",
        "name": "editGuideBase",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "guideBase",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideModuleBase",
                "kind": "LinkedField",
                "name": "guideModuleBases",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  (v3/*: any*/),
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuideStepBase",
                    "kind": "LinkedField",
                    "name": "guideStepBases",
                    "plural": true,
                    "selections": [
                      (v5/*: any*/),
                      (v3/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v6/*: any*/),
                      (v9/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepPrototype",
                        "kind": "LinkedField",
                        "name": "createdFromStepPrototype",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v10/*: any*/),
                          (v17/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v17/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountUser",
                    "kind": "LinkedField",
                    "name": "participants",
                    "plural": true,
                    "selections": (v18/*: any*/),
                    "storageKey": null
                  },
                  (v14/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountUser",
                    "kind": "LinkedField",
                    "name": "participantsWhoViewed",
                    "plural": true,
                    "selections": (v18/*: any*/),
                    "storageKey": null
                  },
                  (v15/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Step",
                    "kind": "LinkedField",
                    "name": "dynamicallyAddedByStep",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v3/*: any*/),
                      (v17/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Module",
                    "kind": "LinkedField",
                    "name": "createdFromModule",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v17/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v17/*: any*/)
                ],
                "storageKey": null
              },
              (v17/*: any*/)
            ],
            "storageKey": null
          },
          (v16/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "80b17dd3b00edd7c2b17aa2f644b3afb",
    "id": null,
    "metadata": {},
    "name": "EditGuideBaseMutation",
    "operationKind": "mutation",
    "text": "mutation EditGuideBaseMutation(\n  $input: EditGuideBaseInput!\n) {\n  editGuideBase(input: $input) {\n    guideBase {\n      state\n      name\n      description\n      guideModuleBases {\n        entityId\n        name\n        orderIndex\n        guideStepBases {\n          entityId\n          name\n          bodySlate\n          stepType\n          orderIndex\n          dismissLabel\n          createdFromStepPrototype {\n            entityId\n            isAutoCompletable\n            id\n          }\n          id\n        }\n        participants {\n          fullName\n          email\n          id\n        }\n        participantsCount\n        participantsWhoViewed {\n          fullName\n          email\n          id\n        }\n        participantsWhoViewedCount\n        dynamicallyAddedByStep {\n          entityId\n          name\n          id\n        }\n        createdFromModule {\n          entityId\n          id\n        }\n        id\n      }\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "80f860febaad78af65a116b5296b4a26";

export default node;
