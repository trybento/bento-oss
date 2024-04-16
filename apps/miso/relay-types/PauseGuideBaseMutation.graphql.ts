/**
 * @generated SignedSource<<d4e0ddf8e41ee36f4e6c906d16a43ac5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GuideBaseState = "active" | "archived" | "draft" | "inactive" | "obsoleted" | "paused";
export type PauseGuideBaseInput = {
  guideBaseEntityId: any;
};
export type PauseGuideBaseMutation$variables = {
  input: PauseGuideBaseInput;
};
export type PauseGuideBaseMutation$data = {
  readonly pauseGuideBase: {
    readonly guideBase: {
      readonly entityId: any;
      readonly id: string;
      readonly state: GuideBaseState;
    } | null;
  } | null;
};
export type PauseGuideBaseMutation = {
  response: PauseGuideBaseMutation$data;
  variables: PauseGuideBaseMutation$variables;
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
    "concreteType": "PauseGuideBasePayload",
    "kind": "LinkedField",
    "name": "pauseGuideBase",
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
    "name": "PauseGuideBaseMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PauseGuideBaseMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5c23eed6943220333b751dba785c81ee",
    "id": null,
    "metadata": {},
    "name": "PauseGuideBaseMutation",
    "operationKind": "mutation",
    "text": "mutation PauseGuideBaseMutation(\n  $input: PauseGuideBaseInput!\n) {\n  pauseGuideBase(input: $input) {\n    guideBase {\n      id\n      entityId\n      state\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a83a36048474bb61521d17894ccf84f0";

export default node;
