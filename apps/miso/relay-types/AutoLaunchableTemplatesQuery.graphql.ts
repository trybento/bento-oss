/**
 * @generated SignedSource<<7a4d8b74158af6c2626d96cf0bf62946>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type AutoLaunchableTemplatesQuery$variables = {};
export type AutoLaunchableTemplatesQuery$data = {
  readonly autoLaunchableTemplates: ReadonlyArray<{
    readonly entityId: any;
    readonly formFactor: GuideFormFactorEnumType | null;
    readonly isAutoLaunchEnabled: boolean | null;
    readonly isCyoa: boolean;
    readonly name: string | null;
    readonly priorityRanking: number;
  }>;
};
export type AutoLaunchableTemplatesQuery = {
  response: AutoLaunchableTemplatesQuery$data;
  variables: AutoLaunchableTemplatesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "autoLaunchableOnly",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "category",
    "value": "all"
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
  "name": "formFactor",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "priorityRanking",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoLaunchEnabled",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AutoLaunchableTemplatesQuery",
    "selections": [
      {
        "alias": "autoLaunchableTemplates",
        "args": (v0/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": "templates(autoLaunchableOnly:true,category:\"all\")"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AutoLaunchableTemplatesQuery",
    "selections": [
      {
        "alias": "autoLaunchableTemplates",
        "args": (v0/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
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
        "storageKey": "templates(autoLaunchableOnly:true,category:\"all\")"
      }
    ]
  },
  "params": {
    "cacheID": "40180aa41ea5d80d043a3018a21808cb",
    "id": null,
    "metadata": {},
    "name": "AutoLaunchableTemplatesQuery",
    "operationKind": "query",
    "text": "query AutoLaunchableTemplatesQuery {\n  autoLaunchableTemplates: templates(autoLaunchableOnly: true, category: all) {\n    entityId\n    name\n    formFactor\n    isCyoa\n    priorityRanking\n    isAutoLaunchEnabled\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "58b519fdb9543a4a7671809721ce8afe";

export default node;
