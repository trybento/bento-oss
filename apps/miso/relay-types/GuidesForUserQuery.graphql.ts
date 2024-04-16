/**
 * @generated SignedSource<<9a6c3847b61ba6c00510e4b489741da2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GuidesForUserQuery$variables = {
  accountUserEntityId: any;
};
export type GuidesForUserQuery$data = {
  readonly findGuidesForUser: ReadonlyArray<{
    readonly createdFromTemplate: {
      readonly entityId: any;
    } | null;
    readonly entityId: any;
  } | null>;
};
export type GuidesForUserQuery = {
  response: GuidesForUserQuery$data;
  variables: GuidesForUserQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountUserEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "accountUserEntityId"
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
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GuidesForUserQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Guide",
        "kind": "LinkedField",
        "name": "findGuidesForUser",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "createdFromTemplate",
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
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GuidesForUserQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Guide",
        "kind": "LinkedField",
        "name": "findGuidesForUser",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "createdFromTemplate",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fa08f5ce76d0fd89d711360bf2b67df4",
    "id": null,
    "metadata": {},
    "name": "GuidesForUserQuery",
    "operationKind": "query",
    "text": "query GuidesForUserQuery(\n  $accountUserEntityId: EntityId!\n) {\n  findGuidesForUser(entityId: $accountUserEntityId) {\n    entityId\n    createdFromTemplate {\n      entityId\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "c75485805d6fba4c86fc2c98674dfd37";

export default node;
