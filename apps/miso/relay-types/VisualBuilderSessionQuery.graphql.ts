/**
 * @generated SignedSource<<0465a5b5db54bb646ed049b3932026b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type OrganizationStateEnumType = "active" | "inactive" | "trial";
export type VisualBuilderSessionState = "cancelled" | "complete" | "in_progress" | "pending_url";
export type VisualBuilderSessionQuery$variables = {
  visualBuilderSessionEntityId: any;
};
export type VisualBuilderSessionQuery$data = {
  readonly organization: {
    readonly state: OrganizationStateEnumType;
  };
  readonly visualBuilderSession: {
    readonly entityId: any;
    readonly initialData: any;
    readonly progressData: any | null;
    readonly state: VisualBuilderSessionState;
  } | null;
};
export type VisualBuilderSessionQuery = {
  response: VisualBuilderSessionQuery$data;
  variables: VisualBuilderSessionQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "visualBuilderSessionEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "visualBuilderSessionEntityId"
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
  "name": "initialData",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "progressData",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v6 = {
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
    "name": "VisualBuilderSessionQuery",
    "selections": [
      {
        "alias": "visualBuilderSession",
        "args": (v1/*: any*/),
        "concreteType": "VisualBuilderSession",
        "kind": "LinkedField",
        "name": "findVisualBuilderSession",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v5/*: any*/)
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
    "name": "VisualBuilderSessionQuery",
    "selections": [
      {
        "alias": "visualBuilderSession",
        "args": (v1/*: any*/),
        "concreteType": "VisualBuilderSession",
        "kind": "LinkedField",
        "name": "findVisualBuilderSession",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "44c5773d142cde42bf5883d32b19ad95",
    "id": null,
    "metadata": {},
    "name": "VisualBuilderSessionQuery",
    "operationKind": "query",
    "text": "query VisualBuilderSessionQuery(\n  $visualBuilderSessionEntityId: EntityId!\n) {\n  visualBuilderSession: findVisualBuilderSession(entityId: $visualBuilderSessionEntityId) {\n    entityId\n    initialData\n    progressData\n    state\n    id\n  }\n  organization {\n    state\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1a314f2d0548f24b0f6b53ead842d7f0";

export default node;
