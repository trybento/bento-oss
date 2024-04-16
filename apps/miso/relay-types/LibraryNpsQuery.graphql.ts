/**
 * @generated SignedSource<<4370a6c7e2f9ad1a73b1694aef9e5405>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type NpsSurveyStateEnumType = "draft" | "live" | "stopped";
export type LibraryNpsQuery$variables = {};
export type LibraryNpsQuery$data = {
  readonly npsSurveys: ReadonlyArray<{
    readonly entityId: any;
    readonly launchedAt: any | null;
    readonly name: string;
    readonly state: NpsSurveyStateEnumType;
    readonly totalAnswers: number;
  }>;
};
export type LibraryNpsQuery = {
  response: LibraryNpsQuery$data;
  variables: LibraryNpsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "launchedAt",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalAnswers",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LibraryNpsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurveys",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LibraryNpsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurveys",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
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
    "cacheID": "316abedb6e7b51af0e63211e53af2571",
    "id": null,
    "metadata": {},
    "name": "LibraryNpsQuery",
    "operationKind": "query",
    "text": "query LibraryNpsQuery {\n  npsSurveys {\n    entityId\n    name\n    state\n    launchedAt\n    totalAnswers\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "6e32526e94b3e6dbe7241460103f42ba";

export default node;
