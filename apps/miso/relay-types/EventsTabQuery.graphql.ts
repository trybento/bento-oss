/**
 * @generated SignedSource<<16ac34e4703ba30aa8d6729e2201256a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CustomApiEventEnum = "event" | "eventProperty";
export type EventSourceType = "api" | "bento" | "import" | "snippet";
export type EventsTabQuery$variables = {};
export type EventsTabQuery$data = {
  readonly customApiEvents: ReadonlyArray<{
    readonly entityId: any;
    readonly lastSeen: any | null;
    readonly mappedToAutocomplete: boolean | null;
    readonly name: string | null;
    readonly source: EventSourceType | null;
    readonly type: CustomApiEventEnum;
  } | null>;
};
export type EventsTabQuery = {
  response: EventsTabQuery$data;
  variables: EventsTabQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "excludeBentoEvents",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "type",
    "value": "event"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "source",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mappedToAutocomplete",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastSeen",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "EventsTabQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "CustomApiEvent",
        "kind": "LinkedField",
        "name": "customApiEvents",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": "customApiEvents(excludeBentoEvents:true,type:\"event\")"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "EventsTabQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "CustomApiEvent",
        "kind": "LinkedField",
        "name": "customApiEvents",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "customApiEvents(excludeBentoEvents:true,type:\"event\")"
      }
    ]
  },
  "params": {
    "cacheID": "5f37387ba0c56b8eb63277c041ec34f3",
    "id": null,
    "metadata": {},
    "name": "EventsTabQuery",
    "operationKind": "query",
    "text": "query EventsTabQuery {\n  customApiEvents(type: event, excludeBentoEvents: true) {\n    entityId\n    name\n    type\n    source\n    mappedToAutocomplete\n    lastSeen\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "dd43adb70887f4cf4742914091fe7b74";

export default node;
