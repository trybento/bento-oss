/**
 * @generated SignedSource<<834b689fd96b8e4c5b83abd31eb3588a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type EventAutocompletesQuery$variables = {
  entityId: any;
};
export type EventAutocompletesQuery$data = {
  readonly customApiEvent: {
    readonly autocompletes: ReadonlyArray<{
      readonly entityId: any;
      readonly module: {
        readonly entityId: any;
      } | null;
      readonly name: string;
      readonly templates: ReadonlyArray<{
        readonly entityId: any;
      } | null>;
    } | null>;
    readonly entityId: any;
  } | null;
};
export type EventAutocompletesQuery = {
  response: EventAutocompletesQuery$data;
  variables: EventAutocompletesQuery$variables;
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
v4 = [
  (v2/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = [
  (v2/*: any*/),
  (v5/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EventAutocompletesQuery",
    "selections": [
      {
        "alias": "customApiEvent",
        "args": (v1/*: any*/),
        "concreteType": "CustomApiEvent",
        "kind": "LinkedField",
        "name": "findCustomApiEvent",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototype",
            "kind": "LinkedField",
            "name": "autocompletes",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "templates",
                "plural": true,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "module",
                "plural": false,
                "selections": (v4/*: any*/),
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
    "name": "EventAutocompletesQuery",
    "selections": [
      {
        "alias": "customApiEvent",
        "args": (v1/*: any*/),
        "concreteType": "CustomApiEvent",
        "kind": "LinkedField",
        "name": "findCustomApiEvent",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototype",
            "kind": "LinkedField",
            "name": "autocompletes",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "templates",
                "plural": true,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "module",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "917f9065367c7f7a1dcc047b26a79351",
    "id": null,
    "metadata": {},
    "name": "EventAutocompletesQuery",
    "operationKind": "query",
    "text": "query EventAutocompletesQuery(\n  $entityId: EntityId!\n) {\n  customApiEvent: findCustomApiEvent(entityId: $entityId) {\n    entityId\n    autocompletes {\n      entityId\n      name\n      templates {\n        entityId\n        id\n      }\n      module {\n        entityId\n        id\n      }\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "215a01563d04091e31023d47728c945b";

export default node;
