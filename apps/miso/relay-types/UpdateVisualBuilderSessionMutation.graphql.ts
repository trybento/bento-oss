/**
 * @generated SignedSource<<62ef2f623a6ae64b8e137b4e31405a27>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type VisualBuilderSessionState = "cancelled" | "complete" | "in_progress" | "pending_url";
export type UpdateVisualBuilderSessionInput = {
  previewData?: any | null;
  progressData?: any | null;
  state?: VisualBuilderSessionState | null;
  visualBuilderSessionEntityId: any;
};
export type UpdateVisualBuilderSessionMutation$variables = {
  input: UpdateVisualBuilderSessionInput;
};
export type UpdateVisualBuilderSessionMutation$data = {
  readonly updateVisualBuilderSession: {
    readonly visualBuilderSession: {
      readonly entityId: any;
    } | null;
  } | null;
};
export type UpdateVisualBuilderSessionMutation = {
  response: UpdateVisualBuilderSessionMutation$data;
  variables: UpdateVisualBuilderSessionMutation$variables;
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
    "name": "UpdateVisualBuilderSessionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateVisualBuilderSessionPayload",
        "kind": "LinkedField",
        "name": "updateVisualBuilderSession",
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
    "name": "UpdateVisualBuilderSessionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateVisualBuilderSessionPayload",
        "kind": "LinkedField",
        "name": "updateVisualBuilderSession",
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d582f393996748abf0c72999538a9000",
    "id": null,
    "metadata": {},
    "name": "UpdateVisualBuilderSessionMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateVisualBuilderSessionMutation(\n  $input: UpdateVisualBuilderSessionInput!\n) {\n  updateVisualBuilderSession(input: $input) {\n    visualBuilderSession {\n      entityId\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7b8b7d8980c4334a5fc7424dcf84684f";

export default node;
