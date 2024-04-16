/**
 * @generated SignedSource<<92f387198298b823117017f4d9caf799>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type NpsSurveyStateEnumType = "draft" | "live" | "stopped";
export type PauseNpsSurveyInput = {
  entityId: any;
};
export type PauseNpsSurveyMutation$variables = {
  input: PauseNpsSurveyInput;
};
export type PauseNpsSurveyMutation$data = {
  readonly pauseNpsSurvey: {
    readonly errors: ReadonlyArray<string> | null;
    readonly npsSurvey: {
      readonly entityId: any;
      readonly id: string;
      readonly launchedAt: any | null;
      readonly startAt: any | null;
      readonly state: NpsSurveyStateEnumType;
    } | null;
  } | null;
};
export type PauseNpsSurveyMutation = {
  response: PauseNpsSurveyMutation$data;
  variables: PauseNpsSurveyMutation$variables;
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
    "concreteType": "PauseNpsSurveyPayload",
    "kind": "LinkedField",
    "name": "pauseNpsSurvey",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "errors",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurvey",
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "launchedAt",
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
    "name": "PauseNpsSurveyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PauseNpsSurveyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b72e5fc33aae884979a69beb8c91e235",
    "id": null,
    "metadata": {},
    "name": "PauseNpsSurveyMutation",
    "operationKind": "mutation",
    "text": "mutation PauseNpsSurveyMutation(\n  $input: PauseNpsSurveyInput!\n) {\n  pauseNpsSurvey(input: $input) {\n    errors\n    npsSurvey {\n      id\n      entityId\n      state\n      startAt\n      launchedAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "52be60837a5ac38eeb982704e8634559";

export default node;
