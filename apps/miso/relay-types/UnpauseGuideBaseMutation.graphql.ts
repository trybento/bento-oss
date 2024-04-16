/**
 * @generated SignedSource<<9a3dd98cd313b84574cdfd57a8b9ae67>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GuideBaseState = "active" | "archived" | "draft" | "inactive" | "obsoleted" | "paused";
export type UnpauseGuideBaseInput = {
  guideBaseEntityId: any;
};
export type UnpauseGuideBaseMutation$variables = {
  input: UnpauseGuideBaseInput;
};
export type UnpauseGuideBaseMutation$data = {
  readonly unpauseGuideBase: {
    readonly guideBase: {
      readonly entityId: any;
      readonly id: string;
      readonly state: GuideBaseState;
    } | null;
  } | null;
};
export type UnpauseGuideBaseMutation = {
  response: UnpauseGuideBaseMutation$data;
  variables: UnpauseGuideBaseMutation$variables;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UnpauseGuideBasePayload",
    "kind": "LinkedField",
    "name": "unpauseGuideBase",
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "entityId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "state",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UnpauseGuideBaseMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UnpauseGuideBaseMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "471d8df2ba39a1bf0f3472392d233b7e",
    "id": null,
    "metadata": {},
    "name": "UnpauseGuideBaseMutation",
    "operationKind": "mutation",
    "text": "mutation UnpauseGuideBaseMutation(\n  $input: UnpauseGuideBaseInput!\n) {\n  unpauseGuideBase(input: $input) {\n    guideBase {\n      id\n      entityId\n      state\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "eb2d5a690805047206f0d36e04bf047e";

export default node;
