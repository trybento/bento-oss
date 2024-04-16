/**
 * @generated SignedSource<<3aa73a6ef66ebc941108da9c761296f6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type NpsSurveyStateEnumType = "draft" | "live" | "stopped";
export type LaunchNpsSurveyInput = {
  entityId: any;
};
export type LaunchNpsSurveyMutation$variables = {
  input: LaunchNpsSurveyInput;
};
export type LaunchNpsSurveyMutation$data = {
  readonly launchNpsSurvey: {
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
export type LaunchNpsSurveyMutation = {
  response: LaunchNpsSurveyMutation$data;
  variables: LaunchNpsSurveyMutation$variables;
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
    "concreteType": "LaunchNpsSurveyPayload",
    "kind": "LinkedField",
    "name": "launchNpsSurvey",
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
    "name": "LaunchNpsSurveyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LaunchNpsSurveyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "25a94cae06fb6efc9b1e50bbf5dee245",
    "id": null,
    "metadata": {},
    "name": "LaunchNpsSurveyMutation",
    "operationKind": "mutation",
    "text": "mutation LaunchNpsSurveyMutation(\n  $input: LaunchNpsSurveyInput!\n) {\n  launchNpsSurvey(input: $input) {\n    errors\n    npsSurvey {\n      id\n      entityId\n      state\n      startAt\n      launchedAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4262dd22b37fa580abec8a7a1107d862";

export default node;
