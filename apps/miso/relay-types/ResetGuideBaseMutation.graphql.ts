/**
 * @generated SignedSource<<57e1d609e035e206711ec2d1cd05d7cd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ResetGuideBaseInput = {
  guideBaseEntityId: any;
};
export type ResetGuideBaseMutation$variables = {
  input: ResetGuideBaseInput;
};
export type ResetGuideBaseMutation$data = {
  readonly resetGuideBase: {
    readonly errors: ReadonlyArray<string> | null;
    readonly guideBase: {
      readonly entityId: any;
      readonly name: string | null;
    } | null;
  } | null;
};
export type ResetGuideBaseMutation = {
  response: ResetGuideBaseMutation$data;
  variables: ResetGuideBaseMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
  "name": "errors",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ResetGuideBaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ResetGuideBasePayload",
        "kind": "LinkedField",
        "name": "resetGuideBase",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "guideBase",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ResetGuideBaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ResetGuideBasePayload",
        "kind": "LinkedField",
        "name": "resetGuideBase",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "guideBase",
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
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3e3b6c3e620758547c6ea4f596f670de",
    "id": null,
    "metadata": {},
    "name": "ResetGuideBaseMutation",
    "operationKind": "mutation",
    "text": "mutation ResetGuideBaseMutation(\n  $input: ResetGuideBaseInput!\n) {\n  resetGuideBase(input: $input) {\n    guideBase {\n      entityId\n      name\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "1a8c79ea903444e4bea2cdedcce69406";

export default node;
