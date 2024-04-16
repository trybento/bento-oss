/**
 * @generated SignedSource<<8276d2a81b7464c641b647e1ca42de61>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TemplateUsagePopoverQuery$variables = {
  templateEntityId: any;
};
export type TemplateUsagePopoverQuery$data = {
  readonly template: {
    readonly usage: {
      readonly autoLaunchedAccounts: number;
      readonly autoLaunchedUsers: number;
      readonly manualLaunchedAccounts: number;
      readonly manualLaunchedUsers: number;
    } | null;
  } | null;
};
export type TemplateUsagePopoverQuery = {
  response: TemplateUsagePopoverQuery$data;
  variables: TemplateUsagePopoverQuery$variables;
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
  "concreteType": "TemplateUsage",
  "kind": "LinkedField",
  "name": "usage",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "autoLaunchedAccounts",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "autoLaunchedUsers",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "manualLaunchedAccounts",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "manualLaunchedUsers",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TemplateUsagePopoverQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "TemplateUsagePopoverQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
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
    ]
  },
  "params": {
    "cacheID": "bdc73458c9e6b8fb18b291498285dc97",
    "id": null,
    "metadata": {},
    "name": "TemplateUsagePopoverQuery",
    "operationKind": "query",
    "text": "query TemplateUsagePopoverQuery(\n  $templateEntityId: EntityId!\n) {\n  template: findTemplate(entityId: $templateEntityId) {\n    usage {\n      autoLaunchedAccounts\n      autoLaunchedUsers\n      manualLaunchedAccounts\n      manualLaunchedUsers\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "43ac763b87ad7d69c22fa549024df8e5";

export default node;
