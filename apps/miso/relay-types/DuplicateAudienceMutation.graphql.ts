/**
 * @generated SignedSource<<7b73bf3546ef69a62b7fc50ac2f60b98>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DuplicateAudienceInput = {
  entityId: any;
  newName: string;
};
export type DuplicateAudienceMutation$variables = {
  input: DuplicateAudienceInput;
};
export type DuplicateAudienceMutation$data = {
  readonly duplicateAudience: {
    readonly audience: {
      readonly entityId: any;
    } | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type DuplicateAudienceMutation = {
  response: DuplicateAudienceMutation$data;
  variables: DuplicateAudienceMutation$variables;
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
  "name": "errors",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DuplicateAudienceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DuplicateAudiencePayload",
        "kind": "LinkedField",
        "name": "duplicateAudience",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AudienceRule",
            "kind": "LinkedField",
            "name": "audience",
            "plural": false,
            "selections": [
              (v3/*: any*/)
            ],
            "storageKey": null
          }
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
    "name": "DuplicateAudienceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DuplicateAudiencePayload",
        "kind": "LinkedField",
        "name": "duplicateAudience",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AudienceRule",
            "kind": "LinkedField",
            "name": "audience",
            "plural": false,
            "selections": [
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1e585df34477ea4b65fa76fd6c96c96c",
    "id": null,
    "metadata": {},
    "name": "DuplicateAudienceMutation",
    "operationKind": "mutation",
    "text": "mutation DuplicateAudienceMutation(\n  $input: DuplicateAudienceInput!\n) {\n  duplicateAudience(input: $input) {\n    errors\n    audience {\n      entityId\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1f184cdff9a9baa004257e4054d7e22b";

export default node;
