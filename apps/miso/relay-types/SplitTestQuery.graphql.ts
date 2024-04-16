/**
 * @generated SignedSource<<a665476674f2811cdb1b1d302c08231f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type SplitTestQuery$variables = {
  splitTestEntityId: any;
};
export type SplitTestQuery$data = {
  readonly splitTest: {
    readonly entityId: any;
    readonly name: string | null;
  } | null;
};
export type SplitTestQuery = {
  response: SplitTestQuery$data;
  variables: SplitTestQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "splitTestEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "splitTestEntityId"
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SplitTestQuery",
    "selections": [
      {
        "alias": "splitTest",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
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
    "name": "SplitTestQuery",
    "selections": [
      {
        "alias": "splitTest",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
    "cacheID": "98a83288e04282d3202e3c554c9b69b9",
    "id": null,
    "metadata": {},
    "name": "SplitTestQuery",
    "operationKind": "query",
    "text": "query SplitTestQuery(\n  $splitTestEntityId: EntityId!\n) {\n  splitTest: findTemplate(entityId: $splitTestEntityId) {\n    entityId\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1d0ab79273fb023a94901bce7ac26251";

export default node;
