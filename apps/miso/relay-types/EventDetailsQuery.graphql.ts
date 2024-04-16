/**
 * @generated SignedSource<<a24f2e52a584288df1c23c2e877fff57>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CustomApiEventEnum = "event" | "eventProperty";
export type EventSourceType = "api" | "bento" | "import" | "snippet";
export type EventDetailsQuery$variables = {
  customApiEventEntityId: any;
};
export type EventDetailsQuery$data = {
  readonly customApiEvent: {
    readonly debugInformation: {
      readonly autoCompletedSteps: ReadonlyArray<{
        readonly name: string;
      } | null>;
      readonly payload: any | null;
      readonly triggeredByAccountUser: {
        readonly account: {
          readonly name: string;
        };
        readonly fullName: string | null;
      } | null;
    } | null;
    readonly entityId: any;
    readonly lastSeen: any | null;
    readonly name: string | null;
    readonly source: EventSourceType | null;
    readonly type: CustomApiEventEnum;
  } | null;
};
export type EventDetailsQuery = {
  response: EventDetailsQuery$data;
  variables: EventDetailsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "customApiEventEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "customApiEventEntityId"
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
  "name": "type",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "source",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastSeen",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "payload",
  "storageKey": null
},
v8 = [
  (v3/*: any*/)
],
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = [
  (v3/*: any*/),
  (v10/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EventDetailsQuery",
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
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "EventDebugInformation",
            "kind": "LinkedField",
            "name": "debugInformation",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepPrototype",
                "kind": "LinkedField",
                "name": "autoCompletedSteps",
                "plural": true,
                "selections": (v8/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountUser",
                "kind": "LinkedField",
                "name": "triggeredByAccountUser",
                "plural": false,
                "selections": [
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "account",
                    "plural": false,
                    "selections": (v8/*: any*/),
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
    "name": "EventDetailsQuery",
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
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "EventDebugInformation",
            "kind": "LinkedField",
            "name": "debugInformation",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StepPrototype",
                "kind": "LinkedField",
                "name": "autoCompletedSteps",
                "plural": true,
                "selections": (v11/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountUser",
                "kind": "LinkedField",
                "name": "triggeredByAccountUser",
                "plural": false,
                "selections": [
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "account",
                    "plural": false,
                    "selections": (v11/*: any*/),
                    "storageKey": null
                  },
                  (v10/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v10/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9349f11a9d3c3af184f81af65d925c1c",
    "id": null,
    "metadata": {},
    "name": "EventDetailsQuery",
    "operationKind": "query",
    "text": "query EventDetailsQuery(\n  $customApiEventEntityId: EntityId!\n) {\n  customApiEvent: findCustomApiEvent(entityId: $customApiEventEntityId) {\n    entityId\n    name\n    type\n    source\n    lastSeen\n    debugInformation {\n      payload\n      autoCompletedSteps {\n        name\n        id\n      }\n      triggeredByAccountUser {\n        fullName\n        account {\n          name\n          id\n        }\n        id\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "c5e7f9488e1c31182142a1d208333ce5";

export default node;
