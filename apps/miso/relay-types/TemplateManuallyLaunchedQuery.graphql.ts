/**
 * @generated SignedSource<<1547b471ac7d3f899b729afd14d1e768>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TemplateManuallyLaunchedQuery$variables = {
  templateEntityId: any;
};
export type TemplateManuallyLaunchedQuery$data = {
  readonly template: {
    readonly manuallyLaunchedAccounts: ReadonlyArray<{
      readonly entityId: any;
      readonly name: string;
    } | null>;
  } | null;
};
export type TemplateManuallyLaunchedQuery = {
  response: TemplateManuallyLaunchedQuery$data;
  variables: TemplateManuallyLaunchedQuery$variables;
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
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TemplateManuallyLaunchedQuery",
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
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "manuallyLaunchedAccounts",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
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
    "name": "TemplateManuallyLaunchedQuery",
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
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "manuallyLaunchedAccounts",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "cede63d1882f3fe94a3b23c60c2333d6",
    "id": null,
    "metadata": {},
    "name": "TemplateManuallyLaunchedQuery",
    "operationKind": "query",
    "text": "query TemplateManuallyLaunchedQuery(\n  $templateEntityId: EntityId!\n) {\n  template: findTemplate(entityId: $templateEntityId) {\n    manuallyLaunchedAccounts {\n      entityId\n      name\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "6e4a7be67b0479183e7567c9e57767b8";

export default node;
