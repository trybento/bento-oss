/**
 * @generated SignedSource<<8114932e17769ff47a3bfee1a526f7e3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type VisualBuilderSessionType = "auto_guide_builder" | "autocomplete" | "inline" | "tag";
export type CreateVisualBuilderSessionInput = {
  initialData: any;
  type: VisualBuilderSessionType;
};
export type CreateVisualBuilderSessionMutation$variables = {
  input: CreateVisualBuilderSessionInput;
};
export type CreateVisualBuilderSessionMutation$data = {
  readonly createVisualBuilderSession: {
    readonly accessToken: string | null;
    readonly appId: string;
    readonly visualBuilderSession: {
      readonly entityId: any;
    } | null;
  } | null;
};
export type CreateVisualBuilderSessionMutation = {
  response: CreateVisualBuilderSessionMutation$data;
  variables: CreateVisualBuilderSessionMutation$variables;
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
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accessToken",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "appId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateVisualBuilderSessionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateVisualBuilderSessionPayload",
        "kind": "LinkedField",
        "name": "createVisualBuilderSession",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "VisualBuilderSession",
            "kind": "LinkedField",
            "name": "visualBuilderSession",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/),
          (v4/*: any*/)
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
    "name": "CreateVisualBuilderSessionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateVisualBuilderSessionPayload",
        "kind": "LinkedField",
        "name": "createVisualBuilderSession",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "VisualBuilderSession",
            "kind": "LinkedField",
            "name": "visualBuilderSession",
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
          },
          (v3/*: any*/),
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0ade8c3e66d4c9c5a577f25c0bb68225",
    "id": null,
    "metadata": {},
    "name": "CreateVisualBuilderSessionMutation",
    "operationKind": "mutation",
    "text": "mutation CreateVisualBuilderSessionMutation(\n  $input: CreateVisualBuilderSessionInput!\n) {\n  createVisualBuilderSession(input: $input) {\n    visualBuilderSession {\n      entityId\n      id\n    }\n    accessToken\n    appId\n  }\n}\n"
  }
};
})();

(node as any).hash = "17cd6457ee419007de84987cb7d7c4a0";

export default node;
