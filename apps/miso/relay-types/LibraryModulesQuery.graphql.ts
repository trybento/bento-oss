/**
 * @generated SignedSource<<fa6e29f2bec97be200653c27ec4832a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type LibraryModulesQuery$variables = {};
export type LibraryModulesQuery$data = {
  readonly modules: ReadonlyArray<{
    readonly description: string | null;
    readonly displayTitle: string | null;
    readonly dynamicTemplates: ReadonlyArray<{
      readonly displayTitle: string | null;
      readonly entityId: any;
      readonly name: string | null;
    }>;
    readonly entityId: any;
    readonly hasBranchingStep: boolean | null;
    readonly hasInputStep: boolean | null;
    readonly lastEdited: {
      readonly timestamp: any | null;
      readonly user: {
        readonly email: string;
        readonly fullName: string | null;
      } | null;
    } | null;
    readonly lastUsedAt: any | null;
    readonly name: string | null;
    readonly templates: ReadonlyArray<{
      readonly displayTitle: string | null;
      readonly entityId: any;
      readonly name: string | null;
    }>;
  }>;
};
export type LibraryModulesQuery = {
  response: LibraryModulesQuery$data;
  variables: LibraryModulesQuery$variables;
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
  "name": "displayTitle",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timestamp",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastUsedAt",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBranchingStep",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasInputStep",
  "storageKey": null
},
v10 = [
  (v0/*: any*/),
  (v2/*: any*/),
  (v1/*: any*/)
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v12 = [
  (v0/*: any*/),
  (v2/*: any*/),
  (v1/*: any*/),
  (v11/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LibraryModulesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Module",
        "kind": "LinkedField",
        "name": "modules",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "TemplateLastEdited",
            "kind": "LinkedField",
            "name": "lastEdited",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": (v10/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "dynamicTemplates",
            "plural": true,
            "selections": (v10/*: any*/),
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LibraryModulesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Module",
        "kind": "LinkedField",
        "name": "modules",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "TemplateLastEdited",
            "kind": "LinkedField",
            "name": "lastEdited",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v11/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": (v12/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "dynamicTemplates",
            "plural": true,
            "selections": (v12/*: any*/),
            "storageKey": null
          },
          (v11/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e4fe203c693ab4b1a5203379b6ea8470",
    "id": null,
    "metadata": {},
    "name": "LibraryModulesQuery",
    "operationKind": "query",
    "text": "query LibraryModulesQuery {\n  modules {\n    entityId\n    name\n    displayTitle\n    description\n    lastEdited {\n      timestamp\n      user {\n        fullName\n        email\n        id\n      }\n    }\n    lastUsedAt\n    hasBranchingStep\n    hasInputStep\n    templates {\n      entityId\n      displayTitle\n      name\n      id\n    }\n    dynamicTemplates {\n      entityId\n      displayTitle\n      name\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "efae663e0fb3d285d932bd6e3d5041e1";

export default node;
