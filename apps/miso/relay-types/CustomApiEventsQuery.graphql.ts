/**
 * @generated SignedSource<<9627eb841a44c2d2c5b5e2478c54b9c9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CustomApiEventEnum = "event" | "eventProperty";
export type EventSourceType = "api" | "bento" | "import" | "snippet";
export type CustomApiEventsQuery$variables = {
  excludeBentoEvents: boolean;
  excludePseudoEvents: boolean;
};
export type CustomApiEventsQuery$data = {
  readonly customApiEvents: ReadonlyArray<{
    readonly entityId: any;
    readonly name: string | null;
    readonly source: EventSourceType | null;
    readonly type: CustomApiEventEnum;
  } | null>;
};
export type CustomApiEventsQuery = {
  response: CustomApiEventsQuery$data;
  variables: CustomApiEventsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "excludeBentoEvents"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "excludePseudoEvents"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "excludeBentoEvents",
    "variableName": "excludeBentoEvents"
  },
  {
    "kind": "Variable",
    "name": "excludePseudoEvents",
    "variableName": "excludePseudoEvents"
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CustomApiEventsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CustomApiEvent",
        "kind": "LinkedField",
        "name": "customApiEvents",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
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
    "name": "CustomApiEventsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CustomApiEvent",
        "kind": "LinkedField",
        "name": "customApiEvents",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
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
    "cacheID": "a71409360c43ca34a6f404d4ea3e5534",
    "id": null,
    "metadata": {},
    "name": "CustomApiEventsQuery",
    "operationKind": "query",
    "text": "query CustomApiEventsQuery(\n  $excludeBentoEvents: Boolean!\n  $excludePseudoEvents: Boolean!\n) {\n  customApiEvents(excludeBentoEvents: $excludeBentoEvents, excludePseudoEvents: $excludePseudoEvents) {\n    entityId\n    name\n    type\n    source\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "a0382943b303f5036873b5f97727be10";

export default node;
