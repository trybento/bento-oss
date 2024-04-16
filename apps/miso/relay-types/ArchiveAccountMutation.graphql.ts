/**
 * @generated SignedSource<<34479aa4bc3095f12b7ed593aea633fb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ArchiveAccountInput = {
  accountEntityId: any;
};
export type ArchiveAccountMutation$variables = {
  input: ArchiveAccountInput;
};
export type ArchiveAccountMutation$data = {
  readonly archiveAccount: {
    readonly account: {
      readonly entityId: any;
      readonly name: string;
    } | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type ArchiveAccountMutation = {
  response: ArchiveAccountMutation$data;
  variables: ArchiveAccountMutation$variables;
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
    "name": "ArchiveAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ArchiveAccountPayload",
        "kind": "LinkedField",
        "name": "archiveAccount",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
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
    "name": "ArchiveAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ArchiveAccountPayload",
        "kind": "LinkedField",
        "name": "archiveAccount",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
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
    "cacheID": "23b6e1dc2e47b1349a1fc9a28101f798",
    "id": null,
    "metadata": {},
    "name": "ArchiveAccountMutation",
    "operationKind": "mutation",
    "text": "mutation ArchiveAccountMutation(\n  $input: ArchiveAccountInput!\n) {\n  archiveAccount(input: $input) {\n    account {\n      entityId\n      name\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "3af858f67946e53c06f277db5a264391";

export default node;
