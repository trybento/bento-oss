/**
 * @generated SignedSource<<3190e8726cf3ea585b8ab40e05616b5e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteNpsSurveyInput = {
  entityId: any;
};
export type DeleteNpsSurveyMutation$variables = {
  input: DeleteNpsSurveyInput;
};
export type DeleteNpsSurveyMutation$data = {
  readonly deleteNpsSurvey: {
    readonly deletedNpsSurveyId: string | null;
  } | null;
};
export type DeleteNpsSurveyMutation = {
  response: DeleteNpsSurveyMutation$data;
  variables: DeleteNpsSurveyMutation$variables;
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
    "concreteType": "DeleteNpsSurveyPayload",
    "kind": "LinkedField",
    "name": "deleteNpsSurvey",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "deletedNpsSurveyId",
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
    "name": "DeleteNpsSurveyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteNpsSurveyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "56ee3214fc318fbbbb75f620d41421a5",
    "id": null,
    "metadata": {},
    "name": "DeleteNpsSurveyMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteNpsSurveyMutation(\n  $input: DeleteNpsSurveyInput!\n) {\n  deleteNpsSurvey(input: $input) {\n    deletedNpsSurveyId\n  }\n}\n"
  }
};
})();

(node as any).hash = "50a044815938265bddaab3c0cc758794";

export default node;
