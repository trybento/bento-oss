/**
 * @generated SignedSource<<4006768f6d1e1d3adc137ff7160355e9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type CreateGuideBaseInput = {
  accountEntityId: any;
  templateEntityId: any;
};
export type CreateGuideBaseMutation$variables = {
  input: CreateGuideBaseInput;
  templateEntityId: any;
};
export type CreateGuideBaseMutation$data = {
  readonly createGuideBase: {
    readonly guideBase: {
      readonly account: {
        readonly hasGuideBaseWithTemplate: boolean;
      };
      readonly entityId: any;
      readonly formFactor: GuideFormFactorEnumType | null;
      readonly guideModuleBases: ReadonlyArray<{
        readonly guideStepBases: ReadonlyArray<{
          readonly body: string | null;
          readonly dismissLabel: string | null;
          readonly name: string;
          readonly stepType: StepTypeEnum;
        }>;
        readonly id: string;
        readonly name: string;
      }>;
      readonly id: string;
      readonly isSideQuest: boolean | null;
      readonly name: string | null;
      readonly type: GuideTypeEnumType;
    } | null;
  } | null;
};
export type CreateGuideBaseMutation = {
  response: CreateGuideBaseMutation$data;
  variables: CreateGuideBaseMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "templateEntityId"
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
  "args": [
    {
      "kind": "Variable",
      "name": "templateEntityId",
      "variableName": "templateEntityId"
    }
  ],
  "kind": "ScalarField",
  "name": "hasGuideBaseWithTemplate",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
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
  "name": "type",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dismissLabel",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateGuideBaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateGuideBasePayload",
        "kind": "LinkedField",
        "name": "createGuideBase",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "Account",
                "kind": "LinkedField",
                "name": "account",
                "plural": false,
                "selections": [
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideModuleBase",
                "kind": "LinkedField",
                "name": "guideModuleBases",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuideStepBase",
                    "kind": "LinkedField",
                    "name": "guideStepBases",
                    "plural": true,
                    "selections": [
                      (v5/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
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
    "name": "CreateGuideBaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateGuideBasePayload",
        "kind": "LinkedField",
        "name": "createGuideBase",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "Account",
                "kind": "LinkedField",
                "name": "account",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideModuleBase",
                "kind": "LinkedField",
                "name": "guideModuleBases",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuideStepBase",
                    "kind": "LinkedField",
                    "name": "guideStepBases",
                    "plural": true,
                    "selections": [
                      (v5/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
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
  "params": {
    "cacheID": "fd0bbee38a3f9d207a000e37099d76c8",
    "id": null,
    "metadata": {},
    "name": "CreateGuideBaseMutation",
    "operationKind": "mutation",
    "text": "mutation CreateGuideBaseMutation(\n  $input: CreateGuideBaseInput!\n  $templateEntityId: EntityId!\n) {\n  createGuideBase(input: $input) {\n    guideBase {\n      account {\n        hasGuideBaseWithTemplate(templateEntityId: $templateEntityId)\n        id\n      }\n      id\n      entityId\n      name\n      type\n      isSideQuest\n      formFactor\n      guideModuleBases {\n        id\n        name\n        guideStepBases {\n          name\n          body\n          stepType\n          dismissLabel\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "adcdf3d0362d9fe7ed9103f68d40b93f";

export default node;
