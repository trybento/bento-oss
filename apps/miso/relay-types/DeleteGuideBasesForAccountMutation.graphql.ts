/**
 * @generated SignedSource<<56b22639aa137c90b10c0e4e4d4c9de8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteGuideBasesForAccountInput = {
  accountEntityId: any;
};
export type DeleteGuideBasesForAccountMutation$variables = {
  input: DeleteGuideBasesForAccountInput;
};
export type DeleteGuideBasesForAccountMutation$data = {
  readonly deleteGuideBasesForAccount: {
    readonly account: {
      readonly entityId: any;
      readonly name: string;
    } | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type DeleteGuideBasesForAccountMutation = {
  response: DeleteGuideBasesForAccountMutation$data;
  variables: DeleteGuideBasesForAccountMutation$variables;
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
    "name": "DeleteGuideBasesForAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteGuideBasesForAccountPayload",
        "kind": "LinkedField",
        "name": "deleteGuideBasesForAccount",
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
    "name": "DeleteGuideBasesForAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteGuideBasesForAccountPayload",
        "kind": "LinkedField",
        "name": "deleteGuideBasesForAccount",
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
    "cacheID": "bf7d797e88cceeef54747a11002c77ce",
    "id": null,
    "metadata": {},
    "name": "DeleteGuideBasesForAccountMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteGuideBasesForAccountMutation(\n  $input: DeleteGuideBasesForAccountInput!\n) {\n  deleteGuideBasesForAccount(input: $input) {\n    account {\n      entityId\n      name\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "90cc721041a1c470efade015192335da";

export default node;
