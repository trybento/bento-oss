/**
 * @generated SignedSource<<248e59e0bed1b74aedb82020ad8649ff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ModuleRuleType = "attribute_rules";
export type TemplateDynamicModulesQuery$variables = {
  templateEntityId: any;
};
export type TemplateDynamicModulesQuery$data = {
  readonly template: {
    readonly dynamicModules: ReadonlyArray<{
      readonly displayTitle: string | null;
      readonly entityId: any;
      readonly name: string | null;
      readonly targetingData: ReadonlyArray<{
        readonly autoLaunchRules: ReadonlyArray<{
          readonly ruleType: ModuleRuleType;
          readonly rules: ReadonlyArray<any>;
        }>;
        readonly targetTemplate: string;
      }>;
    }>;
  } | null;
};
export type TemplateDynamicModulesQuery = {
  response: TemplateDynamicModulesQuery$data;
  variables: TemplateDynamicModulesQuery$variables;
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
    "name": "entityId",
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "targetTemplate",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ruleType",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rules",
  "storageKey": null
},
v8 = {
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
    "name": "TemplateDynamicModulesQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "dynamicModules",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ModuleTargetingData",
                "kind": "LinkedField",
                "name": "targetingData",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ModuleAutoLaunchRule",
                    "kind": "LinkedField",
                    "name": "autoLaunchRules",
                    "plural": true,
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
    "name": "TemplateDynamicModulesQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "dynamicModules",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ModuleTargetingData",
                "kind": "LinkedField",
                "name": "targetingData",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ModuleAutoLaunchRule",
                    "kind": "LinkedField",
                    "name": "autoLaunchRules",
                    "plural": true,
                    "selections": [
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "be731efc4c60507cafb94a1efacfb0d9",
    "id": null,
    "metadata": {},
    "name": "TemplateDynamicModulesQuery",
    "operationKind": "query",
    "text": "query TemplateDynamicModulesQuery(\n  $templateEntityId: EntityId!\n) {\n  template: findTemplate(entityId: $templateEntityId) {\n    dynamicModules {\n      entityId\n      name\n      displayTitle\n      targetingData {\n        targetTemplate\n        autoLaunchRules {\n          ruleType\n          rules\n          id\n        }\n      }\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "0494fa30362326c70fd47e51f9e60d4b";

export default node;
