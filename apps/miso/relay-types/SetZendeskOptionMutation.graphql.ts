/**
 * @generated SignedSource<<d9c764dbec0d478d803b9bf45f0ee9ac>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SetZendeskOptionInput = {
  enabled: boolean;
  entityId?: any | null;
  option: string;
};
export type SetZendeskOptionMutation$variables = {
  input: SetZendeskOptionInput;
};
export type SetZendeskOptionMutation$data = {
  readonly setZendeskOption: {
    readonly integration: {
      readonly entityId: any;
    } | null;
  } | null;
};
export type SetZendeskOptionMutation = {
  response: SetZendeskOptionMutation$data;
  variables: SetZendeskOptionMutation$variables;
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
  "name": "entityId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SetZendeskOptionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SetZendeskOptionPayload",
        "kind": "LinkedField",
        "name": "setZendeskOption",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "IntegrationApiKey",
            "kind": "LinkedField",
            "name": "integration",
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
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SetZendeskOptionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SetZendeskOptionPayload",
        "kind": "LinkedField",
        "name": "setZendeskOption",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "IntegrationApiKey",
            "kind": "LinkedField",
            "name": "integration",
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
    "cacheID": "ad40440d6c89bf9495d1045d3551efcf",
    "id": null,
    "metadata": {},
    "name": "SetZendeskOptionMutation",
    "operationKind": "mutation",
    "text": "mutation SetZendeskOptionMutation(\n  $input: SetZendeskOptionInput!\n) {\n  setZendeskOption(input: $input) {\n    integration {\n      entityId\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4496c02b1bec9fea1395995cf2a07685";

export default node;
