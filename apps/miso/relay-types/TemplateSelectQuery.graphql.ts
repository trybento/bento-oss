/**
 * @generated SignedSource<<f717d25e87a95fceb9c43b76567151ae>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type TemplateSelectQuery$variables = {};
export type TemplateSelectQuery$data = {
  readonly templates: ReadonlyArray<{
    readonly designType: GuideDesignTypeEnumType;
    readonly entityId: any;
    readonly name: string | null;
    readonly privateName: string | null;
  }>;
};
export type TemplateSelectQuery = {
  response: TemplateSelectQuery$data;
  variables: TemplateSelectQuery$variables;
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
  "name": "privateName",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TemplateSelectQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "TemplateSelectQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
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
    "cacheID": "678a3be3eb7bb53b14813dc2fa02adce",
    "id": null,
    "metadata": {},
    "name": "TemplateSelectQuery",
    "operationKind": "query",
    "text": "query TemplateSelectQuery {\n  templates {\n    entityId\n    name\n    privateName\n    designType\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "0edda4a08442b4e69f89fe361410b85e";

export default node;
