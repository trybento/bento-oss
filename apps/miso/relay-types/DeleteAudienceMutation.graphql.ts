/**
 * @generated SignedSource<<b7ea9ce4a56489cae893e547d69a355f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteAudienceInput = {
  entityId: any;
};
export type DeleteAudienceMutation$variables = {
  input: DeleteAudienceInput;
};
export type DeleteAudienceMutation$data = {
  readonly deleteAudience: {
    readonly deletedAudienceId: string | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type DeleteAudienceMutation = {
  response: DeleteAudienceMutation$data;
  variables: DeleteAudienceMutation$variables;
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
    "concreteType": "DeleteAudiencePayload",
    "kind": "LinkedField",
    "name": "deleteAudience",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "deletedAudienceId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "errors",
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
    "name": "DeleteAudienceMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteAudienceMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9a25eb8df90ee3f8e15902bd09a047d2",
    "id": null,
    "metadata": {},
    "name": "DeleteAudienceMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteAudienceMutation(\n  $input: DeleteAudienceInput!\n) {\n  deleteAudience(input: $input) {\n    deletedAudienceId\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "77befd10a20a2d7d399f7b0059dfc4d7";

export default node;
