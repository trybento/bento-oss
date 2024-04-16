/**
 * @generated SignedSource<<ad8a889acb9a84c284a2948895923064>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type BranchingInfoQuery$variables = {
  guideStepBaseEntityId: any;
};
export type BranchingInfoQuery$data = {
  readonly guideStepBaseInfo: ReadonlyArray<{
    readonly choiceLabel: string | null;
    readonly usersSelected: ReadonlyArray<{
      readonly email: string | null;
      readonly fullName: string | null;
    } | null>;
  } | null> | null;
};
export type BranchingInfoQuery = {
  response: BranchingInfoQuery$data;
  variables: BranchingInfoQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "guideStepBaseEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "guideStepBaseEntityId",
    "variableName": "guideStepBaseEntityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "choiceLabel",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BranchingInfoQuery",
    "selections": [
      {
        "alias": "guideStepBaseInfo",
        "args": (v1/*: any*/),
        "concreteType": "GuideStepBaseBranchingInfo",
        "kind": "LinkedField",
        "name": "findGuideBaseStepBranches",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AccountUser",
            "kind": "LinkedField",
            "name": "usersSelected",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
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
    "name": "BranchingInfoQuery",
    "selections": [
      {
        "alias": "guideStepBaseInfo",
        "args": (v1/*: any*/),
        "concreteType": "GuideStepBaseBranchingInfo",
        "kind": "LinkedField",
        "name": "findGuideBaseStepBranches",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AccountUser",
            "kind": "LinkedField",
            "name": "usersSelected",
            "plural": true,
            "selections": [
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5350634540a27212eab5aae61e0dcadf",
    "id": null,
    "metadata": {},
    "name": "BranchingInfoQuery",
    "operationKind": "query",
    "text": "query BranchingInfoQuery(\n  $guideStepBaseEntityId: EntityId!\n) {\n  guideStepBaseInfo: findGuideBaseStepBranches(guideStepBaseEntityId: $guideStepBaseEntityId) {\n    choiceLabel\n    usersSelected {\n      fullName\n      email\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8300b99b2a0feb52954b5d31d1be7488";

export default node;
