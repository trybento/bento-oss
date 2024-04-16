/**
 * @generated SignedSource<<262eb9ecdddd7e188dd6d1e32c04b8e1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ResetGuideBasesForAccountInput = {
  accountEntityId: any;
};
export type ResetGuideBasesForAccountMutation$variables = {
  input: ResetGuideBasesForAccountInput;
};
export type ResetGuideBasesForAccountMutation$data = {
  readonly resetGuideBasesForAccount: {
    readonly account: {
      readonly entityId: any;
      readonly name: string;
    } | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type ResetGuideBasesForAccountMutation = {
  response: ResetGuideBasesForAccountMutation$data;
  variables: ResetGuideBasesForAccountMutation$variables;
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
    "name": "ResetGuideBasesForAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ResetGuideBasesForAccountPayload",
        "kind": "LinkedField",
        "name": "resetGuideBasesForAccount",
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
    "name": "ResetGuideBasesForAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ResetGuideBasesForAccountPayload",
        "kind": "LinkedField",
        "name": "resetGuideBasesForAccount",
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
    "cacheID": "d2120d0862d7ce6330225d90de16ce96",
    "id": null,
    "metadata": {},
    "name": "ResetGuideBasesForAccountMutation",
    "operationKind": "mutation",
    "text": "mutation ResetGuideBasesForAccountMutation(\n  $input: ResetGuideBasesForAccountInput!\n) {\n  resetGuideBasesForAccount(input: $input) {\n    account {\n      entityId\n      name\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "4976a630b9db90a4117995e21383f9b6";

export default node;
